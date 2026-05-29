import Link from 'next/link'
import { notFound } from 'next/navigation'
import { TEMPLATES, getTemplate } from '@/lib/resume/templates'
import TemplatePreviewClient from './TemplatePreviewClient'

export function generateStaticParams() {
  return TEMPLATES.map((t) => ({ slug: t.slug }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const t = getTemplate(slug)
  if (!t) return {}
  return {
    title: `Free ${t.name} Resume Template — ATS-Friendly | MyTechZ`,
    description: t.description + ' Download as PDF or DOCX for free. No signup required to preview.',
    alternates: { canonical: `/ai-tools/resume-builder/templates/${slug}` },
    openGraph: {
      title: `Free ${t.name} Resume Template | MyTechZ`,
      description: t.description,
      url: `/ai-tools/resume-builder/templates/${slug}`,
    },
    twitter: { card: 'summary_large_image' },
  }
}

export default async function TemplateDetailPage({ params }) {
  const { slug } = await params
  const template = getTemplate(slug)
  if (!template || template.slug !== slug) notFound()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: `${template.name} Resume Template - MyTechZ`,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
    description: template.description,
  }

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `Is the ${template.name} resume template free?`,
        acceptedAnswer: { '@type': 'Answer', text: `Yes, the ${template.name} template is completely free. Create, customize, and download in PDF or DOCX format.` },
      },
      {
        '@type': 'Question',
        name: `Is the ${template.name} template ATS-friendly?`,
        acceptedAnswer: { '@type': 'Answer', text: 'Yes. All MyTechZ templates are designed for ATS compatibility with properly structured, selectable text.' },
      },
      {
        '@type': 'Question',
        name: `What formats can I download the ${template.name} template in?`,
        acceptedAnswer: { '@type': 'Answer', text: 'You can download your resume as a PDF or Microsoft Word (DOCX) document.' },
      },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50">
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-blue-300/20 blur-3xl hero-blob" />
          <div className="absolute top-20 -right-40 w-96 h-96 rounded-full bg-amber-300/15 blur-3xl hero-blob" style={{ animationDelay: '-5s' }} />
        </div>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          {/* Breadcrumb */}
          <nav className="mb-8 text-sm hero-fade-up">
            <Link href="/ai-tools/resume-builder/templates" className="text-blue-600 hover:text-blue-800">
              Templates
            </Link>
            <span className="mx-2 text-slate-400">/</span>
            <span className="text-slate-600">{template.name}</span>
          </nav>

          <div className="grid lg:grid-cols-[1fr_340px] gap-10">
            {/* Preview */}
            <div className="hero-fade-up">
              <TemplatePreviewClient slug={template.slug} />
            </div>

            {/* Info Panel */}
            <div className="hero-fade-up" style={{ animationDelay: '0.15s' }}>
              <div className="sticky top-8 bg-white/70 backdrop-blur-xl rounded-2xl border border-white/50 shadow-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: template.color }} />
                  <h1 className="text-2xl font-bold text-slate-900">{template.name}</h1>
                </div>
                <p className="text-slate-600 text-sm mb-4">{template.description}</p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {template.features?.map((f, i) => (
                    <span key={i} className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-medium">{f}</span>
                  ))}
                </div>

                <Link
                  href={`/ai-tools/resume-builder/editor?template=${template.slug}`}
                  className="block w-full text-center bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg mb-3"
                >
                  Use This Template
                </Link>
                <Link
                  href="/ai-tools/resume-builder/templates"
                  className="block w-full text-center bg-white text-slate-700 font-medium py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors text-sm"
                >
                  Browse All Templates
                </Link>

                {/* Template category */}
                <div className="mt-6 pt-4 border-t border-slate-200">
                  <p className="text-xs text-slate-500">
                    Category: <span className="capitalize font-medium text-slate-700">{template.category}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ */}
          <section className="mt-16 max-w-3xl">
            <h2 className="text-xl font-bold text-slate-900 mb-6">About the {template.name} Template</h2>
            <div className="space-y-3">
              {[
                { q: `Is the ${template.name} template free?`, a: `Yes, completely free. Build, customize, and download in PDF or DOCX.` },
                { q: `Is it ATS-friendly?`, a: 'Yes. Clean structure, selectable text, and proper formatting ensure ATS compatibility.' },
                { q: `What format can I download in?`, a: 'PDF and DOCX (Microsoft Word) are both available.' },
                { q: `Best for which roles?`, a: template.description },
              ].map((item, i) => (
                <details key={i} className="group bg-white/70 backdrop-blur-sm rounded-xl border border-slate-200 px-5 py-3">
                  <summary className="flex justify-between items-center cursor-pointer list-none text-sm">
                    <span className="font-semibold text-slate-900">{item.q}</span>
                    <svg className="w-4 h-4 text-slate-400 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <p className="mt-2 text-slate-600 text-sm">{item.a}</p>
                </details>
              ))}
            </div>
          </section>
        </section>
      </div>
    </>
  )
}
