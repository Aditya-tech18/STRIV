-- =========================================
-- STRIV - Complete Supabase Schema
-- Run this in Supabase SQL Editor
-- =========================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =========================================
-- USERS
-- =========================================
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY,  -- Firebase UID
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  combat_name TEXT UNIQUE,
  bio TEXT,
  github_url TEXT,
  linkedin_url TEXT,
  portfolio_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'business', 'admin')),
  goal TEXT,
  goal_selected_at TIMESTAMPTZ,
  serial_id BIGSERIAL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_login TIMESTAMPTZ
);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view any profile" ON public.users FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid()::text = id::text);
CREATE POLICY "Users can insert own profile" ON public.users FOR INSERT WITH CHECK (auth.uid()::text = id::text);

-- =========================================
-- COMMUNITIES
-- =========================================
CREATE TABLE IF NOT EXISTS public.communities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT,
  description TEXT,
  image_url TEXT,
  created_by UUID REFERENCES public.users(id) ON DELETE CASCADE,
  member_count INT DEFAULT 0,
  is_private BOOL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.communities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view communities" ON public.communities FOR SELECT USING (true);
CREATE POLICY "Auth users can create communities" ON public.communities FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Owners can update communities" ON public.communities FOR UPDATE USING (auth.uid()::text = created_by::text);

-- =========================================
-- CHALLENGES
-- =========================================
CREATE TABLE IF NOT EXISTS public.challenges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'Other',
  duration_days INT NOT NULL DEFAULT 30,
  is_premium BOOL DEFAULT false,
  is_private BOOL DEFAULT false,
  proof_types TEXT[] DEFAULT '{}',
  image_url TEXT,
  organization_name TEXT,
  rules_description TEXT,
  tags TEXT[] DEFAULT '{}',
  created_by UUID REFERENCES public.users(id) ON DELETE CASCADE,
  community_id UUID REFERENCES public.communities(id) ON DELETE SET NULL,
  participant_count INT DEFAULT 0,
  view_count INT DEFAULT 0,
  completion_rate NUMERIC(5,2) DEFAULT 0,
  daily_reminder_time TIME,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view public challenges" ON public.challenges FOR SELECT USING (NOT is_private OR auth.uid()::text = created_by::text);
CREATE POLICY "Auth users can create challenges" ON public.challenges FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Owners can update challenges" ON public.challenges FOR UPDATE USING (auth.uid()::text = created_by::text);
CREATE POLICY "Owners can delete challenges" ON public.challenges FOR DELETE USING (auth.uid()::text = created_by::text);

-- =========================================
-- USER_CHALLENGES (Participation)
-- =========================================
CREATE TABLE IF NOT EXISTS public.user_challenges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  challenge_id UUID REFERENCES public.challenges(id) ON DELETE CASCADE,
  start_date DATE DEFAULT CURRENT_DATE,
  last_completed DATE,
  progress_count INT DEFAULT 0,
  streak_count INT DEFAULT 0,
  is_active BOOL DEFAULT true,
  consistency_pct NUMERIC(5,2) DEFAULT 0,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, challenge_id)
);

ALTER TABLE public.user_challenges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own challenge participation" ON public.user_challenges FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can join challenges" ON public.user_challenges FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);
CREATE POLICY "Users can update own participation" ON public.user_challenges FOR UPDATE USING (auth.uid()::text = user_id::text);

-- =========================================
-- QUESTS
-- =========================================
CREATE TABLE IF NOT EXISTS public.quests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  reward TEXT,
  duration_days INT DEFAULT 21,
  org_name TEXT,
  banner_url TEXT,
  thumbnail_url TEXT,
  destination_url TEXT,
  logo_url TEXT,
  cta_text TEXT DEFAULT 'Shop Now',
  promotion_tier TEXT DEFAULT 'starter' CHECK (promotion_tier IN ('starter', 'growth', 'enterprise')),
  created_by UUID REFERENCES public.users(id) ON DELETE CASCADE,
  start_date DATE,
  end_date DATE,
  is_public BOOL DEFAULT true,
  participant_count INT DEFAULT 0,
  view_count INT DEFAULT 0,
  claims INT DEFAULT 0,
  redemptions INT DEFAULT 0,
  ad_impressions INT DEFAULT 0,
  ad_clicks INT DEFAULT 0,
  task_completion_rate NUMERIC(5,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.quests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view public quests" ON public.quests FOR SELECT USING (is_public OR auth.uid()::text = created_by::text);
CREATE POLICY "Auth users can create quests" ON public.quests FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Owners can update quests" ON public.quests FOR UPDATE USING (auth.uid()::text = created_by::text);
CREATE POLICY "Owners can delete quests" ON public.quests FOR DELETE USING (auth.uid()::text = created_by::text);

-- =========================================
-- QUEST_TASKS
-- =========================================
CREATE TABLE IF NOT EXISTS public.quest_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quest_id UUID REFERENCES public.quests(id) ON DELETE CASCADE,
  task_name TEXT NOT NULL,
  description TEXT,
  proof_type TEXT DEFAULT 'Photo',
  is_mandatory BOOL DEFAULT true,
  order_index INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.quest_tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view quest tasks" ON public.quest_tasks FOR SELECT USING (true);
CREATE POLICY "Quest owners can manage tasks" ON public.quest_tasks FOR ALL USING (
  auth.uid()::text = (SELECT created_by::text FROM public.quests WHERE id = quest_id)
);

-- =========================================
-- USER_QUESTS
-- =========================================
CREATE TABLE IF NOT EXISTS public.user_quests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  quest_id UUID REFERENCES public.quests(id) ON DELETE CASCADE,
  progress JSONB DEFAULT '{}',
  reward_claimed BOOL DEFAULT false,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  UNIQUE(user_id, quest_id)
);

ALTER TABLE public.user_quests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own quest participation" ON public.user_quests FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can join quests" ON public.user_quests FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);
CREATE POLICY "Users can update own quest progress" ON public.user_quests FOR UPDATE USING (auth.uid()::text = user_id::text);

-- =========================================
-- PROOFS (Daily proof posts)
-- =========================================
CREATE TABLE IF NOT EXISTS public.proofs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  challenge_id UUID REFERENCES public.challenges(id) ON DELETE SET NULL,
  quest_id UUID REFERENCES public.quests(id) ON DELETE SET NULL,
  date DATE DEFAULT CURRENT_DATE,
  media_url TEXT,
  description TEXT,
  day_number INT DEFAULT 1,
  like_count INT DEFAULT 0,
  comment_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.proofs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view proofs" ON public.proofs FOR SELECT USING (true);
CREATE POLICY "Users can create own proofs" ON public.proofs FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);
CREATE POLICY "Users can update own proofs" ON public.proofs FOR UPDATE USING (auth.uid()::text = user_id::text);

-- =========================================
-- LIKES
-- =========================================
CREATE TABLE IF NOT EXISTS public.likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  proof_id UUID REFERENCES public.proofs(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, proof_id)
);

ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view likes" ON public.likes FOR SELECT USING (true);
CREATE POLICY "Users can like" ON public.likes FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);
CREATE POLICY "Users can unlike" ON public.likes FOR DELETE USING (auth.uid()::text = user_id::text);

-- =========================================
-- COMMENTS
-- =========================================
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  proof_id UUID REFERENCES public.proofs(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view comments" ON public.comments FOR SELECT USING (true);
CREATE POLICY "Users can comment" ON public.comments FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);
CREATE POLICY "Users can delete own comments" ON public.comments FOR DELETE USING (auth.uid()::text = user_id::text);

-- =========================================
-- NOTIFICATIONS
-- =========================================
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  from_user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  type TEXT NOT NULL,
  message TEXT NOT NULL,
  link TEXT,
  is_read BOOL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "System can insert notifications" ON public.notifications FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE USING (auth.uid()::text = user_id::text);

-- =========================================
-- FOLLOWS
-- =========================================
CREATE TABLE IF NOT EXISTS public.follows (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  follower_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  following_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(follower_id, following_id)
);

ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view follows" ON public.follows FOR SELECT USING (true);
CREATE POLICY "Users can follow" ON public.follows FOR INSERT WITH CHECK (auth.uid()::text = follower_id::text);
CREATE POLICY "Users can unfollow" ON public.follows FOR DELETE USING (auth.uid()::text = follower_id::text);

-- =========================================
-- INDEXES for performance
-- =========================================
CREATE INDEX IF NOT EXISTS idx_challenges_created_by ON public.challenges(created_by);
CREATE INDEX IF NOT EXISTS idx_challenges_category ON public.challenges(category);
CREATE INDEX IF NOT EXISTS idx_user_challenges_user_id ON public.user_challenges(user_id);
CREATE INDEX IF NOT EXISTS idx_user_challenges_challenge_id ON public.user_challenges(challenge_id);
CREATE INDEX IF NOT EXISTS idx_quests_created_by ON public.quests(created_by);
CREATE INDEX IF NOT EXISTS idx_user_quests_user_id ON public.user_quests(user_id);
CREATE INDEX IF NOT EXISTS idx_proofs_user_id ON public.proofs(user_id);
CREATE INDEX IF NOT EXISTS idx_proofs_challenge_id ON public.proofs(challenge_id);
CREATE INDEX IF NOT EXISTS idx_proofs_date ON public.proofs(date DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON public.notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_likes_proof_id ON public.likes(proof_id);
CREATE INDEX IF NOT EXISTS idx_follows_follower ON public.follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_follows_following ON public.follows(following_id);

-- =========================================
-- STORAGE BUCKETS (run via Supabase dashboard or API)
-- =========================================
-- INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('challenge_images', 'challenge_images', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('quest_images', 'quest_images', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('proofs', 'proofs', false);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('ad_banners', 'ad_banners', true);

-- =========================================
-- FIREBASE AUTH INTEGRATION
-- Enable in Supabase Dashboard:
-- Authentication > Third-party Auth > Firebase
-- Provide Firebase Project ID: striv-b4924
-- =========================================
