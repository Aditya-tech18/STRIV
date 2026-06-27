# STRIV Setup Guide

## Prerequisites
- Node.js 20+
- Firebase project: `striv-b4924`
- Supabase project: `xfveirzckcohsjdklzxa`

## 1. Install Dependencies
```bash
npm install
```

## 2. Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

## 3. Supabase Database Setup
Run the SQL in `supabase_schema.sql` in your Supabase SQL Editor:
1. Go to https://supabase.com/dashboard/project/xfveirzckcohsjdklzxa/sql
2. Open `supabase_schema.sql` from this repo
3. Run it to create all tables with RLS policies

## 4. Firebase Auth Integration with Supabase
1. Go to Supabase Dashboard → Authentication → Sign In / Up → Third-party Auth
2. Enable Firebase
3. Enter Firebase Project ID: `striv-b4924`

## 5. Supabase Storage Buckets
Create these buckets in Supabase Storage:
- `avatars` (public)
- `challenge_images` (public)
- `quest_images` (public)
- `proofs` (private)
- `ad_banners` (public)

## 6. Run Development Server
```bash
npm run dev
```

App runs at http://localhost:3000

## Architecture

```
src/
  app/
    (app)/           # Protected app routes (require auth)
      feed/          # Growth feed (Image 3)
      explore/       # Challenge explore (Image 4)
      profile/       # User profile + heatmap (Image 5)
      create/        # Create challenge wizard (Image 6)
      create-quest/  # Create quest wizard (Images 9, 10)
      quests/        # How quests work + pricing (Image 8)
      my-quests/     # Business dashboard (Image 12)
      stats/         # Analytics (Image 11)
      alerts/        # Notifications
    login/           # Login page (Image 2)
    signup/          # Role select + signup (Image 1)
  components/
    layout/Navbar    # Bottom nav (mobile) + sidebar (desktop)
    ui/              # Design system components
  contexts/
    AuthContext      # Firebase + Supabase auth
  lib/
    firebase/        # Firebase config
    supabase/        # Supabase client
  types/             # TypeScript types
```

## Tech Stack
- **Frontend**: Next.js 15 + TypeScript + Tailwind CSS
- **Auth**: Firebase Authentication (Google Sign-In)
- **Database**: Supabase PostgreSQL
- **Storage**: Supabase Storage
- **Real-time**: Supabase Realtime (planned)
- **State**: React Query + Zustand
