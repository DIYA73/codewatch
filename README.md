# 🔍 CodeWatch

**AI code review on every pull request** — GitHub webhooks trigger GPT-4o analysis, results posted as PR comments and emailed to your team.

![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-10-E0234E?style=flat-square&logo=nestjs&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-14-000000?style=flat-square&logo=nextdotjs&logoColor=white)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o-412991?style=flat-square&logo=openai&logoColor=white)
![BullMQ](https://img.shields.io/badge/BullMQ-queue-FF0000?style=flat-square)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat-square&logo=postgresql&logoColor=white)
![License: MIT](https://img.shields.io/badge/License-MIT-22c55e?style=flat-square)

---

## How it works

```
GitHub PR opened/updated
        │
        ▼
  Webhook → NestJS API
        │
        ▼
   BullMQ queue
        │
        ▼
  GPT-4o reviews diff
        │
   ┌────┴────┐
   ▼         ▼
PR comment  Email summary
```

1. Connect a repository via the dashboard
2. GitHub sends a `pull_request` webhook to CodeWatch on every PR open or update
3. The diff is queued in BullMQ and processed asynchronously
4. GPT-4o reviews the code for bugs, security issues, and style
5. Results are posted as a PR comment and emailed to the team

## Features

- **Automatic PR review** — no manual trigger needed
- **Async processing** — BullMQ queue so slow AI calls never block the API
- **Team management** — multi-user, role-based access
- **Review dashboard** — view all past reviews, filter by repo or status
- **Email notifications** — summary delivered to your inbox after every review
- **JWT auth** — register, login, role-based guards

## Tech stack

| Layer      | Technology                            |
|------------|---------------------------------------|
| API        | NestJS 10, TypeScript                 |
| AI         | OpenAI GPT-4o                         |
| Queue      | BullMQ + Redis                        |
| Database   | PostgreSQL (TypeORM)                  |
| Frontend   | Next.js 14, Tailwind CSS              |
| Webhooks   | GitHub Webhooks API                   |

## Project structure

```
codewatch/
└── apps/
    ├── api/
    │   └── src/
    │       ├── auth/          # JWT auth
    │       ├── github/        # Webhook ingestion
    │       ├── reviews/       # AI review processor
    │       ├── teams/         # Team management
    │       ├── users/         # User management
    │       └── webhooks/      # Webhook routing
    └── web/
        └── app/
            └── dashboard/     # Review dashboard UI
```

## Quick start

### Prerequisites

- Node.js 18+
- PostgreSQL
- Redis
- OpenAI API key
- GitHub App or webhook secret

### 1. Clone

```bash
git clone https://github.com/DIYA73/codewatch.git
cd codewatch
```

### 2. Configure environment

```bash
# apps/api
cp apps/api/.env.example apps/api/.env
```

```env
DATABASE_URL=postgresql://user:pass@localhost:5432/codewatch
REDIS_URL=redis://localhost:6379
OPENAI_API_KEY=sk-...
JWT_SECRET=your-secret
GITHUB_WEBHOOK_SECRET=your-webhook-secret
SMTP_HOST=smtp.example.com
SMTP_USER=you@example.com
SMTP_PASS=your-password
```

### 3. Install and migrate

```bash
npm install
cd apps/api && npx typeorm migration:run
```

### 4. Run

```bash
# API (port 3001)
cd apps/api && npm run start:dev

# Frontend (port 3000)
cd apps/web && npm run dev
```

### 5. Connect GitHub

In the dashboard, add a repository and copy the webhook URL. In GitHub → Settings → Webhooks, add the URL with content type `application/json` and your webhook secret.

## Contributing

Issues and PRs welcome.

## License

MIT