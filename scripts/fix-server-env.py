#!/usr/bin/env python3
"""
Записать на VPS корректный .env для входа по паролю 513277.
Требует: DEPLOY_HOST, DEPLOY_PASSWORD (как deploy_ubuntu.py).

  set DEPLOY_HOST=212.108.83.176
  set DEPLOY_PASSWORD=...
  python scripts/fix-server-env.py
"""
import os
import sys

import paramiko

HASH = "$2b$12$yyJQYSpagXTVUTDbfED8g.f0369N5Bi1hS8p8MDhGFmc992Z5.TpK"
SESSION = os.environ.get("SESSION_SECRET", "").strip()
if len(SESSION) < 32:
    print("Set SESSION_SECRET (32+ chars) or it will be generated once.", file=sys.stderr)
    import secrets

    SESSION = secrets.token_hex(32)

ENV = "/var/www/jazz2-app/.env"
# В .env символы $ в bcrypt иначе подставляются как переменные — значение в кавычках.
body = f"""# Пароль админки: 513277
ADMIN_PASSWORD_HASH="{HASH}"
SESSION_SECRET="{SESSION}"
COOKIE_SECURE=true
"""


def main() -> None:
    host = os.environ.get("DEPLOY_HOST", "").strip()
    pwd = os.environ.get("DEPLOY_PASSWORD", "").strip()
    if not host or not pwd:
        print("Need DEPLOY_HOST and DEPLOY_PASSWORD", file=sys.stderr)
        sys.exit(1)
    c = paramiko.SSHClient()
    c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    c.connect(host, username="root", password=pwd, timeout=30, allow_agent=False, look_for_keys=False)
    sftp = c.open_sftp()
    with sftp.file(ENV, "wb") as f:
        f.write(body.encode("utf-8"))
    sftp.close()
    _, o, _ = c.exec_command(
        f"chown www-data:www-data {ENV} && chmod 600 {ENV} && systemctl restart jazz2"
    )
    o.channel.recv_exit_status()
    _, o2, _ = c.exec_command("systemctl is-active jazz2")
    print(o2.read().decode().strip())
    c.close()


if __name__ == "__main__":
    main()
