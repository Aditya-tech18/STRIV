export type UserRole = 'user' | 'business' | 'admin'

export interface UserProfile {
  id: string
  full_name: string | null
  email: string | null
  avatar_url: string | null
  phone: string | null
  combat_name: string | null
  goal: string | null
  goal_selected_at: string | null
  created_at: string | null
  last_login: string | null
  serial_id: number
}

export interface Challenge {
  id: string
  title: string
  description: string
  category: ChallengeCategory
  duration_days: number
  is_premium: boolean
  is_private: boolean
  proof_type: ProofType[]
  image_url: string | null
  organization_name: string | null
  created_by: string
  participant_count: number
  view_count: number
  completion_rate: number
  current_day: number
  created_at: string
  updated_at: string
  tags: string[]
  creator?: UserProfile
}

export type ChallengeCategory =
  | 'Fitness'
  | 'Coding'
  | 'Education'
  | 'Cooking'
  | 'Entertainment'
  | 'Business'
  | 'Health'
  | 'Lifestyle'
  | 'Other'

export type ProofType =
  | 'GitHub Commits'
  | 'Morning Workout Photo'
  | 'Screenshot'
  | 'Video'
  | 'Text Update'
  | 'Custom'

export interface UserChallenge {
  id: string
  user_id: string
  challenge_id: string
  start_date: string
  last_completed: string | null
  progress_count: number
  streak_count: number
  is_active: boolean
  consistency_pct: number
  challenge?: Challenge
}

export interface Quest {
  id: string
  title: string
  description: string
  reward: string
  duration_days: number
  org_name: string
  banner_url: string | null
  thumbnail_url: string | null
  destination_url: string | null
  created_by: string
  start_date: string
  end_date: string
  is_public: boolean
  participant_count: number
  view_count: number
  task_completion_rate: number
  created_at: string
  tasks?: QuestTask[]
  creator?: UserProfile
}

export interface QuestTask {
  id: string
  quest_id: string
  task_name: string
  description: string | null
  proof_type: string
  is_mandatory: boolean
  order_index: number
}

export interface ProofPost {
  id: string
  user_id: string
  challenge_id: string | null
  quest_id: string | null
  date: string
  media_url: string | null
  description: string | null
  day_number: number
  like_count: number
  comment_count: number
  created_at: string
  user?: UserProfile
  challenge?: Challenge
}

export interface Notification {
  id: string
  user_id: string
  type: NotificationType
  message: string
  link: string | null
  is_read: boolean
  from_user_id: string | null
  created_at: string
  from_user?: UserProfile
}

export type NotificationType =
  | 'like'
  | 'comment'
  | 'follow'
  | 'challenge_joined'
  | 'quest_joined'
  | 'reward_claimed'
  | 'mention'
  | 'announcement'

export interface HeatmapData {
  date: string
  count: number
  level: 0 | 1 | 2 | 3 | 4
}

export interface Analytics {
  total_views: number
  participants: number
  active_daily: number
  completion_rate: number
  ad_clicks: number
  ctr: number
  traffic_sources: {
    home_feed: number
    explore: number
    search: number
  }
  daily_data: Array<{
    date: string
    views: number
    joins: number
  }>
  top_performers: Array<{
    user: UserProfile
    streak: number
    rank: number
  }>
}

export interface Subscription {
  id: string
  user_id: string
  plan_name: string
  valid_until: string
  paid_on: string
}

export type PromotionTier = 'starter' | 'growth' | 'enterprise'

export interface FeedPost {
  id: string
  user: UserProfile
  challenge: Challenge | null
  proof: ProofPost
  day_number: number
  streak: number
  created_at: string
}
