import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { Toaster } from '@/components/ui/Toaster'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://striv.in'),
  title: {
    default: 'STRIV — India\'s Discipline Platform',
    template: '%s | STRIV',
  },
  description:
    'STRIV makes consistency social. Build habits publicly, join challenges, earn streaks, and prove your work every day. India\'s platform for growth through discipline.',
  keywords: [
    'discipline platform',
    'habit tracking',
    'challenges India',
    'consistency app',
    'accountability partner',
    'streak tracker',
    'community challenges',
    'growth platform India',
    'habit community',
    'daily proof',
    'JEE preparation',
    'fitness challenges India',
    'coding challenges',
    '100 days of code India',
  ],
  authors: [{ name: 'STRIV', url: 'https://striv.in' }],
  creator: 'STRIV',
  publisher: 'STRIV',
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
    title: 'STRIV — India\'s Discipline Platform',
    description:
      'Build habits publicly. Prove your work every day. Join India\'s fastest growing discipline community.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'STRIV — India\'s Discipline Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@strivapp',
    creator: '@strivapp',
    title: 'STRIV — India\'s Discipline Platform',
    description: 'Build habits publicly. Prove your work every day.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/apple-icon.png' }],
  },
  manifest: '/manifest.json',
  alternates: {
    canonical: 'https://striv.in',
  },
}

export const viewport: Viewport = {
  themeColor: '#5B3BEB',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              name: 'STRIV',
              url: 'https://striv.in',
              description:
                "India's discipline platform — build habits publicly, join challenges, earn streaks.",
              applicationCategory: 'LifestyleApplication',
              operatingSystem: 'Any',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'INR',
              },
              author: {
                '@type': 'Organization',
                name: 'STRIV',
              },
            }),
          }}
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}
