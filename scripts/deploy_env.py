"""
Подставляет переменные деплоя из файла deploy.local.env в корне репозитория.
Создайте этот файл в редакторе (он в .gitignore) — без ручного export в терминале.
Уже заданные в окружении переменные не перезаписываются (удобно для CI).
"""
from __future__ import annotations

import os
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DEPLOY_LOCAL = ROOT / "deploy.local.env"


def apply_deploy_local_env() -> None:
    if not DEPLOY_LOCAL.is_file():
        return
    text = DEPLOY_LOCAL.read_text(encoding="utf-8")
    for raw in text.splitlines():
        line = raw.strip()
        if not line or line.startswith("#"):
            continue
        if "=" not in line:
            continue
        key, _, rest = line.partition("=")
        key = key.strip()
        if not key:
            continue
        val = rest.strip()
        if len(val) >= 2 and val[0] == val[-1] and val[0] in "\"'":
            val = val[1:-1]
        os.environ.setdefault(key, val)
