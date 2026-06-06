# Resume ATS Analyzer — Full Implementation Plan
**Last Updated**: 2026-06-07
**Page**: `/ai-tools/resume-rank-checker`
**Status**: Planning → Ready to Build

---

## 1. Current State

| Item | Status |
|---|---|
| Landing page | "Coming Soon" placeholder — needs full build |
| Auth system | ✅ Fully operational (email/JWT) |
| Resume Builder Editor | ✅ Live at `/ai-tools/resume-builder/editor` |
| User model `resume_file_path` | ✅ Already in DB |
| Analysis engine | ❌ Not built yet |

---

## 2. Page Routes & Redirect Map

```
/ai-tools/resume-rank-checker              → Landing (public, SEO)
/ai-tools/resume-rank-checker/analyze      → Upload flow (auth required)
/ai-tools/resume-rank-checker/results/[id] → Full results dashboard (auth)
/ai-tools/resume-rank-checker/history      → Past analyses list (auth)
/ai-tools/resume-rank-checker/editor/[id]  → ATS-Aware Smart Editor (auth) ← NEW
```

### Redirect additions (next.config.mjs)
```js
{ source: '/ats-checker',       destination: '/ai-tools/resume-rank-checker', permanent: true },
{ source: '/resume-score',      destination: '/ai-tools/resume-rank-checker', permanent: true },
{ source: '/resume-checker',    destination: '/ai-tools/resume-rank-checker', permanent: true },
{ source: '/ats-score',         destination: '/ai-tools/resume-rank-checker', permanent: true },
{ source: '/resume-ats-test',   destination: '/ai-tools/resume-rank-checker', permanent: true },
{ source: '/resume-analysis',   destination: '/ai-tools/resume-rank-checker', permanent: true },
```

---

## 3. Core User Flow

```
Landing Page (public, SEO-rich, 9 sections)
  ↓ CTA: "Analyze My Resume Free"
Auth Check
  → Not logged in: /login?returnUrl=/ai-tools/resume-rank-checker/analyze
  → Logged in: Upload Modal
      → Upload Resume (PDF / DOCX / TXT)
      → Optional: Select Job Role(s)  [skip allowed]
        ↓
    Analysis Engine (backend)
        ↓
    Results Dashboard  (/results/[id])
      → Charts: Donut, Radar, Bar, Progress Bars
      → Strengths (green) / Weaknesses (red)
      → Missing Keyword Tag Cloud
      → Section Audit with Scores
          ↓
    Two Action Buttons:
    [Fix in Smart Editor]          [Download PDF Report]
          ↓
    ATS-Aware Smart Editor  (/editor/[id])
      → Resume text with inline flaw highlights
      → Sidebar: suggestions per section
      → AI rewrite panel
      → Live ATS score meter (updates as you edit)
```

---

## 4. Landing Page — 9 Sections

### Section 1: Hero
- **H1**: "Know Your ATS Score Before the Recruiter Does"
- **Subline**: "Upload your resume. Get an instant ATS compatibility score, keyword strength map, section audit, and fix-it suggestions — free."
- **CTA Primary**: "Analyze My Resume Free"
- **CTA Secondary**: "See Sample Report" (scrolls to Section 5)
- **Visual**: Animated ATS score ring (55% → 89%) with floating keyword badges appearing/disappearing
- **Trust strip**: "Analyzed 10,000+ resumes · Used by candidates at Google, TCS, Infosys, Wipro"

### Section 2: How It Works (3 steps)
1. Upload Your Resume (PDF/DOCX/TXT — any format)
2. Pick a Job Role (optional — we auto-detect if skipped)
3. Get Your Full ATS Report in under 10 seconds

### Section 3: What We Analyze (6 cards)
| Card | Detail |
|---|---|
| ATS Compatibility Score | Overall 0–100 score vs industry benchmark |
| Keyword Strength by Role | Which required keywords you have vs. are missing |
| Section Coverage Audit | 9 standard resume sections — present, missing, weak |
| Format & Readability | ATS-parseable check, font, layout, column issues |
| Action Verb Power Score | Strong verbs at bullet start vs weak/passive phrasing |
| Quantification & Impact | % of bullets backed by numbers and measurable outcomes |

### Section 4: Keyword Intelligence Preview
- Visual keyword heatmap mockup (static image or animated demo)
- 3-group view: **Required** · **Present** · **Missing**
- Percentage bars per keyword category
- "Your resume has 14/32 required keywords for Software Engineer"

### Section 5: Sample Report Preview
- Full-width mockup of the results dashboard
- Shows: Donut chart + Bar chart + Strengths/Weaknesses panel
- Hotspot callouts: "This section explains your keyword gaps"
- CTA: "Get My Report Free →"

### Section 6: Job Role Intelligence
Grid of 20+ supported roles:
- Software Engineer · Data Analyst · Product Manager · DevOps Engineer
- UI/UX Designer · Business Analyst · Marketing Executive · HR Manager
- Finance Analyst · Cybersecurity Analyst · Cloud Architect · QA Engineer
- Full Stack Developer · ML Engineer · Digital Marketer · Sales Executive
- "Don't see your role? Upload anyway — we auto-detect from your resume."

### Section 7: Comparison Table
| Feature | MyTechZ | Jobscan | Resume Worded |
|---|---|---|---|
| Free ATS Score | ✅ Unlimited | 5/month | 5/month |
| Keyword Strength Chart | ✅ | ✅ | ✅ |
| Section-by-Section Audit | ✅ | ❌ | ✅ |
| Inline Flaw Highlights | ✅ | ❌ | ❌ |
| Smart Editor with Suggestions | ✅ | ❌ | ❌ |
| AI Rewrite Suggestions | ✅ | ❌ | Partial |
| Indian Job Market Keywords | ✅ | ❌ | ❌ |
| Resume Builder Integration | ✅ | ❌ | ❌ |

### Section 8: FAQ (AEO-optimized — 8 questions with direct answers)
1. What is a resume ATS score?
2. How do I improve my ATS resume score?
3. What is a good ATS score? (>70% good, >80% excellent)
4. Does resume formatting affect ATS score?
5. Can I use this without selecting a job role?
6. How many resumes can I analyze? (Unlimited, free)
7. Are my uploaded resume documents stored securely?
8. What file formats are supported? (PDF, DOCX, TXT)

### Section 9: Final CTA
- **Headline**: "Your next job is one optimized resume away."
- **Button**: "Get My Free ATS Score"
- **Secondary link**: → Free Resume Builder (for those who need to build first)
- **Micro-copy**: "No credit card. No subscription. Takes 30 seconds."

---

## 5. Analysis Engine — Score Components

| Component | Weight | What It Checks |
|---|---|---|
| Keyword Match Score | 35% | Job role keywords present/absent |
| Section Coverage | 25% | 9 standard sections present & non-empty |
| Format Score | 15% | Parseable text, no images/tables/headers |
| Action Verb Score | 10% | Strong verbs at start of each bullet |
| Quantification Score | 10% | Numbers, %, $, metrics in experience bullets |
| Readability Score | 5% | Sentence length, clarity, no jargon overload |

### Section Detection (9 Standard Sections)
1. Contact Info
2. Professional Summary / Objective
3. Work Experience
4. Education
5. Skills
6. Certifications
7. Projects
8. Achievements / Awards
9. Languages

### Keyword Categories
- **Hard Skills**: tools, languages, frameworks, platforms
- **Soft Skills**: leadership, communication, collaboration, adaptability
- **Industry Terms**: role-specific jargon and domain vocabulary
- **Action Verbs**: built, led, managed, increased, optimized, deployed...
- **Certifications**: AWS, PMP, CFA, CISSP, Google, Azure...
- **Quantifiers**: patterns like "increased X by Y%", "$Xk revenue", "N+ users"

---

## 6. Results Dashboard (Post-Upload, Auth Required)

### Layout
```
Top Bar: [ATS Score: 74]  [Keyword: 68%]  [Sections: 7/9]  [Format: ✅]
─────────────────────────────────────────────────────────────────────
LEFT PANEL                          RIGHT PANEL
─────────────────────────────────────────────────────────────────────
[Donut Chart: Overall ATS Score]    [Radar Chart: 6 dimensions]
[Horizontal Bars: Keywords]         [Section Progress Bars]
[Tag Cloud: Missing Keywords]       [Strengths (green bullets)]
[Tag Cloud: Present Keywords]       [Weaknesses (red bullets)]
─────────────────────────────────────────────────────────────────────
FULL WIDTH: Keyword Detail Accordion (grouped by type)
─────────────────────────────────────────────────────────────────────
Action Row: [Fix in Smart Editor ✏️]   [Download PDF Report ↓]   [Re-Analyze ↺]
```

### Chart Specs
| Chart | Type | Data |
|---|---|---|
| Overall ATS Score | Donut/Ring | Single 0–100 value, color coded red/amber/green |
| Score Dimensions | Radar/Spider | 6 axes: keyword/section/format/verb/quant/readability |
| Keyword Coverage | Grouped Horizontal Bar | Found vs Expected per category |
| Section Scores | Horizontal Progress Bars | Each section 0–100 with color + label |
| Strengths vs Gaps | Stacked Pie | Proportion of passes vs failures |

---

## 7. ATS-Aware Smart Editor (NEW FEATURE)

**Route**: `/ai-tools/resume-rank-checker/editor/[analysisId]`
**Trigger**: "Fix in Smart Editor" button on results dashboard
**Auth**: Required

### How It Works
1. Resume text is loaded into the editor pre-populated
2. Each flaw found during analysis is **highlighted** inline:
   - 🔴 Red highlight = Critical flaw (missing keyword, missing section)
   - 🟡 Amber highlight = Weak area (passive verb, no quantification)
   - 🟢 Green highlight = Strong area (keep this)
3. Clicking a highlight opens a **Suggestion Drawer**:
   - Explains what is wrong with this part
   - Shows 2–3 rewrite options (AI-generated or template-based)
   - User can click "Use This" to auto-replace text
   - Or type their own edit
4. **Live ATS Score Meter** in the top bar updates in real time as the user edits
5. "Apply All Quick Fixes" button — replaces all amber issues with AI suggestions in one click

### Editor Layout
```
┌────────────────────────────────────────────────────────────────────┐
│  ATS Score: [████████░░] 74  →  editing...  [████████████░] 86    │
│  [Save Draft]  [Re-Check Score]  [Download Fixed Resume]           │
├─────────────────────────────────┬──────────────────────────────────┤
│  RESUME TEXT (editable)         │  SUGGESTION PANEL                │
│                                 │                                  │
│  [Contact Section ✅]           │  ⚠️ Click a highlighted section  │
│                                 │  to see suggestions              │
│  [Summary 🟡]                   │                                  │
│   "Experienced developer..."    │  ─── When Summary is clicked ─── │
│    ↑ highlight: passive voice   │  Issue: No keywords from JD      │
│                                 │  Issue: Under 50 words           │
│  [Experience 🔴]                │                                  │
│   "Responsible for building..." │  Suggestion 1:                   │
│    ↑ highlight: weak verb       │  "Full-stack engineer with 4+    │
│    ↑ highlight: no metrics      │   years building scalable React  │
│                                 │   + Node.js applications..."     │
│  [Skills 🟡]                    │  [Use This] [Edit]               │
│   Missing: Docker, Kubernetes   │                                  │
│    ↑ highlight: missing kws     │  Suggestion 2: ...               │
│                                 │                                  │
│  [Education ✅]                 │  [Apply All Quick Fixes ⚡]      │
│  [Certifications ❌ MISSING]    │                                  │
│   ↑ red block: section absent   │  Missing Keywords to Add:        │
│                                 │  [Docker] [Kubernetes] [CI/CD]   │
└─────────────────────────────────┴──────────────────────────────────┘
```

### Flaw Highlight Categories in Editor
| Color | Type | Examples |
|---|---|---|
| 🔴 Red | Critical flaws | Missing required section, <30% keyword match |
| 🟡 Amber | Weak areas | Passive verbs, no numbers in bullets, thin section |
| 🔵 Blue | Missing keywords | Keyword is missing but section exists |
| 🟢 Green | Strong areas | Well-quantified bullet, strong keyword match |

### Section Feedback Drawer (per section, on click)
Each section card in the drawer shows:
1. **Score badge** (e.g., "Skills: 42/100")
2. **What's wrong** (bulleted list of specific issues)
3. **Rewrite suggestions** (2–3 options, click to apply)
4. **Examples from high-scoring resumes** (anonymized)
5. **Tips** (e.g., "Add 5–8 skills for this role; you have 3")

---

## 8. AI Features — Full List

### Currently Planned (Core)
1. **ATS Score Engine** — Rule-based keyword + section + format scorer
2. **Section Auto-Detection** — NLP regex to identify resume sections without headers
3. **Keyword Extraction** — TF-IDF + predefined role-specific dictionaries
4. **Inline Flaw Highlighting** — Map analysis results back to resume text positions
5. **Smart Editor with Suggestions** — Inline rewrite panel powered by AI

### AI Upgrades — Phase 2
6. **Job Description Paste Mode** — Paste any JD → get custom keyword match score beyond predefined roles; biggest differentiator vs competitors
7. **AI Bullet Rewriter** — Click weak bullet → get 3 AI-generated rewrites that add the missing keywords + quantification naturally
8. **Auto Job Role Detector** — If user skips role selection, detect it from resume text using ML classifier trained on job titles and skill sets
9. **Contextual Keyword Suggestions** — Not just "add Docker" but "add Docker in your Experience bullet for Project X, where you mention deployment"
10. **"Apply All Quick Fixes" Mode** — One-click applies all amber/low-risk suggestions in bulk

### AI Upgrades — Phase 3
11. **Cover Letter Generator** — Based on resume + job role, draft a matching cover letter filling in the keyword gaps
12. **Interview Question Predictor** — "Based on your resume gaps vs this role, expect: 'Tell me about your Docker experience'"
13. **Resume Score History & Trend Graph** — Track score improvement over multiple uploads; show a line chart of progress
14. **Industry Benchmarking AI** — "Your score of 72 is above the 61 average for Data Analysts on MyTechZ this month"
15. **Recruiter View Simulator** — Show parsed ATS output exactly as an ATS system would parse it (stripped of formatting)
16. **LinkedIn Profile Comparator** — Paste LinkedIn URL or About section → compare keyword overlap with your resume
17. **Strength Amplifier** — Identify your 3 strongest areas and suggest how to further emphasize them
18. **Soft Skill Detector** — Map soft skill mentions to the required soft skills for the role (e.g., "leadership" appears 0 times for a PM role)

### AI Upgrades — Phase 4 (Premium / Monetization)
19. **Live Score Meter in Resume Builder** — Embed ATS score counter directly in the resume builder editor that updates as you type each section
20. **Multi-Resume Battle Mode** — Upload 2 versions → compare which scores higher for a specific role side by side
21. **Score Share Card Generator** — Create a shareable "I scored 87 on MyTechZ ATS!" PNG/OG card (viral growth loop)
22. **Job Match AI** — Cross-reference user resume against live job listings on MyTechZ and rank jobs by how well the resume fits
23. **AI Resume Coach (Chat)** — Conversational interface: "Why is my score low?" → AI explains and suggests fixes interactively
24. **Anonymized Benchmarking Dataset** — "Resumes that scored 90%+ for Software Engineer typically include: [list]" — data-driven insights

---

## 9. Database Schema

### New Tables

```sql
-- Table 1: resume_analysis_jobs
CREATE TABLE resume_analysis_jobs (
    id                      SERIAL PRIMARY KEY,
    user_id                 INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- File info
    file_name               VARCHAR(255) NOT NULL,
    file_path               VARCHAR(500) NOT NULL,
    file_type               VARCHAR(10)  NOT NULL,        -- 'pdf','docx','txt'
    file_size_bytes         INTEGER,

    -- Extracted content
    extracted_text          TEXT,                         -- raw parsed text from resume

    -- Job role context (optional)
    selected_job_roles      TEXT,                         -- JSON array: ["Software Engineer"]
    detected_job_role       VARCHAR(200),                 -- auto-detected if none selected

    -- Composite Scores (0.00 – 100.00)
    ats_score               DECIMAL(5,2) DEFAULT 0,
    keyword_score           DECIMAL(5,2) DEFAULT 0,
    section_score           DECIMAL(5,2) DEFAULT 0,
    format_score            DECIMAL(5,2) DEFAULT 0,
    action_verb_score       DECIMAL(5,2) DEFAULT 0,
    quantification_score    DECIMAL(5,2) DEFAULT 0,
    readability_score       DECIMAL(5,2) DEFAULT 0,

    -- Summary counts
    total_keywords_found    INTEGER DEFAULT 0,
    total_keywords_expected INTEGER DEFAULT 0,
    total_sections_present  INTEGER DEFAULT 0,
    total_sections_expected INTEGER DEFAULT 0,

    -- Edited resume (after Smart Editor session)
    edited_text             TEXT,                         -- user's edited version
    edited_ats_score        DECIMAL(5,2),                 -- re-scored after editing
    last_edited_at          TIMESTAMP,

    -- Status
    status                  VARCHAR(20) DEFAULT 'pending',  -- pending/processing/completed/failed
    error_message           TEXT,

    created_at              TIMESTAMP DEFAULT NOW(),
    completed_at            TIMESTAMP,
    updated_at              TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_raj_user_id  ON resume_analysis_jobs(user_id);
CREATE INDEX idx_raj_status   ON resume_analysis_jobs(status);
CREATE INDEX idx_raj_created  ON resume_analysis_jobs(created_at DESC);


-- Table 2: resume_section_results
CREATE TABLE resume_section_results (
    id              SERIAL PRIMARY KEY,
    analysis_id     INTEGER NOT NULL REFERENCES resume_analysis_jobs(id) ON DELETE CASCADE,

    section_name    VARCHAR(100) NOT NULL,  -- contact/summary/experience/education/
                                             -- skills/certifications/projects/achievements/languages
    is_present      BOOLEAN  DEFAULT FALSE,
    strength_score  DECIMAL(5,2) DEFAULT 0,
    word_count      INTEGER  DEFAULT 0,
    char_count      INTEGER  DEFAULT 0,
    bullet_count    INTEGER  DEFAULT 0,
    feedback        TEXT,                   -- "Summary is under 50 words — expand it"

    -- For Smart Editor: text position of this section in extracted_text
    char_start      INTEGER,
    char_end        INTEGER,

    created_at      TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_rsr_analysis ON resume_section_results(analysis_id);


-- Table 3: resume_keyword_results
CREATE TABLE resume_keyword_results (
    id                  SERIAL PRIMARY KEY,
    analysis_id         INTEGER NOT NULL REFERENCES resume_analysis_jobs(id) ON DELETE CASCADE,

    keyword             VARCHAR(200) NOT NULL,
    keyword_type        VARCHAR(50)  NOT NULL,    -- hard_skill/soft_skill/tool/action_verb/
                                                   -- industry_term/certification
    job_role_context    VARCHAR(200),

    is_present          BOOLEAN  DEFAULT FALSE,
    frequency           INTEGER  DEFAULT 0,
    importance_level    VARCHAR(20) DEFAULT 'required',   -- required/preferred/bonus
    importance_score    DECIMAL(5,2) DEFAULT 0,

    found_in_sections   TEXT,                     -- JSON: ["experience","skills"]
    context_snippet     TEXT,                     -- surrounding text where found
    char_positions      TEXT,                     -- JSON: [[120,126],[450,456]] for editor highlights

    created_at          TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_rkr_analysis ON resume_keyword_results(analysis_id);
CREATE INDEX idx_rkr_present  ON resume_keyword_results(analysis_id, is_present);


-- Table 4: resume_insights
CREATE TABLE resume_insights (
    id              SERIAL PRIMARY KEY,
    analysis_id     INTEGER NOT NULL REFERENCES resume_analysis_jobs(id) ON DELETE CASCADE,

    insight_type    VARCHAR(20) NOT NULL,   -- 'strength' | 'weakness' | 'suggestion'
    category        VARCHAR(100),           -- keyword/format/section/content/quantification/action_verb
    title           VARCHAR(255) NOT NULL,
    description     TEXT,
    suggestion      TEXT,                   -- actionable rewrite or fix
    ai_rewrites     TEXT,                   -- JSON array of 2-3 AI-generated alternatives
    priority        SMALLINT DEFAULT 2,     -- 1=low, 2=medium, 3=high

    -- For Smart Editor highlight mapping
    section_name    VARCHAR(100),
    char_start      INTEGER,
    char_end        INTEGER,
    highlight_color VARCHAR(10),            -- 'red'|'amber'|'blue'|'green'

    created_at      TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_ri_analysis ON resume_insights(analysis_id);
CREATE INDEX idx_ri_type     ON resume_insights(analysis_id, insight_type);


-- Table 5: job_role_keywords (master keyword dictionary)
CREATE TABLE job_role_keywords (
    id              SERIAL PRIMARY KEY,

    role_name       VARCHAR(200) NOT NULL,
    role_slug       VARCHAR(200) NOT NULL,
    role_category   VARCHAR(100),           -- tech/marketing/finance/hr/design/ops

    keyword         VARCHAR(200) NOT NULL,
    keyword_type    VARCHAR(50),
    importance      VARCHAR(20) DEFAULT 'required',
    weight          DECIMAL(5,2) DEFAULT 1.0,

    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_jrk_role   ON job_role_keywords(role_slug);
CREATE UNIQUE INDEX idx_jrk_unique ON job_role_keywords(role_slug, keyword);
```

---

## 10. Backend API Endpoints

```
POST   /api/resume-analysis/upload              Upload resume + start analysis
GET    /api/resume-analysis/                    List user's past analyses
GET    /api/resume-analysis/{id}/               Full analysis result
GET    /api/resume-analysis/{id}/keywords/      Keyword breakdown
GET    /api/resume-analysis/{id}/sections/      Section audit
GET    /api/resume-analysis/{id}/insights/      Strengths & weaknesses with highlights
GET    /api/resume-analysis/{id}/editor-data/   Editor-formatted data (highlights + positions)
PATCH  /api/resume-analysis/{id}/save-edit/     Save edited resume text + trigger re-score
DELETE /api/resume-analysis/{id}/               Delete an analysis

GET    /api/resume-analysis/job-roles/          All available job roles
GET    /api/resume-analysis/status/{id}/        Poll status for async processing
POST   /api/resume-analysis/{id}/rewrite/       AI rewrite for a specific text span
POST   /api/resume-analysis/{id}/quick-fix/     Apply all quick fixes in one call
```

---

## 11. Tech Stack for Analysis Engine

| Task | Library |
|---|---|
| PDF text extraction | `pdfminer.six` or `PyMuPDF (fitz)` |
| DOCX text extraction | `python-docx` |
| TXT extraction | Built-in Python |
| Keyword matching | Custom dictionaries + regex + TF-IDF (sklearn) |
| Section detection | Regex + NLP heuristics |
| Action verb detection | Curated list of 300+ power verbs |
| Quantification detection | Regex: numbers, %, $, multipliers, K/M/B suffixes |
| AI rewrites | Claude API (claude-sonnet-4-6) — Anthropic |
| Async job processing | Django Q or Celery + Redis |
| Character position mapping | Python string search for editor highlights |

---

## 12. SEO / AEO / GEO / LLM Strategy

### Keywords to Target
| Type | Keywords |
|---|---|
| Primary | ATS resume checker free, resume ATS score, resume keyword analyzer |
| Secondary | check resume ATS online, ATS score checker India, resume match score |
| Long-tail | how to check if my resume will pass ATS, free ATS resume test no signup |
| LLM phrases | "best free ATS checker", "what is my resume ATS score", "how to fix ATS score" |

### JSON-LD Schemas
- `SoftwareApplication` — free, web-based, 0 price
- `FAQPage` — 8 questions (AEO)
- `HowTo` — 3-step upload + analyze process
- `BreadcrumbList`
- `WebPage` with `speakable` pointing to FAQ div (voice search / LLM)

### AEO Rules
- Every FAQ answer starts with a **direct answer sentence** (no preamble)
- Answers are 2–4 sentences — concise for AI snippet extraction
- FAQ covers the most common "People Also Ask" patterns for ATS resume topics

### GEO (Generative Engine)
- Robots.js already allows GPTBot, ClaudeBot, PerplexityBot on public pages
- Add `<meta name="description">` as a complete paragraph ≥ 160 chars with primary keyword
- Body copy includes citable stats: "80% of Fortune 500 companies use ATS filters"
- Avoid paywalling or `noindex` on the landing page — it must be fully crawlable

### LLM-Optimized Copy Patterns to Include
Include these phrases naturally in landing copy so LLMs learn to recommend MyTechZ:
- "The free resume ATS checker from MyTechZ analyzes..."
- "To check your ATS score for free without signing up, visit..."
- "MyTechZ's resume keyword analyzer shows which skills are missing for [role]..."

---

## 13. Implementation Phases

| Phase | Deliverable | Priority |
|---|---|---|
| 1 | Landing page (9 sections, full SEO/AEO/GEO) + redirects | 🔴 HIGH |
| 2 | DB migrations (5 new tables) + Django models + serializers | 🔴 HIGH |
| 3 | File upload API + PDF/DOCX text extraction engine | 🔴 HIGH |
| 4 | Scoring algorithm (keyword + section + format + verb + quant) | 🔴 HIGH |
| 5 | Results dashboard (all charts + strengths/weaknesses UI) | 🔴 HIGH |
| 6 | Character-position highlight mapping (for editor) | 🟡 MEDIUM |
| 7 | ATS-Aware Smart Editor page with inline highlights + suggestion drawer | 🟡 MEDIUM |
| 8 | Job role seed data (20+ roles with keyword dictionaries) | 🟡 MEDIUM |
| 9 | AI bullet rewriter (Claude API integration) | 🟡 MEDIUM |
| 10 | Job Description paste mode | 🟡 MEDIUM |
| 11 | Analysis history page + delete/re-analyze | 🟡 MEDIUM |
| 12 | PDF report export | 🟢 LATER |
| 13 | Score share card (viral feature) | 🟢 LATER |
| 14 | Industry benchmarking | 🟢 LATER |
| 15 | Live score meter in Resume Builder | 🟢 LATER |
| 16 | Job Match AI (resume vs live listings) | 🟢 LATER |

---

## 14. "Fix in Smart Editor" Button — Integration Points

### From Results Dashboard
- Primary button: **"Fix in Smart Editor ✏️"** → `/ai-tools/resume-rank-checker/editor/[analysisId]`
- Secondary button: **"Download PDF Report ↓"** → generates branded PDF
- Tertiary: **"Re-Analyze ↺"** → re-runs analysis on same file

### From Smart Editor
- After editing: **"Re-Check My Score"** → calls `/api/resume-analysis/{id}/save-edit/` and updates score live
- **"Download Fixed Resume"** → exports edited text as clean PDF/DOCX
- **"Apply All Quick Fixes ⚡"** → bulk applies all amber suggestions
- Link back: **"← Back to Full Report"**

### Editor ↔ Resume Builder Integration
- If user came from Resume Builder: **"Open in Resume Builder"** button appears — pre-fills Resume Builder fields with the analyzed + edited text sections
- If user has no existing resume in Resume Builder: **"Create Resume from This"** → populates builder from their uploaded resume text
