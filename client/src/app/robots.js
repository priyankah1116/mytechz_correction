const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://mytechz.com'

export default function robots() {
  return {
    rules: [
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/admin', '/recruiter', '/api', '/auth/',
          '/login', '/dashboard', '/profile',
          '/my-applications', '/saved-jobs', '/settings',
        ],
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: [
          '/admin', '/recruiter', '/api', '/auth/',
          '/login', '/dashboard', '/profile',
          '/my-applications', '/saved-jobs', '/settings',
        ],
      },
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin', '/recruiter', '/api', '/auth/',
          '/login', '/dashboard', '/profile',
          '/my-applications', '/saved-jobs', '/settings',
        ],
        crawlDelay: 2,
      },
    ],
    sitemap: `${SITE}/sitemap.xml`,
    host: SITE,
  }
}
