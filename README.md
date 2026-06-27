<p align="center">
  <img src="public/striv-logo.png" alt="STRIV Logo" width="80" />
</p>

<h1 align="center">STRIV — India's Discipline Platform</h1>

<p align="center">
  <strong>Make consistency social. Build habits publicly. Prove your work every day.</strong>
</p>

<p align="center">
  <a href="https://striv.vercel.app"><img src="https://img.shields.io/badge/Live-striv.vercel.app-5B3BEB?style=flat-square" /></a>
  <a href="https://nextjs.org"><img src="https://img.shields.io/badge/Next.js-15-black?style=flat-square" /></a>
  <a href="https://supabase.com"><img src="https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=flat-square" /></a>
  <a href="https://firebase.google.com"><img src="https://img.shields.io/badge/Firebase-Auth-FFCA28?style=flat-square&logo=firebase" /></a>
</p>

---

## 🔥 What is STRIV?

STRIV is India's discipline platform. Its mission is to **make consistency social**.

- Users build habits **publicly**
- Communities hold people **accountable**
- Businesses use challenges and quests as **customer acquisition systems**
- Everything revolves around **daily proof** — no proof, streak breaks

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15, TypeScript, Tailwind CSS |
| Auth | Firebase (Google Sign-In) |
| Database | Supabase PostgreSQL |
| Storage | Supabase Buckets |
| Deployment | Vercel |

## 📱 Screens Built

- **Landing Page** — SEO-optimised, conversion-focused
- **Auth** — Role select (User / Business), Google Sign-In
- **Growth Feed** — Daily proof posts, streaks, reactions
- **Explore** — Challenge discovery with filters and categories
- **Create Challenge** — Basic + Business tabs, proof type selector
- **Create Quest** — Multi-step: Basic info → Tasks → Rewards → Rules → Review
- **Quests** — Explore quests + My Quests dashboard
- **Profile** — Heatmap, active challenges, achievements, stats
- **Alerts** — Real-time notification centre
- **Stats/Analytics** — Views, funnel, traffic sources, heatmap, leaderboard
- **Quest Analytics** — Partner dashboard, conversion funnel, ad performance

## 🗄️ Database

All tables in Supabase PostgreSQL with:
- Row Level Security (RLS) on every table
- Soft deletes
- Analytics events tables
- Real-time subscriptions

## 🚀 Getting Started

```bash
git clone https://github.com/Aditya-tech18/STRIV.git
cd STRIV
npm install
cp .env.example .env.local
# Fill in your Firebase + Supabase keys
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🌐 Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Aditya-tech18/STRIV)

Set these environment variables in Vercel:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

## 📁 Project Structure

```
src/
├── app/
│   ├── (app)/           # Authenticated app routes
│   │   ├── feed/        # Growth feed
│   │   ├── explore/     # Challenge discovery
│   │   ├── create/      # Create challenge/quest
│   │   ├── quests/      # Quest hub
│   │   ├── alerts/      # Notifications
│   │   ├── stats/       # Analytics
│   │   └── profile/     # User profile
│   ├── login/
│   ├── signup/
│   └── page.tsx         # Landing page
├── components/
│   ├── layout/          # Navbar
│   └── ui/              # Design system components
├── contexts/            # Auth context
├── lib/
│   ├── firebase/        # Firebase config
│   ├── supabase/        # Supabase client
│   └── utils.ts
└── types/               # TypeScript types
```

---

Built with 🔥 by the STRIV team.
