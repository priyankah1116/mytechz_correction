import TemplateGallery from '@/components/resume/TemplateGallery'
import { TEMPLATES } from '@/lib/resume/templates'

export const metadata = {
  title: 'Free Resume Templates — ATS-Friendly Designs | MyTechZ',
  description:
    'Browse 6 free, ATS-optimised resume templates. Professional, modern, minimal, creative, and developer-focused designs. Download as PDF or DOCX instantly.',
  alternates: { canonical: '/ai-tools/resume-builder/templates' },
  openGraph: {
    title: 'Free Resume Templates — ATS-Friendly Designs | MyTechZ',
    description: 'Browse 6 free, ATS-optimised resume templates. Download as PDF or DOCX instantly.',
    url: '/ai-tools/resume-builder/templates',
  },
  twitter: { card: 'summary_large_image' },
}

function TemplateJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Free Resume Templates',
    description: 'ATS-friendly resume templates for professionals',
    numberOfItems: TEMPLATES.length,
    itemListElement: TEMPLATES.map((t, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `https://mytechz.com/ai-tools/resume-builder/templates/${t.slug}`,
      name: `${t.name} Resume Template`,
    })),
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
}

function FaqJsonLd() {
  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Are MyTechZ resume templates free?',
        acceptedAnswer: { '@type': 'Answer', text: 'Yes, all MyTechZ resume templates are completely free. You can create, customize, and download your resume as PDF or DOCX at no cost.' },
      },
      {
        '@type': 'Question',
        name: 'Are these resume templates ATS-friendly?',
        acceptedAnswer: { '@type': 'Answer', text: 'Yes, all templates are designed to be ATS (Applicant Tracking System) compatible. Text is selectable, properly structured, and parseable by automated screening tools.' },
      },
      {
        '@type': 'Question',
        name: 'Can I download my resume as PDF or Word document?',
        acceptedAnswer: { '@type': 'Answer', text: 'Yes, you can export your resume in both PDF and DOCX (Microsoft Word) formats. Simply build your resume, choose your template, and click download.' },
      },
      {
        '@type': 'Question',
        name: 'Do I need to create an account to use the resume builder?',
        acceptedAnswer: { '@type': 'Answer', text: 'You can browse templates freely. To build and download your resume, you need a free MyTechZ account which takes just seconds to create.' },
      },
    ],
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
}

export default function TemplatesPage() {
  return (
    <>
      <TemplateJsonLd />
      <FaqJsonLd />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50">
        {/* Animated blobs */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-blue-300/20 blur-3xl hero-blob" />
          <div className="absolute top-20 -right-40 w-96 h-96 rounded-full bg-amber-300/15 blur-3xl hero-blob" style={{ animationDelay: '-5s' }} />
          <div className="absolute -bottom-40 left-1/3 w-96 h-96 rounded-full bg-indigo-300/20 blur-3xl hero-blob" style={{ animationDelay: '-10s' }} />
        </div>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          {/* Header */}
          <header className="text-center max-w-2xl mx-auto mb-12 hero-fade-up">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700">Resume Templates</span>
            <h1 className="mt-2 text-3xl sm:text-4xl font-bold text-slate-900">
              Choose Your Perfect <span className="text-blue-600">Template</span>
            </h1>
            <p className="mt-3 text-base text-slate-600">
              All templates are free, ATS-friendly, and professionally designed. Pick one and start building your resume in minutes.
            </p>
          </header>

          {/* Gallery */}
          <div className="hero-fade-up" style={{ animationDelay: '0.2s' }}>
            <TemplateGallery />
          </div>

          {/* FAQ Section */}
          <section className="mt-20 max-w-3xl mx-auto hero-fade-up" style={{ animationDelay: '0.4s' }}>
            <h2 className="text-2xl font-bold text-slate-900 text-center mb-8">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {[
                { q: 'Are MyTechZ resume templates free?', a: 'Yes, all MyTechZ resume templates are completely free. You can create, customize, and download your resume as PDF or DOCX at no cost.' },
                { q: 'Are these resume templates ATS-friendly?', a: 'Yes, all templates are designed to pass through Applicant Tracking Systems. The text is structured, selectable, and properly formatted for automated parsing.' },
                { q: 'Can I download my resume as PDF or Word?', a: 'Absolutely! Once your resume is ready, you can export it in both PDF and DOCX formats with a single click.' },
                { q: 'Do I need an account to use the builder?', a: 'You can browse templates freely. To build and download, you need a free MyTechZ account — sign up takes seconds with Google or email.' },
              ].map((item, i) => (
                <details key={i} className="group bg-white/70 backdrop-blur-sm rounded-xl border border-slate-200 px-6 py-4">
                  <summary className="flex justify-between items-center cursor-pointer list-none">
                    <span className="font-semibold text-slate-900">{item.q}</span>
                    <svg className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <p className="mt-3 text-slate-600 text-sm">{item.a}</p>
                </details>
              ))}
            </div>
          </section>
        </section>
      </div>
    </>
  )
}
