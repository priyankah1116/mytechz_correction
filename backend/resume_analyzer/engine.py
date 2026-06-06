"""
Resume Analysis Engine
Handles text extraction, keyword matching, section detection, and scoring.
No external ML/NLP libraries required — uses regex + curated dictionaries.
"""

import re
import json
from decimal import Decimal
from django.utils import timezone


# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

SECTION_PATTERNS = {
    'contact': [
        r'\b(contact|email|phone|mobile|address|linkedin|github|portfolio)\b',
        r'[\w.+-]+@[\w-]+\.[a-z]{2,}',        # email regex
        r'\+?[\d\s\-().]{7,}',                  # phone regex
    ],
    'summary': [
        r'\b(summary|profile|objective|about me|career objective|professional summary'
        r'|personal statement|overview)\b',
    ],
    'experience': [
        r'\b(experience|work experience|employment|work history|professional experience'
        r'|career history|positions held|job history)\b',
    ],
    'education': [
        r'\b(education|academic|qualification|degree|university|college|school'
        r'|b\.?tech|m\.?tech|b\.?e\.?|m\.?e\.?|b\.?sc|m\.?sc|mba|phd|bachelor|master)\b',
    ],
    'skills': [
        r'\b(skills|technical skills|core competencies|competencies|expertise'
        r'|technologies|tech stack|key skills|proficiencies)\b',
    ],
    'certifications': [
        r'\b(certifications?|certificates?|credentials?|licenses?|accreditations?'
        r'|aws certified|google certified|microsoft certified|pmp|cissp|cfa)\b',
    ],
    'projects': [
        r'\b(projects?|personal projects?|side projects?|portfolio projects?'
        r'|academic projects?|key projects?)\b',
    ],
    'achievements': [
        r'\b(achievements?|awards?|honors?|accomplishments?|recognition'
        r'|accolades?|milestones?)\b',
    ],
    'languages': [
        r'\b(languages?|spoken languages?|language proficiency|linguistic skills)\b',
        r'\b(english|hindi|tamil|telugu|kannada|malayalam|marathi|bengali'
        r'|gujarati|punjabi|french|german|spanish|mandarin)\b',
    ],
}

# Action verbs that indicate strong bullets
ACTION_VERBS = {
    'led', 'built', 'developed', 'designed', 'architected', 'implemented',
    'deployed', 'launched', 'created', 'established', 'founded', 'initiated',
    'spearheaded', 'pioneered', 'drove', 'delivered', 'achieved', 'managed',
    'directed', 'oversaw', 'coordinated', 'supervised', 'mentored', 'coached',
    'trained', 'onboarded', 'optimized', 'improved', 'enhanced', 'increased',
    'reduced', 'decreased', 'cut', 'saved', 'generated', 'grew', 'scaled',
    'expanded', 'negotiated', 'secured', 'won', 'closed', 'sold', 'pitched',
    'presented', 'analyzed', 'evaluated', 'assessed', 'researched', 'identified',
    'resolved', 'troubleshot', 'debugged', 'fixed', 'migrated', 'integrated',
    'automated', 'streamlined', 'modernized', 'revamped', 'restructured',
    'collaborated', 'partnered', 'liaised', 'facilitated', 'organized',
    'planned', 'strategized', 'forecasted', 'modeled', 'programmed', 'coded',
    'engineered', 'tested', 'validated', 'verified', 'documented', 'authored',
    'published', 'contributed', 'maintained', 'supported', 'administered',
    'configured', 'monitored', 'tracked', 'reported', 'presented', 'communicated',
}

# Weak / passive phrases that lower score
WEAK_PHRASES = [
    r'\bresponsible for\b',
    r'\bworked on\b',
    r'\bhelped with\b',
    r'\bassisted in\b',
    r'\bpart of a team\b',
    r'\bwas involved in\b',
    r'\bdid\b',
    r'\bhandled\b',
    r'\bdealt with\b',
]

# Quantification patterns
QUANT_PATTERNS = [
    r'\d+\s*%',                              # 25%
    r'\$\s*\d+[\d,]*(?:\.\d+)?[kmb]?',      # $50k, $1.2M
    r'₹\s*\d+[\d,]*(?:\.\d+)?[lc]?',        # ₹5L, ₹1Cr
    r'\b\d+[\d,]+\+?\s*(users?|clients?|customers?|employees?|team members?)\b',
    r'\b\d+x\b',                             # 3x growth
    r'\b(increased|decreased|reduced|improved|grew|saved)\b.{0,40}\b\d+',
    r'\b\d+\s*(years?|months?|weeks?)\b',
    r'\b\d+[\d,]*\s*(projects?|applications?|systems?|features?|tickets?)\b',
]


# ---------------------------------------------------------------------------
# Text Extraction (plain text only — PDF/DOCX requires installed libraries)
# ---------------------------------------------------------------------------

def extract_text_from_file(file_obj, file_type):
    """
    Extract plain text from the uploaded resume file.
    Supports: txt (native), pdf (via pdfminer if installed), docx (via python-docx if installed).
    Falls back to reading raw bytes decoded as utf-8 for txt.
    """
    text = ''
    file_obj.seek(0)

    if file_type == 'txt':
        try:
            text = file_obj.read().decode('utf-8', errors='replace')
        except Exception:
            text = ''

    elif file_type == 'pdf':
        try:
            from pdfminer.high_level import extract_text as pdf_extract
            import io
            text = pdf_extract(io.BytesIO(file_obj.read()))
        except ImportError:
            # pdfminer not installed — read raw and strip binary
            raw = file_obj.read()
            text = raw.decode('utf-8', errors='replace')
            # Remove non-printable chars
            text = re.sub(r'[^\x20-\x7E\n\r\t]', ' ', text)
        except Exception:
            text = ''

    elif file_type in ('docx', 'doc'):
        try:
            from docx import Document
            import io
            doc = Document(io.BytesIO(file_obj.read()))
            paragraphs = [p.text for p in doc.paragraphs if p.text.strip()]
            text = '\n'.join(paragraphs)
        except ImportError:
            raw = file_obj.read()
            text = raw.decode('utf-8', errors='replace')
            text = re.sub(r'[^\x20-\x7E\n\r\t]', ' ', text)
        except Exception:
            text = ''

    return text.strip()


# ---------------------------------------------------------------------------
# Section Detection
# ---------------------------------------------------------------------------

def detect_sections(text):
    """
    Detect which of the 9 standard resume sections are present.
    Returns a dict: { section_name: { is_present, char_start, char_end, word_count, ... } }
    """
    text_lower = text.lower()
    results = {}

    for section, patterns in SECTION_PATTERNS.items():
        combined = '|'.join(patterns)
        match = re.search(combined, text_lower, re.IGNORECASE)

        if match:
            char_start = match.start()
            # Estimate section end: next section header or end of text
            # Find the nearest next-section start after this one
            next_start = len(text)
            for other_section, other_patterns in SECTION_PATTERNS.items():
                if other_section == section:
                    continue
                other_combined = '|'.join(other_patterns)
                other_match = re.search(other_combined, text_lower[char_start + 10:], re.IGNORECASE)
                if other_match:
                    candidate = char_start + 10 + other_match.start()
                    if candidate < next_start:
                        next_start = candidate

            section_text = text[char_start:next_start]
            word_count = len(section_text.split())
            char_count = len(section_text)
            bullet_count = len(re.findall(r'^\s*[•\-\*\u2022\u2023\u25e6]', section_text, re.MULTILINE))

            results[section] = {
                'is_present': True,
                'char_start': char_start,
                'char_end': min(next_start, char_start + 3000),
                'word_count': word_count,
                'char_count': char_count,
                'bullet_count': bullet_count,
            }
        else:
            results[section] = {
                'is_present': False,
                'char_start': None,
                'char_end': None,
                'word_count': 0,
                'char_count': 0,
                'bullet_count': 0,
            }

    return results


# ---------------------------------------------------------------------------
# Section Scoring + Feedback
# ---------------------------------------------------------------------------

SECTION_WEIGHTS = {
    'contact': 10,
    'summary': 12,
    'experience': 25,
    'education': 12,
    'skills': 16,
    'certifications': 8,
    'projects': 8,
    'achievements': 5,
    'languages': 4,
}

def score_section(section_name, section_data):
    """
    Return a 0–100 strength score for a detected section + feedback text.
    """
    if not section_data['is_present']:
        return 0, f'Section "{section_name.title()}" is missing. Add it to improve your ATS score.'

    wc = section_data['word_count']
    bc = section_data['bullet_count']
    score = 50  # base for being present
    feedback_parts = []

    if section_name == 'contact':
        score = 90
        feedback_parts.append('Contact info detected.')

    elif section_name == 'summary':
        if wc < 30:
            score = 40
            feedback_parts.append(f'Summary is too short ({wc} words). Aim for 50–80 words.')
        elif wc > 150:
            score = 65
            feedback_parts.append(f'Summary is too long ({wc} words). Keep it under 100 words.')
        else:
            score = 85
            feedback_parts.append('Summary length is good.')

    elif section_name == 'experience':
        if bc == 0:
            score = 45
            feedback_parts.append('No bullet points found in Experience. Use bullets for each role.')
        elif bc < 3:
            score = 60
            feedback_parts.append(f'Only {bc} bullets found. Aim for 3–5 per role.')
        else:
            score = 80
            feedback_parts.append(f'{bc} bullet points found — good structure.')
        if wc < 100:
            score = max(score - 15, 30)
            feedback_parts.append('Experience section seems thin. Add more detail.')

    elif section_name == 'education':
        score = 80 if wc >= 15 else 55
        if wc < 15:
            feedback_parts.append('Education section is brief. Add degree, institution, and year.')

    elif section_name == 'skills':
        skill_count = len(re.findall(r'[,\n•\|]', section_data.get('char_count', '') or ''))
        if wc < 10:
            score = 45
            feedback_parts.append('Skills section has very few entries. Add 8–12 relevant skills.')
        elif wc < 25:
            score = 65
            feedback_parts.append('Consider adding more skills specific to your target roles.')
        else:
            score = 85
            feedback_parts.append('Good number of skills listed.')

    elif section_name == 'certifications':
        score = 80 if wc >= 5 else 55

    elif section_name == 'projects':
        score = 75 if bc >= 2 else 55
        if bc < 2:
            feedback_parts.append('Add bullet points to projects to describe your contributions.')

    elif section_name in ('achievements', 'languages'):
        score = 70 if wc >= 5 else 50

    feedback = ' '.join(feedback_parts) if feedback_parts else f'{section_name.title()} section detected.'
    return min(score, 100), feedback


# ---------------------------------------------------------------------------
# Keyword Matching
# ---------------------------------------------------------------------------

def match_keywords(text, job_role_keywords):
    """
    Match keywords from the job role dictionary against the resume text.
    Returns a list of dicts with match details.
    """
    text_lower = text.lower()
    results = []

    for jrk in job_role_keywords:
        kw = jrk.keyword.lower()
        # Use word-boundary search for single words, partial for phrases
        if ' ' in kw:
            pattern = re.escape(kw)
        else:
            pattern = r'\b' + re.escape(kw) + r'\b'

        matches = list(re.finditer(pattern, text_lower))
        is_present = len(matches) > 0
        frequency = len(matches)

        # Find which sections the keyword appears in
        found_sections = []
        char_positions = []

        for m in matches:
            char_positions.append([m.start(), m.end()])
            # Map position to section (rough heuristic)
            pos = m.start()
            # Context snippet (50 chars around match)

        context_snippet = ''
        if matches:
            m = matches[0]
            start = max(0, m.start() - 40)
            end = min(len(text), m.end() + 40)
            context_snippet = text[start:end].strip()

        results.append({
            'keyword': jrk.keyword,
            'keyword_type': jrk.keyword_type,
            'job_role_context': jrk.role_name,
            'importance_level': jrk.importance,
            'importance_score': float(jrk.weight) * 10,
            'is_present': is_present,
            'frequency': frequency,
            'found_in_sections': json.dumps(found_sections),
            'context_snippet': context_snippet,
            'char_positions': json.dumps(char_positions),
        })

    return results


# ---------------------------------------------------------------------------
# Action Verb Score
# ---------------------------------------------------------------------------

def score_action_verbs(text):
    """
    Score the use of strong action verbs in bullet points.
    Returns score 0–100 and list of weak phrases found.
    """
    # Find all bullets
    bullets = re.findall(r'^\s*[•\-\*\u2022]\s*(.+)', text, re.MULTILINE)
    if not bullets:
        # Try lines starting with a capital letter as potential bullets
        bullets = re.findall(r'^\s*([A-Z][^.!?]{10,80})', text, re.MULTILINE)

    if not bullets:
        return Decimal('30'), []

    strong_count = 0
    weak_found = []

    for bullet in bullets:
        first_word = bullet.strip().split()[0].lower().rstrip('.,') if bullet.strip() else ''
        if first_word in ACTION_VERBS:
            strong_count += 1
        for wp in WEAK_PHRASES:
            if re.search(wp, bullet, re.IGNORECASE):
                weak_found.append(bullet.strip()[:100])
                break

    ratio = strong_count / len(bullets) if bullets else 0
    score = min(100, int(ratio * 100))

    # Penalise weak phrases
    weak_penalty = min(len(weak_found) * 8, 30)
    score = max(0, score - weak_penalty)

    return Decimal(str(score)), weak_found


# ---------------------------------------------------------------------------
# Quantification Score
# ---------------------------------------------------------------------------

def score_quantification(text):
    """
    Score how well the resume uses numbers and metrics.
    Returns score 0–100.
    """
    bullets = re.findall(r'^\s*[•\-\*\u2022]\s*(.+)', text, re.MULTILINE)
    if not bullets:
        bullets = re.findall(r'^\s*([A-Z][^.!?]{10,80})', text, re.MULTILINE)

    if not bullets:
        return Decimal('25')

    quantified = 0
    for bullet in bullets:
        for pattern in QUANT_PATTERNS:
            if re.search(pattern, bullet, re.IGNORECASE):
                quantified += 1
                break

    ratio = quantified / len(bullets)
    score = min(100, int(ratio * 120))   # slight boost since even 80% is excellent
    return Decimal(str(score))


# ---------------------------------------------------------------------------
# Format Score
# ---------------------------------------------------------------------------

def score_format(text, file_type):
    """
    Score resume format and parseability.
    Returns score 0–100.
    """
    score = 100
    deductions = []

    # PDF/DOCX get a small bonus over TXT
    if file_type in ('pdf', 'docx'):
        pass  # good

    # Check length
    word_count = len(text.split())
    if word_count < 150:
        score -= 25
        deductions.append('Resume seems very short (under 150 words).')
    elif word_count > 1200:
        score -= 10
        deductions.append('Resume may be too long (over 1200 words).')

    # Check for email
    if not re.search(r'[\w.+-]+@[\w-]+\.[a-z]{2,}', text, re.IGNORECASE):
        score -= 15
        deductions.append('No email address detected.')

    # Check for phone
    if not re.search(r'\+?[\d\s\-().]{7,}', text):
        score -= 10
        deductions.append('No phone number detected.')

    return Decimal(str(max(0, score))), deductions


# ---------------------------------------------------------------------------
# Readability Score
# ---------------------------------------------------------------------------

def score_readability(text):
    """
    Basic readability score based on sentence length distribution.
    Returns score 0–100.
    """
    sentences = re.split(r'[.!?]+', text)
    sentences = [s.strip() for s in sentences if len(s.strip()) > 10]

    if not sentences:
        return Decimal('50')

    avg_words = sum(len(s.split()) for s in sentences) / len(sentences)

    # Ideal sentence length for resumes: 10–25 words
    if 10 <= avg_words <= 25:
        score = 90
    elif avg_words < 10:
        score = 65
    else:
        score = max(40, 90 - int((avg_words - 25) * 3))

    return Decimal(str(score))


# ---------------------------------------------------------------------------
# Composite ATS Score
# ---------------------------------------------------------------------------

SCORE_WEIGHTS = {
    'keyword': Decimal('0.35'),
    'section': Decimal('0.25'),
    'format': Decimal('0.15'),
    'action_verb': Decimal('0.10'),
    'quantification': Decimal('0.10'),
    'readability': Decimal('0.05'),
}

def compute_ats_score(keyword_score, section_score, format_score,
                      action_verb_score, quantification_score, readability_score):
    """Compute weighted composite ATS score."""
    total = (
        Decimal(str(keyword_score)) * SCORE_WEIGHTS['keyword']
        + Decimal(str(section_score)) * SCORE_WEIGHTS['section']
        + Decimal(str(format_score)) * SCORE_WEIGHTS['format']
        + Decimal(str(action_verb_score)) * SCORE_WEIGHTS['action_verb']
        + Decimal(str(quantification_score)) * SCORE_WEIGHTS['quantification']
        + Decimal(str(readability_score)) * SCORE_WEIGHTS['readability']
    )
    return round(total, 2)


# ---------------------------------------------------------------------------
# Insight Generator
# ---------------------------------------------------------------------------

def generate_insights(section_data, keyword_results, weak_phrases, format_deductions):
    """
    Build the list of strengths, weaknesses, and suggestions.
    Returns list of insight dicts.
    """
    insights = []

    # --- Section insights ---
    for section_name, data in section_data.items():
        if data['is_present']:
            score = data.get('strength_score', 0)
            if score >= 75:
                insights.append({
                    'insight_type': 'strength',
                    'category': 'section',
                    'title': f'{section_name.title()} section is strong',
                    'description': data.get('feedback', ''),
                    'suggestion': '',
                    'priority': 1,
                    'section_name': section_name,
                    'highlight_color': 'green',
                })
            elif score < 60:
                insights.append({
                    'insight_type': 'weakness',
                    'category': 'section',
                    'title': f'{section_name.title()} section needs improvement',
                    'description': data.get('feedback', ''),
                    'suggestion': f'Expand your {section_name} section with more specific details.',
                    'priority': 2,
                    'section_name': section_name,
                    'highlight_color': 'amber',
                })
        else:
            insights.append({
                'insight_type': 'weakness',
                'category': 'section',
                'title': f'Missing section: {section_name.title()}',
                'description': f'The {section_name.title()} section was not detected in your resume.',
                'suggestion': f'Add a clearly labelled "{section_name.title()}" section.',
                'priority': 3,
                'section_name': section_name,
                'highlight_color': 'red',
            })

    # --- Keyword insights ---
    missing_required = [k for k in keyword_results if not k['is_present'] and k['importance_level'] == 'required']
    present_keywords = [k for k in keyword_results if k['is_present']]

    if missing_required:
        missing_names = ', '.join(k['keyword'] for k in missing_required[:5])
        insights.append({
            'insight_type': 'weakness',
            'category': 'keyword',
            'title': f'{len(missing_required)} required keywords missing',
            'description': f'Missing required keywords: {missing_names}{"..." if len(missing_required) > 5 else ""}',
            'suggestion': 'Add these keywords naturally in your Skills and Experience sections.',
            'priority': 3,
            'section_name': 'skills',
            'highlight_color': 'red',
        })

    if len(present_keywords) >= 5:
        insights.append({
            'insight_type': 'strength',
            'category': 'keyword',
            'title': f'{len(present_keywords)} keywords matched',
            'description': f'Your resume contains {len(present_keywords)} relevant keywords for the selected role.',
            'suggestion': '',
            'priority': 1,
            'section_name': '',
            'highlight_color': 'green',
        })

    # --- Weak phrases ---
    for phrase in weak_phrases[:3]:
        insights.append({
            'insight_type': 'weakness',
            'category': 'action_verb',
            'title': 'Weak phrasing detected',
            'description': f'Passive phrase found: "{phrase[:80]}"',
            'suggestion': 'Replace with a strong action verb (e.g., "Led", "Built", "Increased").',
            'priority': 2,
            'section_name': 'experience',
            'highlight_color': 'amber',
        })

    # --- Format deductions ---
    for d in format_deductions:
        insights.append({
            'insight_type': 'weakness',
            'category': 'format',
            'title': 'Format issue detected',
            'description': d,
            'suggestion': 'Fix this formatting issue to improve ATS parseability.',
            'priority': 2,
            'section_name': 'contact',
            'highlight_color': 'amber',
        })

    return insights


# ---------------------------------------------------------------------------
# Main Entry Point
# ---------------------------------------------------------------------------

def run_analysis(analysis_job, file_obj):
    """
    Full pipeline: extract text → detect sections → match keywords → score → save.
    Updates the ResumeAnalysisJob instance in-place and saves all related records.
    """
    from .models import ResumeSectionResult, ResumeKeywordResult, ResumeInsight, JobRoleKeyword

    # 1. Extract text
    text = extract_text_from_file(file_obj, analysis_job.file_type)
    analysis_job.extracted_text = text
    analysis_job.status = 'processing'
    analysis_job.save(update_fields=['extracted_text', 'status'])

    if not text.strip():
        analysis_job.status = 'failed'
        analysis_job.error_message = 'Could not extract text from the uploaded file.'
        analysis_job.save(update_fields=['status', 'error_message'])
        return

    # 2. Detect sections
    section_data = detect_sections(text)

    # 3. Load keyword dictionary for selected roles
    roles = analysis_job.get_selected_job_roles()
    if roles:
        job_role_keywords = JobRoleKeyword.objects.filter(
            role_slug__in=[r.lower().replace(' ', '-') for r in roles],
            is_active=True,
        )
    else:
        # No role selected — use general keywords
        job_role_keywords = JobRoleKeyword.objects.filter(
            role_slug='general',
            is_active=True,
        )

    # 4. Match keywords
    keyword_results = match_keywords(text, job_role_keywords)

    # 5. Scoring
    # 5a. Keyword score
    if keyword_results:
        found = sum(1 for k in keyword_results if k['is_present'])
        expected = len(keyword_results)
        keyword_score = Decimal(str(round((found / expected) * 100, 2)))
    else:
        keyword_score = Decimal('50')

    # 5b. Section score
    present_count = sum(1 for v in section_data.values() if v['is_present'])
    section_score = Decimal(str(round((present_count / 9) * 100, 2)))

    # 5c. Format score
    format_score, format_deductions = score_format(text, analysis_job.file_type)

    # 5d. Action verb score
    action_verb_score, weak_phrases = score_action_verbs(text)

    # 5e. Quantification score
    quantification_score = score_quantification(text)

    # 5f. Readability score
    readability_score = score_readability(text)

    # 5g. Composite ATS score
    ats_score = compute_ats_score(
        keyword_score, section_score, format_score,
        action_verb_score, quantification_score, readability_score,
    )

    # 6. Score sections individually and persist
    for section_name, data in section_data.items():
        strength_score, feedback = score_section(section_name, data)
        data['strength_score'] = strength_score
        data['feedback'] = feedback

        ResumeSectionResult.objects.create(
            analysis=analysis_job,
            section_name=section_name,
            is_present=data['is_present'],
            strength_score=Decimal(str(strength_score)),
            word_count=data['word_count'],
            char_count=data['char_count'],
            bullet_count=data['bullet_count'],
            feedback=feedback,
            char_start=data['char_start'],
            char_end=data['char_end'],
        )

    # 7. Persist keyword results
    for kr in keyword_results:
        ResumeKeywordResult.objects.create(
            analysis=analysis_job,
            keyword=kr['keyword'],
            keyword_type=kr['keyword_type'],
            job_role_context=kr['job_role_context'],
            importance_level=kr['importance_level'],
            importance_score=Decimal(str(kr['importance_score'])),
            is_present=kr['is_present'],
            frequency=kr['frequency'],
            found_in_sections=kr['found_in_sections'],
            context_snippet=kr['context_snippet'],
            char_positions=kr['char_positions'],
        )

    # 8. Generate and persist insights
    insights = generate_insights(section_data, keyword_results, weak_phrases, format_deductions)
    for ins in insights:
        ResumeInsight.objects.create(
            analysis=analysis_job,
            insight_type=ins['insight_type'],
            category=ins['category'],
            title=ins['title'],
            description=ins['description'],
            suggestion=ins['suggestion'],
            priority=ins['priority'],
            section_name=ins['section_name'],
            highlight_color=ins['highlight_color'],
        )

    # 9. Update analysis job with final scores
    found_kw = sum(1 for k in keyword_results if k['is_present'])
    analysis_job.ats_score = ats_score
    analysis_job.keyword_score = keyword_score
    analysis_job.section_score = section_score
    analysis_job.format_score = format_score
    analysis_job.action_verb_score = action_verb_score
    analysis_job.quantification_score = quantification_score
    analysis_job.readability_score = readability_score
    analysis_job.total_keywords_found = found_kw
    analysis_job.total_keywords_expected = len(keyword_results)
    analysis_job.total_sections_present = present_count
    analysis_job.total_sections_expected = 9
    analysis_job.status = 'completed'
    analysis_job.completed_at = timezone.now()
    analysis_job.save()
