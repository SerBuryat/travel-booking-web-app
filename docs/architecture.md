# Архитектура проекта Travel Booking Web App

## Overview

- Next.js 15 (React 19)
- Docker
- Nginx (HTTPS, proxy)
- PostgreSQL (Prisma)
- Telegram (Mini App, бот, авторизация)
- Cloud.ru (Artifact Registry, Object Storage)
- Logger (Telegram)

---

## Верхнеуровневая схема

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              ПОЛЬЗОВАТЕЛЬ                                         │
│                    (браузер / Telegram Mini App)                                  │
└───────────────────────────────────────────┬─────────────────────────────────────┘
                                            │ HTTPS
                                            ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           VPS (dev / prod)                                        │
│  ┌─────────────────────────────────────────────────────────────────────────────┐ │
│  │  NGINX                                                                       │ │
│  │  • Приём 80/443, SSL (Certbot)                                               │ │
│  │  • Проксирование на localhost:3000                                            │ │
│  │  • client_max_body_size 10M                                                   │ │
│  └───────────────────────────────────────────┬─────────────────────────────────┘ │
│                                              │ http://localhost:3000              │
│                                              ▼                                    │
│  ┌─────────────────────────────────────────────────────────────────────────────┐ │
│  │  DOCKER CONTAINER — travel-booking-web-app                                    │ │
│  │  • Next.js 15 (standalone), порт 3000                                         │ │
│  │  • Фронт: React 19, MUI, Tailwind, Telegram SDK                               │ │
│  │  • Бэк: API Routes, Server Actions, Prisma, JWT                               │ │
│  └───────────────────────────────────────────┬─────────────────────────────────┘ │
│                                              │ DATABASE_URL                        │
│                                              ▼                                    │
│  ┌─────────────────────────────────────────────────────────────────────────────┐ │
│  │  PostgreSQL                                                                   │ │
│  │  • На хосте (dev/prod) или туннель к удалённой БД                             │ │
│  └─────────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────┘
                                            │
          ┌─────────────────────────────────┼─────────────────────────────────┐
          │                                 │                                 │
          ▼                                 ▼                                 ▼
┌─────────────────────┐     ┌─────────────────────────────┐     ┌─────────────────────┐
│  Telegram           │     │  Cloud.ru                    │     │  Logger Service     │
│  • Mini App         │     │  • Artifact Registry (образы)│     │  • Клиентские логи  │
│  • Bot (BOT_TOKEN)  │     │  • Object Storage (S3-совм.) │     │  • LOGGER_URL       │
│  • Init Data / JWT  │     │  • OBJECT_STORAGE_*          │     │  • LOGGER_CHAT_ID   │
└─────────────────────┘     └─────────────────────────────┘     └─────────────────────┘
```

---

## Состав проекта (схематично)

| Компонент | Технология / Роль |
|-----------|-------------------|
| **Фронтенд** | Next.js 15, React 19, MUI, Tailwind CSS, Telegram Mini App SDK, React Hook Form, Zod |
| **Бэкенд** | Next.js API Routes, Server Actions, Prisma ORM, JWT (jose/jsonwebtoken), Telegram Init Data |
| **БД** | PostgreSQL; Prisma (миграции, клиент) |
| **Хранилище файлов** | Cloud.ru Object Storage (S3-совместимый), AWS SDK (client-s3) |
| **Веб-сервер** | Nginx на VPS: SSL (Certbot), reverse proxy на приложение |
| **Контейнеризация** | Docker (multi-stage Dockerfile), образ — Node 20 Alpine, standalone Next.js |
| **Оркестрация** | Docker Compose (dev/prod в `deploy/`), один сервис `app`, network_mode: host |
| **Реестр образов** | Cloud.ru Artifact Registry (образы пушатся из CI) |
| **CI/CD** | GitHub Actions: сборка Next.js → сборка и push образа → SSH на VPS и запуск `run.sh` (pull + up) |
| **Локальная разработка** | `npm run dev`; БД — локальный PostgreSQL в `local/docker-compose.yml` или туннель по env |

---

## Потоки деплоя

- **Сборка образа**: репозиторий → Dockerfile (deps → builder → runner) → образ в Cloud.ru Registry.
- **Сервер**: на VPS установлены Docker, Docker Compose, Nginx, Certbot; при деплое выполняется `run.sh`: проверка nginx и .env, `docker-compose pull`, `up -d`, при ошибке — откат.
- **Доступ**: только через Nginx (порт 3000 на VPS закрыт снаружи iptables, доступен только с localhost).

Файл размещён в `docs/architecture.md` и описывает только верхний уровень: из чего состоит проект и как компоненты связаны между собой, без детализации кода.
