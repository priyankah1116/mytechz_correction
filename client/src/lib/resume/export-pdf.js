import 'server-only'
import PDFDocument from 'pdfkit'

// Color palette per template
const PALETTES = {
  classic: { primary: '#1e40af', heading: '#0f172a', text: '#334155', light: '#94a3b8' },
  modern: { primary: '#7c3aed', heading: '#0f172a', text: '#334155', light: '#94a3b8' },
  minimal: { primary: '#374151', heading: '#111827', text: '#4b5563', light: '#9ca3af' },
  creative: { primary: '#059669', heading: '#0f172a', text: '#334155', light: '#94a3b8' },
  professional: { primary: '#0f172a', heading: '#0f172a', text: '#334155', light: '#64748b' },
  tech: { primary: '#ea580c', heading: '#0f172a', text: '#334155', light: '#94a3b8' },
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  const [year, month] = dateStr.split('-')
  if (!year) return dateStr
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  if (month) return `${months[parseInt(month, 10) - 1]} ${year}`
  return year
}

export function toResumePDF(resumeData, templateSlug = 'classic') {
  return new Promise((resolve, reject) => {
    const colors = PALETTES[templateSlug] || PALETTES.classic
    const d = resumeData || {}
    const basics = d.basics || {}
    const work = d.work || []
    const education = d.education || []
    const skills = d.skills || []
    const projects = d.projects || []
    const certificates = d.certificates || []
    const languages = d.languages || []

    const doc = new PDFDocument({ size: 'A4', margin: 48 })
    const chunks = []
    doc.on('data', (c) => chunks.push(c))
    doc.on('end', () => resolve(Buffer.concat(chunks)))
    doc.on('error', reject)

    const pageW = doc.page.width - doc.page.margins.left - doc.page.margins.right

    // Helper: check page break
    function checkBreak(needed = 60) {
      if (doc.y + needed > doc.page.height - doc.page.margins.bottom - 20) {
        doc.addPage()
      }
    }

    // === HEADER ===
    doc.fontSize(22).fillColor(colors.heading).text(basics.name || 'Your Name', { continued: false })
    if (basics.label) {
      doc.fontSize(12).fillColor(colors.primary).text(basics.label)
    }
    doc.moveDown(0.3)

    // Contact line
    const contactParts = []
    if (basics.email) contactParts.push(basics.email)
    if (basics.phone) contactParts.push(basics.phone)
    if (basics.location?.city) {
      let loc = basics.location.city
      if (basics.location.region) loc += `, ${basics.location.region}`
      contactParts.push(loc)
    }
    if (basics.url) contactParts.push(basics.url)
    basics.profiles?.forEach((p) => {
      if (p.url || p.username) contactParts.push(`${p.network}: ${p.url || p.username}`)
    })
    if (contactParts.length) {
      doc.fontSize(8.5).fillColor(colors.light).text(contactParts.join('  |  '))
    }

    // Divider
    doc.moveDown(0.5)
    doc.moveTo(doc.page.margins.left, doc.y)
      .lineTo(doc.page.margins.left + pageW, doc.y)
      .strokeColor(colors.primary)
      .lineWidth(2)
      .stroke()
    doc.moveDown(0.6)

    // === SUMMARY ===
    if (basics.summary) {
      doc.fontSize(11).font('Helvetica-Bold').fillColor(colors.heading).text('PROFESSIONAL SUMMARY')
      doc.moveDown(0.3)
      doc.font('Helvetica').fontSize(9.5).fillColor(colors.text).text(basics.summary, { lineGap: 2 })
      doc.moveDown(0.6)
    }

    // === EXPERIENCE ===
    if (work.length > 0) {
      checkBreak(40)
      doc.fontSize(11).font('Helvetica-Bold').fillColor(colors.heading).text('EXPERIENCE')
      doc.moveDown(0.3)

      work.forEach((w) => {
        checkBreak(50)
        const dateStr = `${formatDate(w.startDate)} — ${w.current ? 'Present' : formatDate(w.endDate)}`

        doc.font('Helvetica-Bold').fontSize(10).fillColor(colors.heading)
          .text(w.position || '', { continued: true })
        doc.font('Helvetica').fontSize(9).fillColor(colors.light)
          .text(`  ${dateStr}`, { align: 'right' })

        doc.font('Helvetica').fontSize(9.5).fillColor(colors.primary)
          .text(w.name || '')

        const highlights = (w.highlights || []).filter(Boolean)
        if (highlights.length) {
          doc.moveDown(0.2)
          highlights.forEach((h) => {
            checkBreak(15)
            doc.font('Helvetica').fontSize(9).fillColor(colors.text)
            const bullet = `  •  ${h}`
            doc.text(bullet, doc.page.margins.left + 8, undefined, { width: pageW - 16, lineGap: 1 })
          })
        }
        doc.moveDown(0.5)
      })
    }

    // === EDUCATION ===
    if (education.length > 0) {
      checkBreak(40)
      doc.fontSize(11).font('Helvetica-Bold').fillColor(colors.heading).text('EDUCATION')
      doc.moveDown(0.3)

      education.forEach((e) => {
        checkBreak(30)
        const degree = `${e.studyType ? `${e.studyType} in ` : ''}${e.area || ''}`
        const dateStr = `${formatDate(e.startDate)} — ${formatDate(e.endDate)}`

        doc.font('Helvetica-Bold').fontSize(10).fillColor(colors.heading)
          .text(degree, { continued: true })
        doc.font('Helvetica').fontSize(9).fillColor(colors.light)
          .text(`  ${dateStr}`, { align: 'right' })

        doc.font('Helvetica').fontSize(9.5).fillColor(colors.primary)
          .text(e.institution || '')

        if (e.score) {
          doc.font('Helvetica').fontSize(8.5).fillColor(colors.light).text(`Score: ${e.score}`)
        }
        doc.moveDown(0.4)
      })
    }

    // === SKILLS ===
    if (skills.length > 0) {
      checkBreak(30)
      doc.fontSize(11).font('Helvetica-Bold').fillColor(colors.heading).text('SKILLS')
      doc.moveDown(0.3)

      skills.forEach((s) => {
        doc.font('Helvetica-Bold').fontSize(9).fillColor(colors.heading)
          .text(`${s.name}: `, { continued: true })
        doc.font('Helvetica').fontSize(9).fillColor(colors.text)
          .text((s.keywords || []).join(', '))
      })
      doc.moveDown(0.5)
    }

    // === PROJECTS ===
    if (projects.length > 0) {
      checkBreak(30)
      doc.fontSize(11).font('Helvetica-Bold').fillColor(colors.heading).text('PROJECTS')
      doc.moveDown(0.3)

      projects.forEach((p) => {
        checkBreak(30)
        doc.font('Helvetica-Bold').fontSize(10).fillColor(colors.heading).text(p.name || '')
        if (p.description) {
          doc.font('Helvetica').fontSize(9).fillColor(colors.text).text(p.description)
        }
        const highlights = (p.highlights || []).filter(Boolean)
        highlights.forEach((h) => {
          checkBreak(15)
          doc.font('Helvetica').fontSize(9).fillColor(colors.text).text(`  •  ${h}`, { lineGap: 1 })
        })
        doc.moveDown(0.3)
      })
    }

    // === CERTIFICATIONS ===
    if (certificates.length > 0) {
      checkBreak(25)
      doc.fontSize(11).font('Helvetica-Bold').fillColor(colors.heading).text('CERTIFICATIONS')
      doc.moveDown(0.3)

      certificates.forEach((c) => {
        doc.font('Helvetica-Bold').fontSize(9).fillColor(colors.heading)
          .text(`${c.name}`, { continued: true })
        doc.font('Helvetica').fillColor(colors.text)
          .text(` — ${c.issuer}${c.date ? ` (${formatDate(c.date)})` : ''}`)
      })
      doc.moveDown(0.4)
    }

    // === LANGUAGES ===
    if (languages.length > 0) {
      checkBreak(20)
      doc.fontSize(11).font('Helvetica-Bold').fillColor(colors.heading).text('LANGUAGES')
      doc.moveDown(0.3)
      const langText = languages.map((l) => `${l.language} (${l.fluency})`).join('  |  ')
      doc.font('Helvetica').fontSize(9).fillColor(colors.text).text(langText)
    }

    doc.end()
  })
}
