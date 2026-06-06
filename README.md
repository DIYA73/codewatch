# codewatch

AI code review platform — GitHub webhook triggers instant review on every PR.

![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-10-E0234E?style=flat-square&logo=nestjs&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-14-000000?style=flat-square&logo=nextdotjs&logoColor=white)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o-412991?style=flat-square&logo=openai&logoColor=white)
![License: MIT](https://img.shields.io/badge/License-MIT-22c55e?style=flat-square)

---

## what it does

1. open a PR on GitHub
2. GitHub sends a webhook to codewatch
3. GPT-4o generates a structured code review
4. review posted as GitHub PR comment
5. team gets email summary

all automated. no manual review requests.

---

## features

- AI code review on every PR
- GitHub webhook integration
- Posts review as GitHub PR comment
- Email summary via Resend
- Team dashboard with review history and stats
- Multi-team support with isolated settings
- JWT authentication
- BullMQ async queue with retry logic

---

## stack

| layer | tech |
|-------|------|
| frontend | Next.js 14, TypeScript, Tailwind CSS |
| backend | NestJS, TypeScript, BullMQ |
| database | PostgreSQL, TypeORM |
| queue | Redis, BullMQ |
| ai | OpenAI GPT-4o |
| github | Octokit REST API |
| email | Resend |
| auth | JWT |

---

## quick start

    git clone https://github.com/DIYA73/codewatch.git
    cd codewatch
    cp apps/api/.env.example apps/api/.env
    docker compose up -d
    cd apps/api && npm run start:dev
    cd apps/web && npm run dev

open http://localhost:3000

---

## how it works

    PR opened on GitHub
         |
         v
    POST /webhooks/github/:teamId
         |
         v
    BullMQ queue (Redis)
         |
         v
    ReviewProcessor
      - GPT-4o analyzes PR
      - posts GitHub comment
      - sends email summary

---

MIT - DIYA73 - built with heart.
