import Link from 'next/link'

export const metadata = {
  title: 'AI Resume Builder — Create ATS-Friendly Resumes Free | MyTechZ',
  description:
    'Generate a polished, ATS-optimised resume in minutes. Pick a template, let AI refine your bullet points, and export a recruiter-ready PDF or DOCX.',
  alternates: { canonical: '/ai-tools/resume-builder' },
  openGraph: {
    title: 'AI Resume Builder — Create ATS-Friendly Resumes Free | MyTechZ',
    description: 'Generate a polished, ATS-optimised resume in minutes with AI.',
    url: '/ai-tools/resume-builder',
  },
  twitter: { card: 'summary_large_image' },
}

const FEATURES = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
      </svg>
    ),
    title: 'AI-Powered Content',
    description: 'AI generates professional bullet points, summaries, and descriptions tailored to your target role.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
      </svg>
    ),
    title: '6 Professional Templates',
    description: 'Choose from Classic, Modern, Minimal, Creative, Professional, and Tech — all ATS-friendly.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
      </svg>
    ),
    title: 'PDF & DOCX Export',
    description: 'Download your resume in PDF or Microsoft Word format instantly with one click.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
      </svg>
    ),
    title: 'Voice Editor',
    description: 'Speak your experience and let AI structure it into resume sections — hands-free editing.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
    title: 'ATS Score Check',
    description: 'Get an instant ATS compatibility score and keyword suggestions to beat automated screening.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 7.5h-.75A2.25 2.25 0 004.5 9.75v7.5a2.25 2.25 0 002.25 2.25h7.5a2.25 2.25 0 002.25-2.25v-7.5a2.25 2.25 0 00-2.25-2.25h-.75m0-3l-3-3m0 0l-3 3m3-3v11.25m6-2.25h.75a2.25 2.25 0 012.25 2.25v7.5a2.25 2.25 0 01-2.25 2.25h-7.5a2.25 2.25 0 01-2.25-2.25v-.75" />
      </svg>
    ),
    title: 'Upload & Auto-Fill',
    description: 'Upload your existing resume (PDF/DOCX) and let AI extract and structure your data automatically.',
  },
]

const HOW_IT_WORKS = [
  { step: '1', title: 'Choose a Template', desc: 'Browse 6 professionally designed, ATS-friendly templates.' },
  { step: '2', title: 'Fill Your Details', desc: 'Add your info step-by-step or upload an existing resume.' },
  { step: '3', title: 'AI Enhances It', desc: 'AI polishes your bullet points and generates a compelling summary.' },
  { step: '4', title: 'Download', desc: 'Export as PDF or DOCX — ready to send to recruiters.' },
]

function WebAppJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'MyTechZ AI Resume Builder',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
    description: 'Free AI-powered resume builder with ATS-friendly templates. Export as PDF or DOCX.',
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
}

export default function ResumeBuilderPage() {
  return (
    <>
      <WebAppJsonLd />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50">
        {/* Animated background */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-blue-300/20 blur-3xl hero-blob" />
          <div className="absolute top-20 -right-40 w-96 h-96 rounded-full bg-amber-300/15 blur-3xl hero-blob" style={{ animationDelay: '-5s' }} />
          <div className="absolute -bottom-40 left-1/3 w-96 h-96 rounded-full bg-indigo-300/20 blur-3xl hero-blob" style={{ animationDelay: '-10s' }} />
        </div>

        {/* Hero */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 sm:pt-20 sm:pb-16">
          <div className="text-center max-w-3xl mx-auto hero-fade-up">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider rounded-full mb-4">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" /></svg>
              AI-Powered
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
              Build Your Perfect <br />
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Resume in Minutes</span>
            </h1>
            <p className="mt-5 text-lg text-slate-600 max-w-2xl mx-auto">
              Pick a template, fill in your details, and let AI enhance your resume. Free, ATS-friendly, and ready to download as PDF or DOCX.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/ai-tools/resume-builder/templates"
                className="inline-flex items-center justify-center px-8 py-3.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/25 hover:shadow-xl hover:-translate-y-0.5"
              >
                Browse Templates
                <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
              </Link>
              <Link
                href="/ai-tools/resume-builder/editor?template=classic"
                className="inline-flex items-center justify-center px-8 py-3.5 bg-white text-slate-700 font-semibold rounded-xl border border-slate-200 hover:bg-slate-50 transition-all hover:-translate-y-0.5"
              >
                Start Building Free
              </Link>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12 hero-fade-up">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700">Features</span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-slate-900">Everything You Need</h2>
            <p className="mt-3 text-base text-slate-600">Professional tools to create the perfect resume.</p>
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
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12 hero-fade-up" style={{ animationDelay: '0.3s' }}>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700">How It Works</span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-slate-900">4 Simple Steps</h2>
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

        {/* CTA */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl px-8 py-12 text-center text-white hero-fade-up" style={{ animationDelay: '0.5s' }}>
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">Ready to Build Your Resume?</h2>
            <p className="text-blue-100 mb-8 max-w-lg mx-auto">Join thousands of job seekers who landed interviews with MyTechZ resumes.</p>
            <Link
              href="/ai-tools/resume-builder/templates"
              className="inline-flex items-center px-8 py-3.5 bg-white text-blue-700 font-semibold rounded-xl hover:bg-blue-50 transition-all shadow-lg"
            >
              Get Started Free
              <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
            </Link>
          </div>
        </section>
      </div>
    </>
  )
}
