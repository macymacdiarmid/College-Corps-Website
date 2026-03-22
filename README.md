# Cal Poly College Corps Website

A full-stack web application built with React + TypeScript, backed by Supabase, and deployed on Railway.

## Quick Start (after Phase 0 installs)

```bash
# Terminal 1 — Frontend
cd frontend && npm install && npm run dev

# Terminal 2 — Backend
cd backend && npm install && cp .env.example .env && npm run dev

# Terminal 3 — Database (after `supabase init`)
supabase start
```

Open http://localhost:5173 in your browser.

## Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) — tech stack, data model, project structure
- [ROADMAP.md](./ROADMAP.md) — phased delivery plan with exact CLI commands

## Pages

| URL                   | Page               |
|-----------------------|--------------------|
| `/`                   | Home               |
| `/cohorts/food`       | Food Insecurity    |
| `/cohorts/climate`    | Climate Action     |
| `/cohorts/health`     | Healthy Futures    |
| `/cohorts/k12`        | K-12 Education     |
| `/contact`            | Contact & Chat     |
| `/updates`            | Newsletters        |
