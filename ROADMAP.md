# Cal Poly College Corps — Development Roadmap

This is your step-by-step guide. Each phase has exact commands to run. You tell me when you are done with a phase and I will handle the next set of code changes.

---

## Phase 0 — Install Your Toolchain (Do This First)

These are one-time installs on your Mac. Open **Terminal** (search "Terminal" in Spotlight).

### Step 0.1 — Install Homebrew (Mac package manager)
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```
Follow the prompts. It may ask for your Mac password. After it finishes, run the two `eval` lines it prints at the end — they look like:
```bash
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"
```

### Step 0.2 — Install Node.js
```bash
brew install node
```
Verify it worked:
```bash
node --version   # should print v20.x.x or higher
npm --version    # should print 10.x.x or higher
```

### Step 0.3 — Install GitHub CLI
```bash
brew install gh
```

### Step 0.4 — Install Supabase CLI
```bash
brew install supabase/tap/supabase
```

### Step 0.5 — Install Railway CLI
```bash
brew install railway
```

### Step 0.6 — Create a GitHub Account (if you don't have one)
Go to https://github.com and sign up. Then connect the CLI:
```bash
gh auth login
```
Choose **GitHub.com → HTTPS → Login with a web browser** and follow the prompts.

### Step 0.7 — Create a Supabase Account
Go to https://supabase.com and sign up (free). Then connect the CLI:
```bash
supabase login
```
It will open a browser to authenticate.

### Step 0.8 — Create a Railway Account
Go to https://railway.app and sign up (free tier available). Then connect the CLI:
```bash
railway login
```

**You are done with Phase 0 when:** `node --version`, `gh --version`, `supabase --version`, and `railway --version` all print version numbers without errors.

---

## Phase 1 — Project Scaffold & Local Dev Server

I will do most of this for you. Here is what happens in this phase:

- Initialize Git repository
- Scaffold the React frontend with Vite + Tailwind CSS
- Scaffold the TypeScript Express backend
- Wire up local proxy so frontend talks to backend
- Get a "hello world" version of every page running in your browser

### Step 1.1 — Initialize Git and push to GitHub
```bash
cd ~/cal-poly-college-corps
git init
git add .
git commit -m "initial scaffold"
gh repo create cal-poly-college-corps --public --source=. --remote=origin --push
```

### Step 1.2 — Install frontend dependencies
```bash
cd ~/cal-poly-college-corps/frontend
npm install
```

### Step 1.3 — Install backend dependencies
```bash
cd ~/cal-poly-college-corps/backend
npm install
```

### Step 1.4 — Start the local servers (run these in separate Terminal tabs)

**Tab 1 — Frontend:**
```bash
cd ~/cal-poly-college-corps/frontend
npm run dev
```
Open http://localhost:5173 in your browser — you should see the home page.

**Tab 2 — Backend:**
```bash
cd ~/cal-poly-college-corps/backend
npm run dev
```
The API is running at http://localhost:3001.

**You are done with Phase 1 when:** You can navigate between all 7 pages in your browser at localhost:5173 and see placeholder content on each one.

---

## Phase 2 — Build Out Page Content

I will write the full content and layout for each page. You provide:
- Any copy/text you want on each page (or I will use placeholder text)
- Your logo or any images you want to include
- Color preferences (Cal Poly green is #154734; gold is #C69214)

Pages to build:
1. **Home** — Hero banner, program description, 4 cohort preview cards, Apply Now button
2. **Food Insecurity Cohort** — Full description, partner organizations, goals, apply CTA
3. **Climate Action Cohort** — Full description, partner organizations, goals, apply CTA
4. **Healthy Futures Cohort** — Full description, partner organizations, goals, apply CTA
5. **K-12 Education Cohort** — Full description, partner organizations, goals, apply CTA
6. **Contact** — Name/email/message form + live chat widget
7. **Updates** — Newsletter cards with titles, dates, and links to PDFs

**You are done with Phase 2 when:** All 7 pages have real content and look polished in your browser.

---

## Phase 3 — Supabase Database Setup

### Step 3.1 — Initialize Supabase locally
```bash
cd ~/cal-poly-college-corps
supabase init
supabase start
```
This starts a local Postgres database. Supabase Studio (a visual database UI) will be available at http://localhost:54323.

### Step 3.2 — I will write the database migrations
I will create SQL migration files in `supabase/migrations/` for all 4 tables:
- `contact_submissions`
- `chat_messages`
- `newsletters`
- `applications`

### Step 3.3 — Apply migrations
```bash
supabase db push
```

### Step 3.4 — Connect backend to local Supabase
I will update the backend `.env` with the local Supabase URL and anon key (printed when you ran `supabase start`).

### Step 3.5 — Create your production Supabase project
```bash
supabase projects create cal-poly-college-corps --org-id YOUR_ORG_ID
```
(I'll walk you through getting your org-id.)

### Step 3.6 — Push migrations to production
```bash
supabase db push --db-url YOUR_PRODUCTION_DB_URL
```

**You are done with Phase 3 when:** Submitting the contact form saves a record visible in the Supabase Studio UI.

---

## Phase 4 — Deploy to Railway

### Step 4.1 — Create a Railway project
```bash
cd ~/cal-poly-college-corps
railway init
```
Name it `cal-poly-college-corps`.

### Step 4.2 — Add environment variables to Railway
```bash
railway variables set SUPABASE_URL=your_url
railway variables set SUPABASE_ANON_KEY=your_key
```

### Step 4.3 — Deploy the backend
```bash
cd ~/cal-poly-college-corps/backend
railway up
```

### Step 4.4 — Deploy the frontend
Railway can serve the built React app as a static site:
```bash
cd ~/cal-poly-college-corps/frontend
npm run build
railway up
```

### Step 4.5 — Set up automatic deploys from GitHub
```bash
railway link
```
After this, every `git push origin main` automatically redeploys both services.

### Step 4.6 — Get your live URL
```bash
railway open
```
This opens your Railway dashboard where you will find the public URL.

**You are done with Phase 4 when:** Your site is live at a `*.railway.app` URL.

---

## Phase 5 — Custom Domain (Optional)

When you are ready to use a real domain name (e.g., `collegecorps.calpoly.edu`):

1. Purchase a domain (if not already owned) at Namecheap, Google Domains, etc.
2. In Railway dashboard → your service → Settings → Custom Domain → add your domain
3. Railway gives you DNS records to add at your domain registrar
4. HTTPS is provisioned automatically

---

## Phase 6 — Polish & Extras

Features to add after the site is live:

| Feature                          | Notes                                               |
|----------------------------------|-----------------------------------------------------|
| Email notifications              | When contact form is submitted, send email to admin |
| Newsletter upload UI             | Simple admin page to add new newsletter entries     |
| Apply Now links to Google Form   | Or build a custom form that writes to Supabase      |
| Analytics                        | Add Plausible or Fathom (privacy-friendly)          |
| SEO meta tags                    | Title, description, Open Graph for social sharing   |
| Mobile menu                      | Hamburger nav for small screens                     |
| Accessibility audit              | WCAG 2.1 AA compliance check                        |

---

## Where We Are Right Now

```
[x] Architecture documented
[x] Project folder created
[ ] Phase 0 — Install toolchain      ← YOU ARE HERE
[ ] Phase 1 — Scaffold & local dev
[ ] Phase 2 — Page content
[ ] Phase 3 — Supabase database
[ ] Phase 4 — Railway deployment
[ ] Phase 5 — Custom domain
[ ] Phase 6 — Polish
```

---

## How To Work With Me

- Tell me when you finish a phase and I will generate the next batch of code.
- If a command gives you an error, paste the error output and I will debug it.
- I will do as much code writing as possible — you mostly run commands and provide content.
- All commands go in Terminal unless I specify otherwise.
