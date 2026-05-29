import { Geist, Geist_Mono } from 'next/font/google'
import { GoogleAnalytics } from '@next/third-parties/google'
import './globals.css'
import LayoutShell from '@/components/LayoutShell'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://mytechz.in'

export const metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: 'MyTechZ — India\'s AI-Powered Job Portal for Tech Careers',
    template: '%s | MyTechZ',
  },
  description:
    'Discover verified tech jobs, government vacancies, paid internships and AI career tools. 50,000+ opportunities from 500+ hiring partners across India.',
  keywords:
    'jobs, tech jobs, IT jobs, software developer jobs, government jobs, internships, India, AI resume builder, job portal, career platform',
  authors: [{ name: 'MyTechZ' }],
  creator: 'MyTechZ',
  publisher: 'MyTechZ',
  openGraph: {
    siteName: 'MyTechZ',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'MyTechZ — AI-Powered Job Portal',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large', 'max-video-preview': -1 },
  },
  verification: {
    google: 'REPLACE_WITH_YOUR_GOOGLE_VERIFICATION_CODE',
    other: { 'msvalidate.01': 'REPLACE_WITH_YOUR_BING_VERIFICATION_CODE' },
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/Mytechz_logo.png',
  },
}

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'MyTechZ',
              url: SITE,
              logo: `${SITE}/Mytechz_logo.png`,
              description:
                'India\'s AI-powered career platform connecting tech talent with verified private and government job opportunities.',
              foundingDate: '2023',
              sameAs: [
                process.env.NEXT_PUBLIC_LINKEDIN_URL || 'https://www.linkedin.com/company/mytechz',
              ],
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'MyTechZ',
              url: SITE,
              potentialAction: {
                '@type': 'SearchAction',
                target: { '@type': 'EntryPoint', urlTemplate: `${SITE}/jobs/private?q={search_term_string}` },
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'SiteNavigationElement',
              name: 'Main Navigation',
              hasPart: [
                { '@type': 'SiteNavigationElement', name: 'Private Jobs', url: `${SITE}/jobs/private` },
                { '@type': 'SiteNavigationElement', name: 'Government Jobs', url: `${SITE}/jobs/government` },
                { '@type': 'SiteNavigationElement', name: 'Internships', url: `${SITE}/jobs/internship` },
                { '@type': 'SiteNavigationElement', name: 'AI Tools', url: `${SITE}/ai-tools` },
                { '@type': 'SiteNavigationElement', name: 'Resume Builder', url: `${SITE}/ai-tools/resume-builder` },
                { '@type': 'SiteNavigationElement', name: 'About', url: `${SITE}/about` },
                { '@type': 'SiteNavigationElement', name: 'Services', url: `${SITE}/services` },
                { '@type': 'SiteNavigationElement', name: 'Contact', url: `${SITE}/contact` },
              ],
            }),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <LayoutShell>{children}</LayoutShell>
      </body>
      <GoogleAnalytics gaId="G-FXKXL6XP9H" />
    </html>
  )
}
