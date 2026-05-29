import ContactClient from './ContactClient'

export const metadata = {
  title: 'Contact MyTechZ — Get in Touch with Our Team',
  description:
    'Have questions about MyTechZ? Reach out to our team for support with job applications, recruiter partnerships or platform feedback.',
  alternates: { canonical: '/contact' },
  openGraph: {
    title: 'Contact MyTechZ — Get in Touch with Our Team',
    description: 'Have questions about MyTechZ? Reach out to our team for support with job applications, recruiter partnerships or platform feedback.',
    url: '/contact',
  },
  twitter: { card: 'summary_large_image' },
}

export default function ContactPage() {
  return <ContactClient linkedinUrl={process.env.NEXT_PUBLIC_LINKEDIN_URL || 'https://www.linkedin.com/company/108975050/admin/notifications/comments/'} />
}
