import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`
  return String(n)
}

export function formatRelativeTime(date: string): string {
  const now = Date.now()
  const then = new Date(date).getTime()
  const diff = now - then
  const mins = Math.floor(diff / 60_000)
  const hrs = Math.floor(diff / 3_600_000)
  const days = Math.floor(diff / 86_400_000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  if (hrs < 24) return `${hrs}h ago`
  if (days < 7) return `${days}d ago`
  return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}

export function getDaysBetween(start: string, end?: string): number {
  const s = new Date(start).getTime()
  const e = end ? new Date(end).getTime() : Date.now()
  return Math.floor((e - s) / 86_400_000)
}

export function getHeatmapLevel(count: number): 0 | 1 | 2 | 3 | 4 {
  if (count === 0) return 0
  if (count < 3) return 1
  if (count < 6) return 2
  if (count < 10) return 3
  return 4
}

export const HEATMAP_COLORS = {
  0: 'bg-muted',
  1: 'bg-purple-100 dark:bg-purple-950',
  2: 'bg-purple-300 dark:bg-purple-800',
  3: 'bg-purple-500 dark:bg-purple-600',
  4: 'bg-purple-700 dark:bg-purple-400',
}

export const CATEGORY_COLORS: Record<string, string> = {
  Fitness: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
  Coding: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
  Education: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
  Cooking: 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300',
  Entertainment: 'bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-300',
  Business: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  Health: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300',
  Lifestyle: 'bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-300',
  Other: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
}
