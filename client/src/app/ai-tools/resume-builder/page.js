import Link from 'next/link'

const SITE = 'https://mytechz.com'

export const metadata = {
  title: 'Free Resume Builder — Best Free CV Builder Online | MyTechZ',
  description:
    'MyTechZ is India\'s best free resume builder and CV builder. Create ATS-friendly resumes in minutes with AI. 6 professional templates. Export as PDF or DOCX — 100% free, no credit card required.',
  keywords:
    'free resume builder, best free resume builder, cv builder free, free cv builder online, ATS resume builder, AI resume builder, resume maker free, free resume maker online, resume builder India, free resume templates, create resume free, online resume builder',
  alternates: { canonical: `${SITE}/ai-tools/resume-builder` },
  openGraph: {
    title: 'Free Resume Builder — Best Free CV Builder Online | MyTechZ',
    description: 'Create ATS-friendly resumes free with AI in minutes. 6 professional templates. Download PDF or DOCX instantly. India\'s best free resume builder.',
    url: `${SITE}/ai-tools/resume-builder`,
    type: 'website',
    siteName: 'MyTechZ',
    images: [{ url: `${SITE}/og-image.png`, width: 1200, height: 630, alt: 'MyTechZ Free Resume Builder' }],
  },
  twitter: { card: 'summary_large_image', title: 'Free Resume Builder — Best Free CV Builder | MyTechZ', description: 'Create ATS-friendly resumes free with AI. 6 professional templates. Download PDF or DOCX.' },
}

const FEATURES = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
      </svg>
    ),
    title: 'AI-Powered Content Generation',
    description: 'AI generates professional bullet points, summaries, and role-specific descriptions tailored to your target job — completely free.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
      </svg>
    ),
    title: '6 Free Professional Templates',
    description: 'Classic, Modern, Minimal, Creative, Professional, and Tech — all ATS-optimised, recruiter-tested, and 100% free to use.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
      </svg>
    ),
    title: 'Free PDF & DOCX Export',
    description: 'Download your free resume as a PDF or Microsoft Word (DOCX) file instantly with one click. No watermarks, no paywalls.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
      </svg>
    ),
    title: 'Voice-to-Resume Editor',
    description: 'Speak your experience and let AI structure it into resume sections — hands-free editing for a faster, smarter resume.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
    title: 'Instant ATS Score Check',
    description: 'Get an instant ATS compatibility score and keyword gap analysis to beat automated screening tools before you apply.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 7.5h-.75A2.25 2.25 0 004.5 9.75v7.5a2.25 2.25 0 002.25 2.25h7.5a2.25 2.25 0 002.25-2.25v-7.5a2.25 2.25 0 00-2.25-2.25h-.75m0-3l-3-3m0 0l-3 3m3-3v11.25m6-2.25h.75a2.25 2.25 0 012.25 2.25v7.5a2.25 2.25 0 01-2.25 2.25h-7.5a2.25 2.25 0 01-2.25-2.25v-.75" />
      </svg>
    ),
    title: 'Upload & Auto-Fill Resume',
    description: 'Upload your existing resume (PDF/DOCX) and let AI parse, extract, and pre-fill all your data automatically.',
  },
]

const HOW_IT_WORKS = [
  { step: '1', title: 'Choose a Free Template', desc: 'Browse 6 professionally designed, ATS-friendly templates — all completely free.' },
  { step: '2', title: 'Fill Your Details', desc: 'Add your info step-by-step or upload an existing resume for instant auto-fill.' },
  { step: '3', title: 'AI Enhances Your CV', desc: 'AI polishes your bullet points and writes a compelling professional summary.' },
  { step: '4', title: 'Download Free', desc: 'Export as PDF or DOCX instantly — no watermarks, no credit card, no cost.' },
]

const FAQ_ITEMS = [
  {
    q: 'Is MyTechZ resume builder really free?',
    a: 'Yes, MyTechZ is a 100% free resume builder. You can create, customize, and download your resume as PDF or DOCX at absolutely no cost. No credit card required, no hidden fees, no watermarks.',
  },
  {
    q: 'Is MyTechZ the best free resume builder for India?',
    a: 'MyTechZ is designed specifically for the Indian job market. It offers ATS-optimised templates, AI-generated content, and free exports — making it one of the best free resume builders and CV builders for job seekers in India.',
  },
  {
    q: 'What makes a resume ATS-friendly?',
    a: 'An ATS-friendly resume uses clean formatting, standard section headings, selectable text (no images of text), and keyword-rich content matching the job description. All MyTechZ templates are ATS-compatible by design.',
  },
  {
    q: 'Can I build a CV for free using MyTechZ?',
    a: 'Absolutely. MyTechZ is both a free resume builder and a free CV builder online. The terms are used interchangeably — you get the same professional result for free.',
  },
  {
    q: 'How long does it take to create a free resume?',
    a: 'Most users build a complete, professional resume in under 10 minutes using our AI-assisted editor. The AI handles summaries, bullet points, and formatting so you can focus on your content.',
  },
  {
    q: 'Which resume format is best for freshers in India?',
    a: 'For freshers, a clean one-page resume using the Classic or Modern template works best. Highlight your education, internships, projects, and skills. MyTechZ\'s AI will help structure your content for maximum impact.',
  },
  {
    q: 'Can I download my resume in Word format for free?',
    a: 'Yes. MyTechZ lets you download your resume as DOCX (Microsoft Word) or PDF — both completely free with one click.',
  },
  {
    q: 'Do I need to sign up to use the free resume builder?',
    a: 'You can browse all templates for free without signing up. To build, save, and download your resume, create a free MyTechZ account — it takes under 30 seconds with Google or email.',
  },
]

function JsonLd() {
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
      { '@type': 'ListItem', position: 2, name: 'AI Tools', item: `${SITE}/ai-tools` },
      { '@type': 'ListItem', position: 3, name: 'Free Resume Builder', item: `${SITE}/ai-tools/resume-builder` },
    ],
  }

  const webApp = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'MyTechZ Free Resume Builder',
    alternateName: ['Free CV Builder', 'Best Free Resume Builder India', 'AI Resume Maker Free'],
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    url: `${SITE}/ai-tools/resume-builder`,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'INR',
      description: 'Free forever — no credit card required',
    },
    description: 'India\'s best free resume builder and CV builder. Create ATS-friendly resumes in minutes with AI assistance. 6 professional templates, PDF and DOCX download.',
    featureList: [
      'AI-powered content generation',
      '6 free ATS-friendly resume templates',
      'Free PDF download',
      'Free DOCX (Word) download',
      'ATS score checker',
      'Resume upload and auto-fill',
      'Voice editor',
    ],
    screenshot: `${SITE}/og-image.png`,
    provider: {
      '@type': 'Organization',
      name: 'MyTechZ',
      url: SITE,
    },
  }

  const faqPage = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_ITEMS.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  }

  const howTo = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to Create a Free Resume Using MyTechZ',
    description: 'Build a professional, ATS-friendly resume for free in 4 simple steps using MyTechZ AI Resume Builder.',
    totalTime: 'PT10M',
    tool: [{ '@type': 'HowToTool', name: 'MyTechZ Free Resume Builder' }],
    supply: [],
    step: HOW_IT_WORKS.map(s => ({
      '@type': 'HowToStep',
      position: parseInt(s.step),
      name: s.title,
      text: s.desc,
      url: `${SITE}/ai-tools/resume-builder`,
    })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webApp) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPage) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howTo) }} />
    </>
  )
}

export default function ResumeBuilderPage() {
  return (
    <>
      <JsonLd />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50">
        {/* Animated background */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-blue-300/20 blur-3xl hero-blob" />
          <div className="absolute top-20 -right-40 w-96 h-96 rounded-full bg-amber-300/15 blur-3xl hero-blob" style={{ animationDelay: '-5s' }} />
          <div className="absolute -bottom-40 left-1/3 w-96 h-96 rounded-full bg-indigo-300/20 blur-3xl hero-blob" style={{ animationDelay: '-10s' }} />
        </div>

        {/* Breadcrumb nav */}
        <nav aria-label="Breadcrumb" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 text-xs text-slate-500 flex flex-wrap items-center gap-1">
          <Link href="/" className="hover:text-blue-700">Home</Link>
          <span aria-hidden="true">›</span>
          <Link href="/ai-tools" className="hover:text-blue-700">AI Tools</Link>
          <span aria-hidden="true">›</span>
          <span className="text-slate-700">Free Resume Builder</span>
        </nav>

        {/* Hero */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-12 sm:pt-14 sm:pb-16">
          <div className="text-center max-w-3xl mx-auto hero-fade-up">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider rounded-full mb-4">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" /></svg>
              100% Free — No Credit Card
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
              Free Resume Builder &amp; <br />
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Free CV Builder Online</span>
            </h1>
            <p className="mt-5 text-lg text-slate-600 max-w-2xl mx-auto">
              The best free resume builder for India. Pick a template, fill in your details, and let AI enhance your CV — free to create, free to download as PDF or DOCX. No watermarks, ever.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/ai-tools/resume-builder/templates"
                className="inline-flex items-center justify-center px-8 py-3.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/25 hover:shadow-xl hover:-translate-y-0.5"
              >
                Browse Free Templates
                <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
              </Link>
              <Link
                href="/ai-tools/resume-builder/editor?template=classic"
                className="inline-flex items-center justify-center px-8 py-3.5 bg-white text-slate-700 font-semibold rounded-xl border border-slate-200 hover:bg-slate-50 transition-all hover:-translate-y-0.5"
              >
                Build My Free Resume Now
              </Link>
            </div>
            <p className="mt-4 text-xs text-slate-400">No credit card · No watermark · Free PDF &amp; Word download</p>
          </div>
        </section>

        {/* Trust indicators */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            {[
              { value: '6', label: 'Free Templates' },
              { value: '100%', label: 'ATS-Friendly' },
              { value: 'Free', label: 'PDF & DOCX Export' },
              { value: '10 min', label: 'Avg Build Time' },
            ].map(s => (
              <div key={s.label} className="bg-white/80 backdrop-blur rounded-2xl border border-slate-100 p-4 shadow-sm">
                <div className="text-2xl font-bold text-blue-700">{s.value}</div>
                <div className="text-xs text-slate-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12 hero-fade-up">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700">Features</span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-slate-900">Why MyTechZ is the Best Free Resume Builder</h2>
            <p className="mt-3 text-base text-slate-600 max-w-2xl mx-auto">Every feature you need to create a job-winning resume — completely free, no strings attached.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 hero-fade-up" style={{ animationDelay: '0.2s' }}>
            {FEATURES.map((f, i) => (
              <div key={i} className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/50 p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-4">
                  {f.icon}
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-1">{f.title}</h3>
                <p className="text-sm text-slate-600">{f.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12 hero-fade-up" style={{ animationDelay: '0.3s' }}>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700">How It Works</span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-slate-900">Build Your Free Resume in 4 Steps</h2>
            <p className="mt-3 text-base text-slate-600">From blank page to recruiter-ready resume in under 10 minutes — completely free.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 hero-fade-up" style={{ animationDelay: '0.4s' }}>
            {HOW_IT_WORKS.map((s, i) => (
              <div key={i} className="text-center">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-4">
                  {s.step}
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-1">{s.title}</h3>
                <p className="text-sm text-slate-600">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* AEO / GEO — LLM-optimised Q&A section */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Everything You Want to Know About Free Resume Building</h2>
            <p className="mt-3 text-slate-600">Common questions answered — so you can get started with confidence.</p>
          </div>
          <div className="space-y-4">
            {FAQ_ITEMS.map((item, i) => (
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
        </section>

        {/* CTA */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl px-8 py-12 text-center text-white hero-fade-up" style={{ animationDelay: '0.5s' }}>
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">Ready to Build Your Free Resume?</h2>
            <p className="text-blue-100 mb-2 max-w-lg mx-auto">Join thousands of job seekers who landed interviews with MyTechZ — India&apos;s best free resume builder and CV builder.</p>
            <p className="text-blue-200 text-sm mb-8">100% free · No watermark · PDF &amp; DOCX download</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/ai-tools/resume-builder/templates"
                className="inline-flex items-center justify-center px-8 py-3.5 bg-white text-blue-700 font-semibold rounded-xl hover:bg-blue-50 transition-all shadow-lg"
              >
                Start Building Free
                <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
              </Link>
              <Link
                href="/ai-tools/resume-rank-checker"
                className="inline-flex items-center justify-center px-8 py-3.5 bg-white/10 text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition-all"
              >
                Check My Resume Score
              </Link>
            </div>
          </div>
        </section>

        {/* Internal linking — GEO signal */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-16">
          <h2 className="text-xl font-bold text-slate-900 mb-6 text-center">Explore More Free Career Tools</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { href: '/ai-tools/resume-builder/templates', title: 'Free Resume Templates', desc: 'Classic, Modern, Minimal, Creative, Professional & Tech — all ATS-friendly and free.' },
              { href: '/ai-tools/resume-rank-checker', title: 'Resume Rank Checker', desc: 'Get an instant ATS match score against any job description — free.' },
              { href: '/jobs/private', title: 'Tech Jobs in India', desc: 'Browse 50,000+ verified private, government, and internship openings.' },
            ].map(l => (
              <Link key={l.href} href={l.href} className="group bg-white/70 backdrop-blur rounded-2xl border border-slate-200 p-5 hover:border-blue-300 hover:shadow-md transition-all">
                <h3 className="font-bold text-slate-900 group-hover:text-blue-700 mb-1">{l.title}</h3>
                <p className="text-sm text-slate-600">{l.desc}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  )
}
