import type { Metadata } from 'next'
import Link from 'next/link'
import { Flame, ArrowRight, Zap, Users, Trophy, TrendingUp, CheckCircle, Star } from 'lucide-react'

export const metadata: Metadata = {
  title: 'STRIV — India\'s Discipline Platform',
  description:
    'Build habits publicly. Prove your work every day. Join 69,000+ users on India\'s fastest growing discipline and accountability platform.',
}

const features = [
  {
    icon: Flame,
    title: 'Daily Proof Streaks',
    desc: 'Upload proof every day. Break your streak and lose it all. No shortcuts, just discipline.',
  },
  {
    icon: Users,
    title: 'Accountability Communities',
    desc: 'Join challenges with thousands of others who hold you accountable. React, comment, compete.',
  },
  {
    icon: Zap,
    title: 'Business Quests',
    desc: 'Businesses run task-based quests. Complete them, earn real rewards. Brands find their most loyal users.',
  },
  {
    icon: TrendingUp,
    title: 'Analytics Dashboard',
    desc: 'Every challenge and quest has live analytics — views, CTR, completion rates, and top performers.',
  },
  {
    icon: Trophy,
    title: 'Leaderboards & Achievements',
    desc: 'Rise the ranks. Unlock achievements. Earn certificates. Your consistency becomes your reputation.',
  },
  {
    icon: Star,
    title: 'Creator Economy',
    desc: 'Build a following, run premium challenges, partner with brands, monetise your discipline journey.',
  },
]

const testimonials = [
  {
    name: 'Arjun Sharma',
    handle: '@arjun.dev',
    avatar: 'AS',
    text: 'Day 87 of 100 Days of Code. STRIV keeps me honest. The community celebrates every commit.',
    streak: 87,
  },
  {
    name: 'Priya Nair',
    handle: '@priya.fit',
    avatar: 'PN',
    text: 'Completed 3 fitness challenges this year. The heatmap showing my consistency is my biggest motivation.',
    streak: 124,
  },
  {
    name: 'Rohit Mehta',
    handle: '@rohit.grind',
    avatar: 'RM',
    text: 'My business ran a quest on STRIV. 892 participants, 64% completion rate. Better than any ad campaign.',
    streak: 45,
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-6 lg:px-12 bg-background/80 backdrop-blur-md border-b border-border">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-[#5B3BEB] flex items-center justify-center">
            <Flame className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-black tracking-tight">STRIV</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
          <Link href="#features" className="hover:text-foreground transition-colors">Features</Link>
          <Link href="#how-it-works" className="hover:text-foreground transition-colors">How it works</Link>
          <Link href="/explore" className="hover:text-foreground transition-colors">Explore</Link>
          <Link href="/quests" className="hover:text-foreground transition-colors">Quests</Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="h-9 px-5 bg-[#5B3BEB] text-white rounded-xl text-sm font-semibold hover:bg-[#4025D4] transition-colors flex items-center gap-1.5"
          >
            Get started
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 lg:px-12 text-center max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 rounded-full bg-[#5B3BEB]/10 text-[#5B3BEB] px-4 py-1.5 text-sm font-semibold mb-8">
          <Flame className="h-4 w-4" />
          India's #1 Discipline Platform
        </div>
        <h1 className="text-5xl lg:text-7xl font-black tracking-tight leading-[1.05] mb-6">
          Consistency is<br />
          <span className="gradient-text">your superpower.</span>
        </h1>
        <p className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
          Build habits publicly. Prove your work every single day. Join communities that hold you accountable.
          This is where discipline becomes social.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/signup"
            className="h-13 px-8 bg-[#5B3BEB] text-white rounded-2xl text-base font-bold hover:bg-[#4025D4] transition-all active:scale-[0.98] shadow-lg shadow-[#5B3BEB]/25 flex items-center gap-2"
          >
            Start your streak today
            <ArrowRight className="h-5 w-5" />
          </Link>
          <Link
            href="/explore"
            className="h-13 px-8 border border-border rounded-2xl text-base font-semibold hover:bg-accent transition-colors flex items-center gap-2"
          >
            <Compass className="h-5 w-5" />
            Explore challenges
          </Link>
        </div>
        <p className="mt-6 text-sm text-muted-foreground">
          Join <strong>69,000+</strong> builders already proving their discipline daily
        </p>
      </section>

      {/* Stats bar */}
      <section className="py-10 border-y border-border bg-card">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {[
            { num: '69K+', label: 'Active Users' },
            { num: '1,200+', label: 'Challenges Created' },
            { num: '442K+', label: 'Proof Posts' },
            { num: '94%', label: 'Avg. Consistency' },
          ].map(({ num, label }) => (
            <div key={label}>
              <div className="text-3xl font-black text-[#5B3BEB]">{num}</div>
              <div className="text-sm text-muted-foreground mt-1">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6 lg:px-12 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black tracking-tight mb-4">Everything you need to stay consistent</h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            One platform. Habits, communities, challenges, quests, and analytics — built for India.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="rounded-2xl border border-border bg-card p-6 hover:border-[#5B3BEB]/30 hover:shadow-lg hover:shadow-[#5B3BEB]/5 transition-all group"
            >
              <div className="h-11 w-11 rounded-xl bg-[#5B3BEB]/10 flex items-center justify-center mb-4 group-hover:bg-[#5B3BEB]/20 transition-colors">
                <Icon className="h-6 w-6 text-[#5B3BEB]" />
              </div>
              <h3 className="font-bold text-base mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24 px-6 bg-card border-y border-border">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-4xl font-black tracking-tight mb-4">Build your streak in 3 steps</h2>
          <p className="text-muted-foreground text-lg">Simple to start. Addictively consistent.</p>
        </div>
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8">
          {[
            { step: '01', title: 'Join a Challenge', desc: 'Find a challenge that matches your goal — fitness, coding, education, or anything else.' },
            { step: '02', title: 'Post Daily Proof', desc: 'Upload proof every day. A photo, a commit, a screenshot. No proof = streak breaks.' },
            { step: '03', title: 'Build Your Reputation', desc: 'Earn streaks, achievements, and certificates. Your consistency becomes your public identity.' },
          ].map(({ step, title, desc }) => (
            <div key={step} className="text-center">
              <div className="h-16 w-16 rounded-2xl bg-[#5B3BEB]/10 flex items-center justify-center mx-auto mb-5">
                <span className="text-2xl font-black text-[#5B3BEB]">{step}</span>
              </div>
              <h3 className="font-bold text-lg mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6 lg:px-12 max-w-6xl mx-auto">
        <h2 className="text-4xl font-black tracking-tight text-center mb-16">Real people. Real streaks.</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map(({ name, handle, avatar, text, streak }) => (
            <div key={handle} className="rounded-2xl border border-border bg-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-full bg-[#5B3BEB] flex items-center justify-center text-white text-sm font-bold">
                  {avatar}
                </div>
                <div>
                  <p className="font-semibold text-sm">{name}</p>
                  <p className="text-xs text-muted-foreground">{handle}</p>
                </div>
                <div className="ml-auto flex items-center gap-1 bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 rounded-full px-2 py-0.5 text-xs font-bold">
                  <Flame className="h-3 w-3" />
                  {streak}
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">"{text}"</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 text-center bg-[#5B3BEB] text-white">
        <h2 className="text-4xl lg:text-5xl font-black tracking-tight mb-6">
          Your streak starts today.
        </h2>
        <p className="text-purple-200 text-lg mb-10 max-w-xl mx-auto">
          Join thousands of Indians building discipline publicly. Free to start, powerful to grow.
        </p>
        <Link
          href="/signup"
          className="inline-flex items-center gap-2 h-13 px-10 bg-white text-[#5B3BEB] rounded-2xl text-base font-black hover:bg-purple-50 transition-colors shadow-xl"
        >
          Join STRIV for free
          <ArrowRight className="h-5 w-5" />
        </Link>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-[#5B3BEB] flex items-center justify-center">
              <Flame className="h-4 w-4 text-white" />
            </div>
            <span className="font-black tracking-tight">STRIV</span>
          </div>
          <p className="text-sm text-muted-foreground text-center">
            © 2025 STRIV. India's discipline platform. Built for builders.
          </p>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
            <Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

function Compass({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24,7.76 14.12,14.12 7.76,16.24 9.88,9.88 16.24,7.76" />
    </svg>
  )
}
