#!/usr/bin/env python3
"""
Скачивает с сервера каталоги data/ и storage/uploads/ в локальную папку backups/.

Переменные (как у deploy): DEPLOY_HOST, DEPLOY_PASSWORD, опционально DEPLOY_USER (по умолчанию root).
Файл deploy.local.env подхватывается автоматически.

Пример:
  npm run backup:remote
  python scripts/backup_remote.py
"""

from __future__ import annotations

import os
import stat
import sys
from datetime import datetime, timezone
from pathlib import Path

import paramiko

ROOT = Path(__file__).resolve().parents[1]
_SCRIPTS = Path(__file__).resolve().parent
if str(_SCRIPTS) not in sys.path:
    sys.path.insert(0, str(_SCRIPTS))
from deploy_env import apply_deploy_local_env  # noqa: E402

REMOTE_APP = "/var/www/jazz2-app"
BACKUPS_ROOT = ROOT / "backups"


def getenv_required(name: str) -> str:
    v = os.environ.get(name, "").strip()
    if not v:
        print(f"Missing env: {name}", file=sys.stderr)
        sys.exit(1)
    return v


def sftp_get_recursive(sftp: paramiko.SFTPClient, remote: str, local: Path) -> None:
    try:
        attrs = sftp.listdir_attr(remote)
    except OSError:
        return
    local.mkdir(parents=True, exist_ok=True)
    for attr in attrs:
        name = attr.filename
        if name in (".", ".."):
            continue
        rpath = f"{remote.rstrip('/')}/{name}"
        lpath = local / name
        if stat.S_ISDIR(attr.st_mode):
            sftp_get_recursive(sftp, rpath, lpath)
        else:
            lpath.parent.mkdir(parents=True, exist_ok=True)
            sftp.get(rpath, str(lpath))


def main() -> None:
    apply_deploy_local_env()
    host = getenv_required("DEPLOY_HOST")
    user = os.environ.get("DEPLOY_USER", "root")
    password = getenv_required("DEPLOY_PASSWORD")

    stamp = datetime.now(timezone.utc).strftime("%Y%m%d-%H%M%SZ")
    out = BACKUPS_ROOT / f"kafejazz-{stamp}"
    out.mkdir(parents=True, exist_ok=True)

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
            for label, remote_sub in (
                ("data", f"{REMOTE_APP}/data"),
                ("storage_uploads", f"{REMOTE_APP}/storage/uploads"),
            ):
                dest = out / label
                try:
                    sftp_get_recursive(sftp, remote_sub, dest)
                except OSError as e:
                    print(f"Note: {remote_sub}: {e}", file=sys.stderr)
            readme = out / "README.txt"
            readme.write_text(
                f"Backup from {host}:{REMOTE_APP}\n"
                f"UTC time: {stamp}\n"
                f"Contents: data/ -> data/, storage/uploads/ -> storage_uploads/\n"
                f"SQLite: see data/app.db (+ app.db-wal, app.db-shm if WAL).\n",
                encoding="utf-8",
            )
        finally:
            sftp.close()
    finally:
        client.close()

    print(f"OK: {out}")
    print(f"  (absolute: {out.resolve()})")


if __name__ == "__main__":
    main()
