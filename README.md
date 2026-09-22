# Кафе JAZZ (jazz2)

Публичный сайт кафе в Тамбове и админка контента. Продакшн: [https://www.kafejazz.ru/](https://www.kafejazz.ru/).

Стек: Next.js 16 (App Router), React, SQLite (`better-sqlite3`), Tailwind. На сервере процесс слушает только `127.0.0.1:3001`, снаружи его отдаёт nginx.

## Что видит посетитель

Главная страница `app/page.tsx` собирает блоки сверху вниз:

| Блок | Компонент | Откуда текст |
|---|---|---|
| Заставка PWA | `components/splash-screen.tsx` | зашита в коде |
| Шапка | `components/navigation.tsx` | слово «ДЖАЗ кафе» в коде; телефон — первое значение из контактов в БД |
| Первый экран | `components/hero.tsx` | `sections.hero` |
| О нас | `components/about.tsx` | `sections.about` |
| Меню | `components/menu-section.tsx` | `menu` + `sections.menu` |
| Банкеты | `components/events.tsx` | `sections.events` |
| Галерея | `components/gallery.tsx` | `sections.gallery` |
| Бронь зала | `components/reservation.tsx` | `sections.reservation` |
| Контакты и карта | `components/contacts.tsx` | `sections.contacts` |
| Подвал | `components/footer.tsx` | слоган и часы — `sections.footer`; адрес, телефоны и email — те же `sections.contacts` |

Карта Яндекса ищет тот же `sections.contacts.address`, что написан в карточке адреса. Общая функция: `lib/site-contacts.ts`.

Страница кэшируется на 5 минут (`revalidate = 300`). Сохранение в админке вызывает `revalidatePath("/")`.

## Источник правды

Живые тексты, меню, заявки и id получателей уведомлений лежат в **SQLite**, файл `data/app.db` (или путь из `DATABASE_PATH`).

Таблица одна: `kv(key, value)`, значение — JSON-строка.

| Ключ | Что это |
|---|---|
| `app_content` | `{ menu, sections }` — всё, что правит админка «Меню» и «Разделы» |
| `reservations` | заявки на бронь |
| `telegram` | `{ telegramId }` |
| `vk` | `{ peerId }` |
| `max` | `{ userId, chatId }` |

Запись и чтение: `lib/db.ts`, `lib/db-kv.ts`, `lib/content.ts`.

Админка не пишет в git и не пишет в `data/menu.json`. Она делает `POST /api/content` и `PUT` для telegram/vk/max. После сохранения сайт читает ту же запись `app_content`. Отдельной копии «для витрины» нет.

`data/menu.json` и `data/sections.json` — только начальный посев. `lib/db-migrate.ts` копирует их в `app_content` **один раз**, если ключа ещё нет. Правка этих файлов на уже работающем сайте ничего на проде не меняет. `data/app-content.json` — старый запасной файл на тот же случай пустой базы.

Если поля контактов в базе нет, компоненты подставляют запасные строки из `lib/site-contacts.ts`. На проде поля заполнены, поэтому посетитель видит текст из админки.

Телефоны в блоке брони — отдельное поле `sections.reservation.phones`. Телефоны в шапке, карточках и подвале — `sections.contacts.phones`. Сейчас в базе они совпадают; менять их нужно в своём разделе админки.

## Админка

Вход: `/admin/login`. Сессия — JWT в cookie (`lib/admin-session.ts`). Пароль проверяется по `ADMIN_PASSWORD_HASH` из `.env` на диске (`lib/admin-env.ts`), не из значения, зашитого при сборке.

| Раздел | URL | Что сохраняет |
|---|---|---|
| Обзор | `/admin` | только чтение статистики |
| Меню и блюда | `/admin/menu` | `app_content.menu` |
| Разделы сайта | `/admin/sections` | `app_content.sections` (герой, о нас, меню, банкеты, галерея, бронь, контакты, подвал) |
| Бронирование | `/admin/reservations` | статус заявок; id Telegram, VK и MAX |
| Диагностика | `/admin/debug` | откуда прочитан контент (`database` / `merged` / `seed`) |

Картинки из админки складываются в `storage/uploads/` и отдаются маршрутом `/uploads/...`.

Уведомление о новой заявке (`app/api/reservations/route.ts`):

- Telegram — токен `TELEGRAM_BOT_TOKEN`, чат из админки
- VK — токен `VK_ACCESS_TOKEN`, `peer_id` из админки
- MAX — токен `MAX_BOT_TOKEN`, `user_id` или `chat_id` из админки (`lib/max-notify.ts`)

Токены только в `.env` на сервере. Id получателей только в SQLite.

## Сервер

На одной машине несколько сайтов nginx. У этого проекта свои файлы, чужие vhost не трогать.

| Что | Где |
|---|---|
| Код и сборка | `/var/www/jazz2-app` |
| Процесс | systemd `jazz2.service`, `127.0.0.1:3001` |
| Домен | nginx-сайт `kafejazz` (`kafejazz.ru`, `www.kafejazz.ru`, сертификат Let's Encrypt) → `127.0.0.1:3001` |
| Запасной HTTP | nginx-сайт `jazz2`, порт `8080` → тот же процесс |
| Соседи | `superava`, `ufc6`, `ufc6pro` — другие `sites-enabled`, их конфиги деплой не перезаписывает |

Сайт `kafejazz` живёт только на сервере, в репозитории его нет. Скрипт деплоя заливает `deploy/nginx-jazz2.conf` как сайт `jazz2` (порт 8080) и `deploy/jazz2.service`, затем делает `nginx -t` и `reload`. Перед деплоем конфиг должен оставаться валидным: reload nginx общий для всех сайтов на машине.

База `data/app.db`, каталог `data/` и `storage/uploads/` при деплое копируются во временный каталог и возвращаются. `.env` сервера сохраняется, если локальный файл не передан через `DEPLOY_DOTENV`.

## Деплой

Нужен commit: скрипт пакует `git archive HEAD`, незакоммиченное на сервер не попадает.

1. Секреты SSH лежат в `deploy.local.env` (в git не входит, см. `.gitignore`). Образец — `deploy.local.env.example`. Туда же не класть файл в коммит.
2. Зависимость скриптов один раз: `npm run deploy:install` (`paramiko`).
3. Запуск: `npm run deploy:ubuntu`.

Скрипт по SSH: останавливает только `jazz2`, сохраняет `data/`, `storage/uploads/` и `.env`, распаковывает архив в `/var/www/jazz2-app`, `npm ci`, `npm run build`, `systemctl restart jazz2`, проверяет nginx и перезагружает его.

Локальная проверка сборки: `npm run build`. Если `better-sqlite3` ругается на версию Node, выполнить `npm rebuild better-sqlite3`.

Пример переменных приложения — `.env.example`. Рабочий `.env` на сервере не коммитить.

## Локальная разработка

```bash
npm install
npm run dev
```

Без своего `.env` админка не пустит: нужен `ADMIN_PASSWORD_HASH` и `SESSION_SECRET`. Пустая база при первом запуске заполнится из `data/menu.json` и `data/sections.json`. Это не копия продакшена.

## Что не стоит делать вслепую

- Не править `data/sections.json` в надежде обновить [kafejazz.ru](https://www.kafejazz.ru/) — прод читает SQLite.
- Не удалять и не перезаписывать `/var/www/jazz2-app/data/app.db`.
- Не менять nginx-сайты `kafejazz`, `superava`, `ufc6`, `ufc6pro` и не выключать чужие systemd-юниты.
- Не коммитить `deploy.local.env`, `.env`, `data/app.db`.

## Уже известные мелкие долги

Их не делали, чтобы не менять внешний вид и не трогать соседние приложения:

- Вынести `DATABASE_PATH` за каталог деплоя (`/var/lib/jazz2/app.db` уже предусмотрен в `.env.example`) — тогда архив деплоя физически не заменяет файл базы.
- Тексты политики и условий в подвале, заставка и слово «ДЖАЗ кафе» в шапке по-прежнему в компонентах, не в админке.
- Если в админке очистить поле, компонент может показать запасную фразу из кода (старые названия залов и т.п.). На заполненной базе этого не видно.
- Сайт `kafejazz` не описан файлом в репозитории. Имеет смысл когда-нибудь положить его копию в `deploy/`, не подключая к автоматической перезаписи при каждом деплое.
