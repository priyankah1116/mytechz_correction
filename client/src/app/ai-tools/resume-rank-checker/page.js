import Link from 'next/link'

const SITE = 'https://mytechz.com'

export const metadata = {
  title: 'Resume Rank Checker — Free ATS Score & Resume Analyser | MyTechZ',
  description:
    'Check how well your resume matches any job description. Get a free ATS compatibility score, keyword gap analysis, and specific suggestions to improve your chances of getting shortlisted.',
  keywords:
    'resume rank checker, ATS score checker free, resume ATS test, resume match score, resume analyser India, job description match checker, ATS resume checker free',
  alternates: { canonical: `${SITE}/ai-tools/resume-rank-checker` },
  openGraph: {
    title: 'Resume Rank Checker — Free ATS Score & Resume Analyser | MyTechZ',
    description: 'Paste a job description + your resume — get an instant ATS match score, gap analysis, and improvement suggestions. Free.',
    url: `${SITE}/ai-tools/resume-rank-checker`,
    type: 'website',
    siteName: 'MyTechZ',
    images: [{ url: `${SITE}/og-image.png`, width: 1200, height: 630, alt: 'MyTechZ Resume Rank Checker' }],
  },
  twitter: { card: 'summary_large_image' },
}

function JsonLd() {
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
      { '@type': 'ListItem', position: 2, name: 'AI Tools', item: `${SITE}/ai-tools` },
      { '@type': 'ListItem', position: 3, name: 'Resume Rank Checker', item: `${SITE}/ai-tools/resume-rank-checker` },
    ],
  }

  const softwareApp = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'MyTechZ Resume Rank Checker',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    url: `${SITE}/ai-tools/resume-rank-checker`,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
    description: 'Free ATS resume compatibility checker. Paste a job description and your resume to get an instant match score and improvement suggestions.',
    provider: { '@type': 'Organization', name: 'MyTechZ', url: SITE },
  }

  const faqPage = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is a resume ATS score?',
        acceptedAnswer: { '@type': 'Answer', text: 'An ATS (Applicant Tracking System) score measures how well your resume matches a specific job description. It analyzes keyword presence, formatting, section structure, and skill alignment. A higher score means your resume is more likely to pass automated screening.' },
      },
      {
        '@type': 'Question',
        name: 'How do I improve my ATS resume score?',
        acceptedAnswer: { '@type': 'Answer', text: 'To improve your ATS score: (1) Mirror keywords from the job description in your resume, (2) Use standard section headings like Experience, Education, Skills, (3) Avoid tables, images, and complex formatting, (4) Quantify achievements with numbers, (5) Tailor your resume for each application.' },
      },
      {
        '@type': 'Question',
        name: 'Is the MyTechZ Resume Rank Checker free?',
        acceptedAnswer: { '@type': 'Answer', text: 'Yes, the Resume Rank Checker is completely free to use. No subscription or credit card required.' },
      },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApp) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPage) }} />
    </>
  )
}

export default function ResumeRankCheckerPage() {
  return (
    <>
      <JsonLd />
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-8 text-xs text-slate-500 flex flex-wrap items-center gap-1">
          <Link href="/" className="hover:text-blue-700">Home</Link>
          <span aria-hidden="true">›</span>
          <Link href="/ai-tools" className="hover:text-blue-700">AI Tools</Link>
          <span aria-hidden="true">›</span>
          <span className="text-slate-700">Resume Rank Checker</span>
        </nav>

        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Free Resume <span className="text-blue-700">Rank Checker</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            Upload your resume and paste a job description to get an instant ATS compatibility score, keyword gap analysis, and specific suggestions to improve your shortlisting chances — completely free.
          </p>
        </div>

        <div className="bg-gray-50 rounded-2xl border border-gray-200 p-12 text-center mb-12">
          <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Coming Soon</h2>
          <p className="text-gray-500 max-w-md mx-auto mb-6">
            Our resume analysis engine is being fine-tuned. Soon you will be able to check your ATS match score, identify missing keywords, and get specific improvement suggestions for any job — free.
          </p>
          <Link href="/ai-tools/resume-builder" className="inline-flex items-center gap-2 bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-blue-800 transition-all">
            Build ATS-Ready Resume First
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
          </Link>
        </div>

        {/* AEO content — FAQ section */}
        <div className="max-w-3xl">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Understanding ATS Resume Scoring</h2>
          <div className="space-y-4">
            {[
              { q: 'What is a resume ATS score?', a: 'An ATS (Applicant Tracking System) score measures how well your resume matches a specific job description. It analyzes keyword presence, formatting, section structure, and skill alignment. A higher score means your resume is more likely to pass automated screening and reach a human recruiter.' },
              { q: 'How do I improve my ATS resume score?', a: 'To improve your ATS score: mirror keywords from the job description, use standard section headings (Experience, Education, Skills), avoid tables and images, quantify achievements with numbers, and tailor your resume for each application.' },
              { q: 'What ATS score is considered good?', a: 'Generally, an ATS match score above 70% is considered good. A score of 80%+ significantly improves your chances of passing automated screening. MyTechZ\'s free resume builder creates ATS-optimised resumes by default.' },
              { q: 'Does resume formatting affect ATS score?', a: 'Yes. ATS systems struggle to parse tables, text in images, headers/footers, and non-standard fonts. Use clean, single-column layouts with standard fonts — exactly what MyTechZ\'s free resume templates are designed for.' },
            ].map((item, i) => (
              <details key={i} className="group bg-white/70 backdrop-blur-sm rounded-xl border border-slate-200 px-6 py-4">
                <summary className="flex justify-between items-center cursor-pointer list-none">
                  <span className="font-semibold text-slate-900 pr-4">{item.q}</span>
                  <svg className="w-5 h-5 text-slate-400 shrink-0 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <p className="mt-3 text-slate-600 text-sm leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
        </div>

        {/* Internal links */}
        <div className="mt-12 grid sm:grid-cols-2 gap-4 max-w-2xl">
          <Link href="/ai-tools/resume-builder" className="group bg-blue-50 rounded-xl border border-blue-100 p-5 hover:border-blue-300 transition-all">
            <h3 className="font-bold text-slate-900 group-hover:text-blue-700 mb-1">Free Resume Builder</h3>
            <p className="text-sm text-slate-600">Build an ATS-optimised resume in minutes — 100% free.</p>
          </Link>
          <Link href="/ai-tools/resume-builder/templates" className="group bg-slate-50 rounded-xl border border-slate-200 p-5 hover:border-blue-300 transition-all">
            <h3 className="font-bold text-slate-900 group-hover:text-blue-700 mb-1">Free Resume Templates</h3>
            <p className="text-sm text-slate-600">6 ATS-friendly templates — Classic, Modern, Tech, and more.</p>
          </Link>
        </div>
      </section>
    </>
  )
}
