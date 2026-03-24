#!/usr/bin/env python3
"""
Деплой полноценного Next.js-приложения на Ubuntu: git archive → npm ci → build → systemd + nginx.
Секреты: DEPLOY_HOST, DEPLOY_PASSWORD; опционально DEPLOY_DOTENV — путь к локальному .env для загрузки на сервер.

PowerShell:
  $env:DEPLOY_HOST="212.108.83.176"
  $env:DEPLOY_USER="root"
  $env:DEPLOY_PASSWORD="..."
  $env:DEPLOY_DOTENV="C:\\path\\.env"   # опционально
  python scripts/deploy_ubuntu.py

Приложение: /var/www/jazz2-app, порт 127.0.0.1:3001, снаружи http://HOST:8080/
"""

from __future__ import annotations

import os
import subprocess
import sys
import tempfile
from pathlib import Path

import paramiko

ROOT = Path(__file__).resolve().parents[1]
REMOTE_APP = "/var/www/jazz2-app"
REMOTE_TAR = "/tmp/jazz2-deploy.tgz"
REMOTE_ENV_IN = "/tmp/jazz2-env-from-local"
NGINX_AVAILABLE = "/etc/nginx/sites-available/jazz2"
NGINX_ENABLED = "/etc/nginx/sites-enabled/jazz2"
SYSTEMD_UNIT = "/etc/systemd/system/jazz2.service"
LOCAL_NGINX = ROOT / "deploy" / "nginx-jazz2.conf"
LOCAL_SYSTEMD = ROOT / "deploy" / "jazz2.service"


def getenv_required(name: str) -> str:
    v = os.environ.get(name, "").strip()
    if not v:
        print(f"Missing env: {name}", file=sys.stderr)
        sys.exit(1)
    return v


def make_archive(path: Path) -> None:
    subprocess.run(
        ["git", "-C", str(ROOT), "archive", "--format=tar.gz", "HEAD", "-o", str(path)],
        check=True,
    )


def main() -> None:
    host = getenv_required("DEPLOY_HOST")
    user = os.environ.get("DEPLOY_USER", "root")
    password = getenv_required("DEPLOY_PASSWORD")
    dotenv_local = os.environ.get("DEPLOY_DOTENV", "").strip()

    for p in (LOCAL_NGINX, LOCAL_SYSTEMD):
        if not p.is_file():
            print(f"Missing {p}", file=sys.stderr)
            sys.exit(1)

    with tempfile.NamedTemporaryFile(suffix=".tar.gz", delete=False) as tmp:
        tmp_path = Path(tmp.name)
    try:
        make_archive(tmp_path)
    except subprocess.CalledProcessError:
        print("git archive failed — commit your changes or fix git state.", file=sys.stderr)
        sys.exit(1)

    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(
        host,
        username=user,
        password=password,
        timeout=120,
        allow_agent=False,
        look_for_keys=False,
    )

    try:
        sftp = client.open_sftp()
        try:
            sftp.put(str(tmp_path), REMOTE_TAR)
            with LOCAL_NGINX.open("rb") as f:
                with sftp.file(NGINX_AVAILABLE, "wb") as rf:
                    rf.write(f.read())
            with LOCAL_SYSTEMD.open("rb") as f:
                with sftp.file(SYSTEMD_UNIT, "wb") as rf:
                    rf.write(f.read())
            if dotenv_local:
                lp = Path(dotenv_local)
                if lp.is_file():
                    with lp.open("rb") as f:
                        with sftp.file(REMOTE_ENV_IN, "wb") as rf:
                            rf.write(f.read())
                else:
                    print(f"DEPLOY_DOTENV not a file: {dotenv_local}", file=sys.stderr)
        finally:
            sftp.close()

        remote_script = """
set -e
APP="{app}"
TAR="{tar}"
ENVIN="{envin}"
if [ -f "$APP/.env" ]; then cp "$APP/.env" /tmp/jazz2.env.save; fi
rm -rf "$APP"
mkdir -p "$APP"
tar -xzf "$TAR" -C "$APP"
rm -f "$TAR"
if [ -f "$ENVIN" ]; then cp "$ENVIN" "$APP/.env" && rm -f "$ENVIN"; fi
if [ ! -f "$APP/.env" ] && [ -f /tmp/jazz2.env.save ]; then cp /tmp/jazz2.env.save "$APP/.env"; fi
if [ ! -f "$APP/.env" ] && [ -f "$APP/.env.example" ]; then cp "$APP/.env.example" "$APP/.env"; fi
rm -f /tmp/jazz2.env.save

cd "$APP"
# Не задавать NODE_ENV=production до сборки — иначе npm ci не ставит devDependencies (@tailwindcss/postcss и др.).
npm ci
npm run build
npm prune --omit=dev

chown -R www-data:www-data "$APP"

ln -sf {nginx_av} {nginx_en}
systemctl daemon-reload
systemctl enable jazz2
systemctl restart jazz2
nginx -t
systemctl reload nginx
echo OK
""".format(
            app=REMOTE_APP,
            tar=REMOTE_TAR,
            envin=REMOTE_ENV_IN,
            nginx_av=NGINX_AVAILABLE,
            nginx_en=NGINX_ENABLED,
        )

        stdin, stdout, stderr = client.exec_command(remote_script)
        out = stdout.read().decode()
        err = stderr.read().decode()
        code = stdout.channel.recv_exit_status()
        sys.stdout.buffer.write((out + "\n").encode("utf-8", errors="replace"))
        sys.stdout.buffer.flush()
        if err:
            sys.stderr.buffer.write((err + "\n").encode("utf-8", errors="replace"))
            sys.stderr.buffer.flush()
        if code != 0:
            sys.exit(code)
    finally:
        client.close()
        tmp_path.unlink(missing_ok=True)

    msg = f"\nOpen: http://{host}:8080/\nData: app writes to data/*.json and public/uploads/ on the server.\n"
    sys.stdout.buffer.write(msg.encode("utf-8", errors="replace"))
    sys.stdout.buffer.flush()


if __name__ == "__main__":
    main()
