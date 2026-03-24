#!/usr/bin/env python3
"""
Деплой статики `out/` на Ubuntu-сервер через Paramiko (SFTP + SSH).
Секреты только из окружения: DEPLOY_HOST, DEPLOY_USER, DEPLOY_PASSWORD.

Пример (PowerShell):
  $env:DEPLOY_HOST="212.108.83.176"
  $env:DEPLOY_USER="root"
  $env:DEPLOY_PASSWORD="..."
  python scripts/deploy_ubuntu.py
"""

from __future__ import annotations

import os
import posixpath
import sys
from pathlib import Path

import paramiko

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "out"
REMOTE_ROOT = "/var/www/jazz2/out"
NGINX_AVAILABLE = "/etc/nginx/sites-available/jazz2"
NGINX_ENABLED = "/etc/nginx/sites-enabled/jazz2"
LOCAL_NGINX = ROOT / "deploy" / "nginx-jazz2.conf"


def getenv_required(name: str) -> str:
    v = os.environ.get(name, "").strip()
    if not v:
        print(f"Missing env: {name}", file=sys.stderr)
        sys.exit(1)
    return v


def sftp_mkdirs(sftp: paramiko.SFTPClient, remote_dir: str) -> None:
    parts = remote_dir.strip("/").split("/")
    cur = ""
    for p in parts:
        cur = f"{cur}/{p}" if cur else f"/{p}"
        try:
            sftp.stat(cur)
        except OSError:
            sftp.mkdir(cur)


def upload_tree(sftp: paramiko.SFTPClient, local: Path, remote: str) -> None:
    for path in sorted(local.rglob("*")):
        rel = path.relative_to(local)
        rpath = posixpath.join(remote, *rel.parts)
        if path.is_dir():
            try:
                sftp.mkdir(rpath)
            except OSError:
                pass
        else:
            parent = posixpath.dirname(rpath)
            sftp_mkdirs(sftp, parent)
            sftp.put(str(path), rpath)


def main() -> None:
    host = getenv_required("DEPLOY_HOST")
    user = os.environ.get("DEPLOY_USER", "root")
    password = getenv_required("DEPLOY_PASSWORD")

    if not OUT.is_dir():
        print(f"Нет каталога сборки: {OUT}\nСначала: npm run build", file=sys.stderr)
        sys.exit(1)
    if not LOCAL_NGINX.is_file():
        print(f"Нет {LOCAL_NGINX}", file=sys.stderr)
        sys.exit(1)

    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(
        host,
        username=user,
        password=password,
        timeout=30,
        allow_agent=False,
        look_for_keys=False,
    )

    try:
        stdin, stdout, stderr = client.exec_command(
            "mkdir -p /var/www/jazz2 && rm -rf /var/www/jazz2/out && mkdir -p /var/www/jazz2/out"
        )
        stdout.channel.recv_exit_status()
        err = stderr.read().decode()
        if err:
            print(err, file=sys.stderr)

        sftp = client.open_sftp()
        try:
            upload_tree(sftp, OUT, REMOTE_ROOT)
        finally:
            sftp.close()

        # nginx config
        with LOCAL_NGINX.open("rb") as f:
            data = f.read()
        sftp = client.open_sftp()
        try:
            with sftp.file(NGINX_AVAILABLE, "wb") as rf:
                rf.write(data)
        finally:
            sftp.close()

        cmds = f"""
set -e
ln -sf {NGINX_AVAILABLE} {NGINX_ENABLED}
chown -R root:root /var/www/jazz2
find /var/www/jazz2 -type d -exec chmod 755 {{}} \\;
find /var/www/jazz2 -type f -exec chmod 644 {{}} \\;
nginx -t
systemctl reload nginx
echo OK
"""
        stdin, stdout, stderr = client.exec_command(cmds)
        out = stdout.read().decode()
        e = stderr.read().decode()
        code = stdout.channel.recv_exit_status()
        print(out)
        if e:
            print(e, file=sys.stderr)
        if code != 0:
            sys.exit(code)
    finally:
        client.close()

    print(f"\nГотово. Откройте: http://{host}:8080/")


if __name__ == "__main__":
    main()
