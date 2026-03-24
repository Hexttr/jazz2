#!/usr/bin/env python3
"""
Записать на VPS корректный .env для входа по паролю 513277.
Требует: DEPLOY_HOST, DEPLOY_PASSWORD; опционально DEPLOY_USER (по умолчанию root).
Для не-root: запись в /tmp и sudo mv/chown/systemctl (пароль sudo = DEPLOY_PASSWORD,
или DEPLOY_SUDO_PASSWORD если задан).
"""
from __future__ import annotations

import os
import secrets as pysecrets
import shlex
import sys
from io import BytesIO
from pathlib import Path

import paramiko

_SCRIPTS = Path(__file__).resolve().parent
if str(_SCRIPTS) not in sys.path:
    sys.path.insert(0, str(_SCRIPTS))
from deploy_env import apply_deploy_local_env  # noqa: E402

HASH = "$2b$12$yyJQYSpagXTVUTDbfED8g.f0369N5Bi1hS8p8MDhGFmc992Z5.TpK"
ENV = "/var/www/jazz2-app/.env"


def _sudo_password() -> str:
    return os.environ.get("DEPLOY_SUDO_PASSWORD", os.environ.get("DEPLOY_PASSWORD", "")).strip()


def _exec(client: paramiko.SSHClient, user: str, login_pwd: str, cmd: str) -> tuple[int, str, str]:
    if user == "root":
        stdin, stdout, stderr = client.exec_command(cmd)
        code = stdout.channel.recv_exit_status()
        return code, stdout.read().decode(errors="replace"), stderr.read().decode(errors="replace")
    quoted = shlex.quote(cmd)
    full = f"sudo -S bash -lc {quoted}"
    stdin, stdout, stderr = client.exec_command(full, get_pty=True)
    stdin.write(_sudo_password() + "\n")
    stdin.flush()
    code = stdout.channel.recv_exit_status()
    return code, stdout.read().decode(errors="replace"), stderr.read().decode(errors="replace")


def main() -> None:
    apply_deploy_local_env()

    session = os.environ.get("SESSION_SECRET", "").strip()
    if len(session) < 32:
        print("SESSION_SECRET не задан или короткий — будет сгенерирован новый.", file=sys.stderr)
        session = pysecrets.token_hex(32)

    body = f"""# Пароль админки: 513277
ADMIN_PASSWORD_HASH="{HASH}"
SESSION_SECRET="{session}"
COOKIE_SECURE=true
"""

    host = os.environ.get("DEPLOY_HOST", "").strip()
    login_pwd = os.environ.get("DEPLOY_PASSWORD", "").strip()
    user = (os.environ.get("DEPLOY_USER", "root") or "root").strip()
    if not host or not login_pwd:
        print(
            "Нужны DEPLOY_HOST и DEPLOY_PASSWORD (или deploy.local.env — см. deploy.local.env.example).",
            file=sys.stderr,
        )
        sys.exit(1)

    c = paramiko.SSHClient()
    c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    c.connect(
        host,
        username=user,
        password=login_pwd,
        timeout=45,
        allow_agent=False,
        look_for_keys=False,
    )
    try:
        sftp = c.open_sftp()
        try:
            if user == "root":
                with sftp.file(ENV, "wb") as f:
                    f.write(body.encode("utf-8"))
            else:
                tmp = f"/tmp/jazz2-admin-env.{pysecrets.token_hex(8)}"
                with sftp.file(tmp, "wb") as f:
                    f.write(body.encode("utf-8"))
                cmd = (
                    f"mv {shlex.quote(tmp)} {shlex.quote(ENV)} && "
                    f"chown www-data:www-data {shlex.quote(ENV)} && chmod 600 {shlex.quote(ENV)}"
                )
                code, out, err = _exec(c, user, login_pwd, cmd)
                if code != 0:
                    print(err or out, file=sys.stderr)
                    sys.exit(code)
        finally:
            sftp.close()

        code, out, err = _exec(
            c,
            user,
            login_pwd,
            "systemctl restart jazz2",
        )
        if code != 0:
            print(err or out, file=sys.stderr)
            sys.exit(code)

        code2, o2, e2 = _exec(c, user, login_pwd, "systemctl is-active jazz2")
        print((o2 or e2).strip())
    finally:
        c.close()


if __name__ == "__main__":
    main()
