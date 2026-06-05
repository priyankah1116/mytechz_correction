const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://mytechz.com'

const PRIVATE_PATHS = [
  '/admin',
  '/recruiter',
  '/api',
  '/auth/',
  '/login',
  '/dashboard',
  '/profile',
  '/my-applications',
  '/saved-jobs',
  '/settings',
  '/ai-tools/resume-builder/editor',
  '/ai-tools/resume-builder/my-resumes',
]

export default function robots() {
  return {
    rules: [
      // Standard crawlers
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: PRIVATE_PATHS,
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: PRIVATE_PATHS,
      },
      // AI crawlers — allow public content for GEO (Generative Engine Optimization)
      {
        userAgent: 'GPTBot',
        allow: [
          '/about',
          '/services',
          '/contact',
          '/jobs',
          '/jobs/private',
          '/jobs/government',
          '/jobs/internship',
          '/ai-tools',
          '/ai-tools/resume-builder',
          '/ai-tools/resume-builder/templates',
          '/ai-tools/resume-rank-checker',
          '/ai-tools/smart-job-search',
        ],
        disallow: PRIVATE_PATHS,
      },
      {
        userAgent: 'ClaudeBot',
        allow: [
          '/about',
          '/services',
          '/contact',
          '/jobs',
          '/jobs/private',
          '/jobs/government',
          '/jobs/internship',
          '/ai-tools',
          '/ai-tools/resume-builder',
          '/ai-tools/resume-builder/templates',
          '/ai-tools/resume-rank-checker',
          '/ai-tools/smart-job-search',
        ],
        disallow: PRIVATE_PATHS,
      },
      {
        userAgent: 'PerplexityBot',
        allow: [
          '/about',
          '/services',
          '/contact',
          '/jobs',
          '/jobs/private',
          '/jobs/government',
          '/jobs/internship',
          '/ai-tools',
          '/ai-tools/resume-builder',
          '/ai-tools/resume-builder/templates',
          '/ai-tools/resume-rank-checker',
          '/ai-tools/smart-job-search',
        ],
        disallow: PRIVATE_PATHS,
      },
      {
        userAgent: 'Applebot',
        allow: '/',
        disallow: PRIVATE_PATHS,
      },
      // All other bots
      {
        userAgent: '*',
        allow: '/',
        disallow: PRIVATE_PATHS,
        crawlDelay: 2,
      },
    ],
    sitemap: `${SITE}/sitemap.xml`,
    host: SITE,
  }
}
