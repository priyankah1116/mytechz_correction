import Link from 'next/link'

const SITE = 'https://mytechz.com'

export const metadata = {
  title: 'Free AI Career Tools — Resume Builder, Job Search & Rank Checker | MyTechZ',
  description:
    'Free AI-powered career tools by MyTechZ. Build ATS-friendly resumes with our free resume builder, find AI-matched jobs, and check your resume score — all free for Indian job seekers.',
  keywords:
    'AI career tools, free resume builder, resume rank checker, smart job search, ATS resume checker, AI job matching India, career tools free',
  alternates: { canonical: `${SITE}/ai-tools` },
  openGraph: {
    title: 'Free AI Career Tools — Resume Builder, Job Search & Rank Checker | MyTechZ',
    description: 'Free AI-powered career tools: free resume builder, AI job matching, and resume score checker.',
    url: `${SITE}/ai-tools`,
    type: 'website',
    siteName: 'MyTechZ',
    images: [{ url: `${SITE}/og-image.png`, width: 1200, height: 630, alt: 'MyTechZ Free AI Career Tools' }],
  },
  twitter: { card: 'summary_large_image' },
}

const tools = [
  {
    title: 'Free Resume Builder',
    href: '/ai-tools/resume-builder',
    description: 'India\'s best free resume builder and CV builder. Create ATS-friendly resumes with AI in minutes. Download as PDF or DOCX — 100% free, no watermarks.',
    badge: 'Most Popular',
    icon: (
      <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
    color: 'blue',
    gradient: 'from-blue-50 to-indigo-100',
    border: 'border-blue-100',
    iconBg: 'bg-blue-600',
  },
  {
    title: 'Smart Job Search',
    href: '/ai-tools/smart-job-search',
    description: 'Let AI match you with the best job opportunities based on your skills, experience, and career goals — ranked by fit score, not just keywords.',
    badge: 'Coming Soon',
    icon: (
      <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
      </svg>
    ),
    color: 'purple',
    gradient: 'from-purple-50 to-violet-100',
    border: 'border-purple-100',
    iconBg: 'bg-purple-600',
  },
  {
    title: 'Resume Rank Checker',
    href: '/ai-tools/resume-rank-checker',
    description: 'Get an instant AI-powered ATS match score for your resume. See how well it matches job descriptions and get specific improvement tips — free.',
    badge: 'Coming Soon',
    icon: (
      <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
    color: 'amber',
    gradient: 'from-amber-50 to-orange-100',
    border: 'border-amber-100',
    iconBg: 'bg-amber-600',
  },
]

function JsonLd() {
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
      { '@type': 'ListItem', position: 2, name: 'AI Career Tools', item: `${SITE}/ai-tools` },
    ],
  }

  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'MyTechZ Free AI Career Tools',
    description: 'Free AI-powered tools to help Indian job seekers build resumes, find matching jobs, and check resume scores.',
    numberOfItems: tools.length,
    itemListElement: tools.map((t, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: t.title,
      url: `${SITE}${t.href}`,
      description: t.description,
    })),
  }

  const faqPage = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What free AI career tools does MyTechZ offer?',
        acceptedAnswer: { '@type': 'Answer', text: 'MyTechZ offers three free AI career tools: (1) Free Resume Builder — create ATS-friendly resumes with AI in minutes, (2) Smart Job Search — AI-matched job recommendations based on your profile, and (3) Resume Rank Checker — instant ATS score against any job description.' },
      },
      {
        '@type': 'Question',
        name: 'Is the MyTechZ AI resume builder free?',
        acceptedAnswer: { '@type': 'Answer', text: 'Yes. The MyTechZ resume builder is 100% free. You can create, customize, and download your resume as PDF or DOCX at no cost. No credit card required.' },
      },
      {
        '@type': 'Question',
        name: 'Which AI tool should I use first?',
        acceptedAnswer: { '@type': 'Answer', text: 'Start with the Free Resume Builder to create an ATS-optimised resume, then use the Resume Rank Checker to score your resume against specific job descriptions, and finally use Smart Job Search to find roles where you have the strongest fit.' },
      },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPage) }} />
    </>
  )
}

export default function AIToolsPage() {
  return (
    <>
      <JsonLd />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-8 text-xs text-slate-500 flex flex-wrap items-center gap-1">
          <Link href="/" className="hover:text-blue-700">Home</Link>
          <span aria-hidden="true">›</span>
          <span className="text-slate-700">AI Career Tools</span>
        </nav>

        <div className="text-center mb-12">
          <span className="inline-block text-xs font-bold uppercase tracking-wider text-blue-700 mb-3">Free for everyone</span>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Free AI-Powered <span className="text-blue-600">Career Tools</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Supercharge your job search with our free suite of AI tools — built specifically for Indian tech job seekers. Free resume builder, smart job matching, and ATS score checker.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {tools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${tool.gradient} p-8 ${tool.border} border hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
            >
              {tool.badge && (
                <span className={`absolute top-4 right-4 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${tool.badge === 'Most Popular' ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                  {tool.badge}
                </span>
              )}
              <div className={`w-14 h-14 ${tool.iconBg} rounded-xl flex items-center justify-center mb-5`}>
                {tool.icon}
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                {tool.title}
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed">{tool.description}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-blue-700 group-hover:gap-2 transition-all">
                {tool.badge === 'Coming Soon' ? 'Learn more' : 'Get started free'}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
              </span>
            </Link>
          ))}
        </div>

        {/* GEO — plain-language content block for LLMs */}
        <div className="mt-16 max-w-3xl mx-auto bg-white/70 backdrop-blur rounded-2xl border border-slate-200 p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Why Use MyTechZ AI Career Tools?</h2>
          <ul className="space-y-3 text-sm text-slate-700">
            <li className="flex gap-3"><span className="text-blue-600 font-bold mt-0.5">✓</span><span><strong>100% free:</strong> All AI tools are free to use. No subscriptions, no hidden fees, no credit card required.</span></li>
            <li className="flex gap-3"><span className="text-blue-600 font-bold mt-0.5">✓</span><span><strong>Built for India:</strong> Optimised for Indian job market standards, ATS systems used by Indian companies, and common resume formats.</span></li>
            <li className="flex gap-3"><span className="text-blue-600 font-bold mt-0.5">✓</span><span><strong>AI-powered:</strong> Uses advanced AI to generate professional content, match jobs by fit score, and analyse resume keywords.</span></li>
            <li className="flex gap-3"><span className="text-blue-600 font-bold mt-0.5">✓</span><span><strong>Instant results:</strong> Get a polished resume in under 10 minutes. Download as PDF or Word with one click.</span></li>
          </ul>
        </div>
      </section>
    </>
  )
}
