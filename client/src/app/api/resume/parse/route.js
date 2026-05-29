import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { chatJSON, safeParseJSON } from '@/lib/ai/llm'
import { rateLimit } from '@/lib/ai/rate-limit'

export async function POST(req) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  if (await rateLimit(user.id)) {
    return NextResponse.json({ error: 'Rate limit exceeded. Try again shortly.' }, { status: 429 })
  }

  const formData = await req.formData()
  const file = formData.get('file')
  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

  // Extract text from the file
  let text = ''
  try {
    const buffer = Buffer.from(await file.arrayBuffer())

    if (file.type === 'application/pdf') {
      try {
        const { PDFParse } = await import('pdf-parse')
        const parser = new PDFParse({ data: new Uint8Array(buffer) })
        const result = await parser.getText()
        text = result.text
        await parser.destroy()
      } catch {
        // Fallback: raw text extraction
        text = buffer.toString('utf-8').replace(/[^\x20-\x7E\n\r\t]/g, ' ')
      }
    } else {
      // DOCX - mammoth
      try {
        const mammoth = await import('mammoth')
        const result = await mammoth.extractRawText({ buffer })
        text = result.value
      } catch {
        text = buffer.toString('utf-8').replace(/[^\x20-\x7E\n\r\t]/g, ' ')
      }
    }
  } catch (err) {
    return NextResponse.json({ error: 'Failed to extract text from file' }, { status: 400 })
  }

  if (!text.trim()) {
    return NextResponse.json({ error: 'Could not extract text from the uploaded file.' }, { status: 400 })
  }

  // Trim to reasonable length for LLM
  const trimmedText = text.slice(0, 6000)

  // Use AI to parse into structured resume data
  const result = await chatJSON({
    system: `You are a resume parsing expert. Extract structured data from the resume text below. Return JSON matching the JSON Resume schema:
{
  "basics": { "name": "", "label": "", "email": "", "phone": "", "summary": "", "location": { "city": "", "region": "" }, "profiles": [] },
  "work": [{ "name": "", "position": "", "startDate": "YYYY-MM", "endDate": "YYYY-MM", "current": false, "highlights": [] }],
  "education": [{ "institution": "", "area": "", "studyType": "", "startDate": "YYYY-MM", "endDate": "YYYY-MM", "score": "" }],
  "skills": [{ "name": "", "level": "", "keywords": [] }],
  "projects": [{ "name": "", "description": "", "highlights": [] }],
  "certificates": [{ "name": "", "issuer": "", "date": "YYYY-MM" }],
  "languages": [{ "language": "", "fluency": "" }]
}
Extract all available information. Use YYYY-MM format for dates. Group skills by category.`,
    user: trimmedText,
    json: true,
    max: 2000,
    smart: true,
  })

  const parsed = safeParseJSON(result, {})
  return NextResponse.json(parsed)
}
