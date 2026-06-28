import type { Metadata, Viewport } from 'next'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { ReactQueryProvider } from '@/components/providers/ReactQueryProvider'
import { Toaster } from '@/components/ui/Toaster'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://striv.in'),
  title: {
    default: "STRIV — India's Discipline Platform",
    template: '%s | STRIV',
  },
  description:
    "STRIV makes consistency social. Build habits publicly, join challenges, earn streaks, and prove your work every day. India's platform for growth through discipline.",
  keywords: [
    'discipline platform india',
    'habit tracking app',
    'challenges india',
    'consistency app',
    'accountability partner',
    'streak tracker',
    'community challenges',
    'growth platform india',
    '100 days of code india',
    'fitness challenges india',
  ],
  authors: [{ name: 'STRIV', url: 'https://striv.in' }],
  creator: 'STRIV',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://striv.in',
    siteName: 'STRIV',
    title: "STRIV — India's Discipline Platform",
    description:
      "Build habits publicly. Prove your work every day. Join India's fastest growing discipline community.",
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: "STRIV — India's Discipline Platform" }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@strivapp',
    title: "STRIV — India's Discipline Platform",
    description: 'Build habits publicly. Prove your work every day.',
    images: ['/og-image.png'],
  },
  icons: { icon: '/favicon.ico' },
}

export const viewport: Viewport = {
  themeColor: '#5B3BEB',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              name: 'STRIV',
              url: 'https://striv.in',
              description: "India's discipline platform — build habits publicly, join challenges, earn streaks.",
              applicationCategory: 'LifestyleApplication',
              operatingSystem: 'Any',
              offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
              author: { '@type': 'Organization', name: 'STRIV' },
            }),
          }}
        />
      </head>
      <body style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
        <ReactQueryProvider>
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </ReactQueryProvider>
      </body>
    </html>
  )
}
