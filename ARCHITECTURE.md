# Cal Poly College Corps — Architecture

## Overview

A full-stack web application for Cal Poly College Corps, built with a React frontend, TypeScript backend, Supabase database, and hosted on Railway. Managed entirely through the CLI.

---

## Tech Stack

| Layer       | Technology            | Why                                                               |
|-------------|-----------------------|-------------------------------------------------------------------|
| Frontend    | React + Vite          | Industry-standard UI library; Vite gives fast local dev           |
| Styling     | Tailwind CSS          | Utility-first CSS — fast to write, easy to maintain               |
| Routing     | React Router v6       | Client-side navigation between pages                              |
| Backend     | Node.js + TypeScript  | Type-safe server code; runs on the same JS ecosystem as frontend  |
| API Layer   | Express.js            | Lightweight, widely used HTTP server framework                    |
| Database    | Supabase (PostgreSQL) | Hosted Postgres with built-in auth, real-time, and a great CLI    |
| Hosting     | Railway               | Git-push deploys, CLI-first, handles both frontend and backend    |
| Version Ctl | Git + GitHub          | Source control; Railway deploys directly from GitHub              |

---

## Repository Layout

```
cal-poly-college-corps/
├── frontend/                   # React application (Vite)
│   ├── public/                 # Static assets (favicon, images)
│   ├── src/
│   │   ├── assets/             # Logos, photos
│   │   ├── components/         # Reusable UI pieces (Navbar, Footer, Button…)
│   │   ├── pages/              # One file per route
│   │   │   ├── Home.tsx
│   │   │   ├── CohortFoodInsecurity.tsx
│   │   │   ├── CohortClimateAction.tsx
│   │   │   ├── CohortHealthyFutures.tsx
│   │   │   ├── CohortK12Education.tsx
│   │   │   ├── Contact.tsx
│   │   │   └── Updates.tsx
│   │   ├── App.tsx             # Route definitions
│   │   └── main.tsx            # React entry point
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.ts
│   └── package.json
│
├── backend/                    # Express + TypeScript API
│   ├── src/
│   │   ├── routes/
│   │   │   ├── contact.ts      # POST /api/contact  — saves contact form submissions
│   │   │   ├── newsletter.ts   # GET  /api/newsletters — fetches newsletter entries
│   │   │   └── apply.ts        # POST /api/apply     — saves application interest
│   │   ├── db/
│   │   │   └── supabase.ts     # Supabase client initialisation
│   │   ├── middleware/
│   │   │   └── cors.ts         # CORS configuration
│   │   └── index.ts            # Server entry point
│   ├── tsconfig.json
│   └── package.json
│
├── supabase/                   # Supabase local config & migrations
│   ├── config.toml
│   └── migrations/             # SQL migration files (version-controlled)
│
├── docs/                       # Additional documentation
│   └── content/                # Editable copy for each page (Markdown)
│
├── ARCHITECTURE.md             # This file
├── ROADMAP.md                  # Phased delivery plan
├── .gitignore
└── README.md
```

---

## Page Map

| Route                  | Page                    | Key Features                                                     |
|------------------------|-------------------------|------------------------------------------------------------------|
| `/`                    | Home                    | Hero section, program overview, "Apply Now" CTA button           |
| `/cohorts/food`        | Food Insecurity         | Cohort description, goals, partner orgs, apply CTA               |
| `/cohorts/climate`     | Climate Action          | Cohort description, goals, partner orgs, apply CTA               |
| `/cohorts/health`      | Healthy Futures         | Cohort description, goals, partner orgs, apply CTA               |
| `/cohorts/k12`         | K-12 Education          | Cohort description, goals, partner orgs, apply CTA               |
| `/contact`             | Contact & Questions     | Email input form + live chatbox (stored in Supabase)             |
| `/updates`             | Updates & Newsletters   | Monthly newsletter archive, announcements feed                   |

---

## Data Model (Supabase / PostgreSQL)

### `contact_submissions`
| Column       | Type        | Notes                          |
|--------------|-------------|--------------------------------|
| id           | uuid (PK)   | Auto-generated                 |
| name         | text        |                                |
| email        | text        |                                |
| message      | text        |                                |
| created_at   | timestamptz | Default: now()                 |

### `chat_messages`
| Column       | Type        | Notes                                   |
|--------------|-------------|-----------------------------------------|
| id           | uuid (PK)   | Auto-generated                          |
| session_id   | text        | Groups messages in one chat session     |
| sender       | text        | 'user' or 'admin'                       |
| message      | text        |                                         |
| created_at   | timestamptz | Default: now()                          |

### `newsletters`
| Column       | Type        | Notes                          |
|--------------|-------------|--------------------------------|
| id           | uuid (PK)   | Auto-generated                 |
| title        | text        |                                |
| published_at | date        |                                |
| content      | text        | Markdown or HTML body          |
| pdf_url      | text        | Optional link to PDF version   |
| created_at   | timestamptz | Default: now()                 |

### `applications`
| Column       | Type        | Notes                          |
|--------------|-------------|--------------------------------|
| id           | uuid (PK)   | Auto-generated                 |
| name         | text        |                                |
| email        | text        |                                |
| cohort       | text        | food / climate / health / k12  |
| message      | text        | Optional                       |
| created_at   | timestamptz | Default: now()                 |

---

## How the Pieces Connect

```
Browser (React)
      │  HTTP requests to /api/*
      ▼
Express Backend (TypeScript)
      │  Supabase JS client
      ▼
Supabase (PostgreSQL)
      │  managed by Supabase CLI (migrations, seeds)
      ▼
Railway (hosts both frontend static build + backend Node server)
      │  deploys from GitHub on every push to main
      ▼
Custom domain (future — add via Railway dashboard)
```

---

## Local Development Flow

```
Terminal A:  cd frontend  && npm run dev    → http://localhost:5173
Terminal B:  cd backend   && npm run dev    → http://localhost:3001
Terminal C:  supabase start                → local Postgres + Studio UI
```

The frontend proxies `/api/*` requests to the backend during local development (configured in `vite.config.ts`), so you only ever open one browser tab.

---

## CLI Tools You Will Use

| Tool              | Install command                              | Purpose                              |
|-------------------|----------------------------------------------|--------------------------------------|
| Homebrew          | (see Roadmap Phase 0)                        | Mac package manager                  |
| Node.js / npm     | `brew install node`                          | Runs JavaScript/TypeScript           |
| Git               | Already installed                            | Version control                      |
| GitHub CLI        | `brew install gh`                            | Create repos, open PRs from terminal |
| Supabase CLI      | `brew install supabase/tap/supabase`         | Manage DB schema & migrations        |
| Railway CLI       | `brew install railway`                       | Deploy & manage Railway from terminal|

---

## Security Notes

- Environment variables (API keys, DB URLs) are **never** committed to Git — stored in `.env` locally and in Railway's dashboard for production.
- Supabase Row Level Security (RLS) policies will be enabled on all tables in Phase 3.
- Contact form includes basic server-side validation to prevent spam injection.
