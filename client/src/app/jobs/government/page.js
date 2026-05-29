import { Suspense } from 'react'
import JobsListingPage, { JobsLoadingGrid } from '@/components/jobs/JobsListingPage'
import { getJobs } from '@/lib/jobs/queries'

export const metadata = {
  title: 'Government Jobs — UPSC, SSC, PSU & Defence Vacancies',
  description: 'Latest central, state, PSU and defence vacancies with notification numbers, exam dates, age limits and official PDFs.',
  alternates: { canonical: '/jobs/government' },
  openGraph: {
    title: 'Government Jobs — UPSC, SSC, PSU & Defence Vacancies | MyTechZ',
    description: 'Latest central, state, PSU and defence vacancies with notification numbers, exam dates, age limits and official PDFs.',
    url: '/jobs/government',
  },
  twitter: { card: 'summary_large_image' },
}

export const dynamic = 'force-dynamic'

const PAGE_CONFIG = {
  id: 'government',
  title: 'Government Jobs',
  subtitle: 'Central, state, PSU and defence vacancies with official notifications and exam schedules.',
  accentColor: 'emerald',
  heroBadge: 'Government / Public Sector',
  placeholder: 'Post, organization or qualification',
}

function parseFilters(sp) {
  const skills = sp?.skills ? String(sp.skills).split(',').map(s => s.trim()).filter(Boolean) : []
  return {
    q: sp?.q || '', location: sp?.loc || '',
    work_mode: sp?.mode || '', job_type: sp?.type || '',
    exp_min: sp?.exp_min || '', exp_max: sp?.exp_max || '',
    sal_min: sp?.sal_min || '', skills,
    sort: sp?.sort || 'newest', page: Number(sp?.page) || 1,
  }
}

export default async function GovernmentJobsPage({ searchParams }) {
  const sp = await searchParams
  const filters = parseFilters(sp)
  const { jobs, error } = await getJobs({ ...filters, category: 'government' })

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://mytechz.com/' },
      { '@type': 'ListItem', position: 2, name: 'Jobs', item: 'https://mytechz.com/jobs' },
      { '@type': 'ListItem', position: 3, name: 'Government Jobs', item: 'https://mytechz.com/jobs/government' },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <Suspense fallback={<JobsLoadingGrid />}>
        <JobsListingPage pageConfig={PAGE_CONFIG} initialJobs={jobs} initialFilters={filters} initialError={error} />
      </Suspense>
    </>
  )
}
