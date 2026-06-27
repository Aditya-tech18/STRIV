'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import {
  Home, Compass, PlusCircle, Bell, User, Flame,
  Menu, X, LogOut, Settings, BarChart2, Zap
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { Avatar } from '@/components/ui/primitives'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/feed', icon: Home, label: 'Home' },
  { href: '/explore', icon: Compass, label: 'Explore' },
  { href: '/create', icon: PlusCircle, label: 'Create' },
  { href: '/alerts', icon: Bell, label: 'Alerts' },
  { href: '/profile', icon: User, label: 'Profile' },
]

export function Navbar() {
  const pathname = usePathname()
  const { profile, firebaseUser, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-full w-64 flex-col border-r border-border bg-card z-40 px-4 py-6">
        {/* Logo */}
        <Link href="/feed" className="flex items-center gap-2 mb-8 px-2">
          <div className="h-9 w-9 rounded-xl bg-[#5B3BEB] flex items-center justify-center">
            <Flame className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-black tracking-tight">STRIV</span>
        </Link>

        {/* Nav items */}
        <nav className="flex-1 space-y-1">
          {navItems.map(({ href, icon: Icon, label }) => {
            const active = pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
                  active
                    ? 'bg-[#5B3BEB]/10 text-[#5B3BEB] dark:bg-[#5B3BEB]/20'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                )}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {label}
              </Link>
            )
          })}

          <div className="pt-2 border-t border-border mt-2">
            <Link
              href="/stats"
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
                pathname.startsWith('/stats')
                  ? 'bg-[#5B3BEB]/10 text-[#5B3BEB]'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground'
              )}
            >
              <BarChart2 className="h-5 w-5" />
              Analytics
            </Link>
            <Link
              href="/quests"
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
                pathname.startsWith('/quests')
                  ? 'bg-[#5B3BEB]/10 text-[#5B3BEB]'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground'
              )}
            >
              <Zap className="h-5 w-5" />
              Quests
            </Link>
          </div>
        </nav>

        {/* User section */}
        {profile && (
          <div className="border-t border-border pt-4">
            <div className="flex items-center gap-3 px-2 mb-3">
              <Avatar src={profile.avatar_url} name={profile.full_name} size="md" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{profile.full_name || 'User'}</p>
                <p className="text-xs text-muted-foreground truncate">@{profile.combat_name || 'warrior'}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        )}
      </aside>

      {/* Mobile top bar */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 h-14 flex items-center justify-between px-4 bg-card/80 backdrop-blur-md border-b border-border">
        <Link href="/feed" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-[#5B3BEB] flex items-center justify-center">
            <Flame className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-black tracking-tight">STRIV</span>
        </Link>
        <div className="flex items-center gap-2">
          <Link href="/alerts" className="h-9 w-9 flex items-center justify-center rounded-xl hover:bg-accent transition-colors">
            <Bell className="h-5 w-5" />
          </Link>
          {profile && (
            <Avatar src={profile.avatar_url} name={profile.full_name} size="sm" />
          )}
        </div>
      </header>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-md border-t border-border pb-safe">
        <div className="flex items-center justify-around py-2">
          {navItems.map(({ href, icon: Icon, label }) => {
            const active = pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-colors',
                  active ? 'text-[#5B3BEB]' : 'text-muted-foreground'
                )}
              >
                <Icon className={cn('h-5 w-5', href === '/create' && active && 'text-[#5B3BEB]')} />
                <span className="text-[10px] font-medium">{label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}
