# Rick's Used Cars — передача на сервер

В архиве есть исходники сайта, Docker-конфигурация, миграции базы и фотографии автомобилей.
Секреты намеренно не включены.

## Что нужно настроить на сервере

1. Распаковать архив.
2. Создать `backend/.env` на основе `backend/.env.example` и задать надёжные значения:
   - `POSTGRES_PASSWORD`;
   - `POSTGRES_USER` и `POSTGRES_DB` при необходимости;
   - `MAIL_TO` — почта, куда должны приходить заявки;
   - SMTP-настройки (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USERNAME`, `SMTP_PASSWORD`, `SMTP_USE_TLS`). Если сторонние почтовые сервисы не используются, можно развернуть Postfix на том же VPS и указать его как SMTP-host;
   - `BACKEND_CORS_ORIGINS=https://ricksusedscars.com,https://www.ricksusedscars.com`.
3. Перед сборкой фронтенда создать `frontend/.env`:
   ```env
   VITE_API_URL=https://ricksusedscars.com/api
   VITE_META_PIXEL_ID=
   VITE_MAINTENANCE_MODE=false
   ```
   Либо указать отдельный API-домен, если он будет использоваться. В `VITE_META_PIXEL_ID` нужно поставить настоящий ID Meta Pixel; пустое значение отключает пиксель. `VITE_MAINTENANCE_MODE=false` оставляет сайт доступным, а `true` включает технический экран.
4. Настроить Nginx/Apache: домен `ricksusedscars.com` должен отдавать собранный фронтенд, а `/api` проксировать на backend-порт `8001`.
5. Из папки `backend` запустить:
   ```bash
   docker compose up -d --build
   ```
   Миграции запускаются контейнером API автоматически. На чистой базе будет 13 доступных автомобилей.

## Важно

- `backend/.env` и `frontend/.env` не кладутся в архив: в них находятся серверные адреса и секреты.
- После настройки SMTP стоит отправить тестовую заявку и убедиться, что письмо дошло.
