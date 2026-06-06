import json
from django.db import models
from django.conf import settings


class ResumeAnalysisJob(models.Model):
    """
    Main record for each resume analysis run.
    One user can have many analysis jobs (history).
    """

    STATUS_PENDING = 'pending'
    STATUS_PROCESSING = 'processing'
    STATUS_COMPLETED = 'completed'
    STATUS_FAILED = 'failed'

    STATUS_CHOICES = [
        (STATUS_PENDING, 'Pending'),
        (STATUS_PROCESSING, 'Processing'),
        (STATUS_COMPLETED, 'Completed'),
        (STATUS_FAILED, 'Failed'),
    ]

    FILE_TYPE_CHOICES = [
        ('pdf', 'PDF'),
        ('docx', 'DOCX'),
        ('doc', 'DOC'),
        ('txt', 'TXT'),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='resume_analyses',
    )

    # --- File info ---
    file_name = models.CharField(max_length=255)
    file_path = models.FileField(upload_to='resume_analyses/%Y/%m/', max_length=500)
    file_type = models.CharField(max_length=10, choices=FILE_TYPE_CHOICES)
    file_size_bytes = models.PositiveIntegerField(null=True, blank=True)

    # --- Extracted raw content ---
    extracted_text = models.TextField(blank=True, default='')

    # --- Job role context (optional) ---
    # Stored as JSON array string: '["Software Engineer", "Data Analyst"]'
    selected_job_roles = models.TextField(blank=True, default='[]')
    detected_job_role = models.CharField(max_length=200, blank=True, default='')

    # --- Composite scores (0.00 – 100.00) ---
    ats_score = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    keyword_score = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    section_score = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    format_score = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    action_verb_score = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    quantification_score = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    readability_score = models.DecimalField(max_digits=5, decimal_places=2, default=0)

    # --- Summary counts ---
    total_keywords_found = models.PositiveIntegerField(default=0)
    total_keywords_expected = models.PositiveIntegerField(default=0)
    total_sections_present = models.PositiveSmallIntegerField(default=0)
    total_sections_expected = models.PositiveSmallIntegerField(default=9)

    # --- Smart Editor: edited version ---
    edited_text = models.TextField(blank=True, null=True)
    edited_ats_score = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    last_edited_at = models.DateTimeField(null=True, blank=True)

    # --- Status ---
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_PENDING)
    error_message = models.TextField(blank=True, default='')

    created_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'resume_analysis_jobs'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', '-created_at']),
            models.Index(fields=['status']),
        ]

    def __str__(self):
        return f"Analysis #{self.pk} — {self.user.email} — {self.ats_score}%"

    def get_selected_job_roles(self):
        try:
            return json.loads(self.selected_job_roles) if self.selected_job_roles else []
        except (json.JSONDecodeError, TypeError):
            return []

    def set_selected_job_roles(self, roles_list):
        self.selected_job_roles = json.dumps(roles_list)

    @property
    def keyword_coverage_pct(self):
        if self.total_keywords_expected == 0:
            return 0
        return round((self.total_keywords_found / self.total_keywords_expected) * 100, 1)

    @property
    def section_coverage_pct(self):
        if self.total_sections_expected == 0:
            return 0
        return round((self.total_sections_present / self.total_sections_expected) * 100, 1)


class ResumeSectionResult(models.Model):
    """
    Per-section audit result for a resume analysis job.
    9 standard sections are evaluated per analysis.
    """

    SECTION_CHOICES = [
        ('contact', 'Contact Info'),
        ('summary', 'Professional Summary'),
        ('experience', 'Work Experience'),
        ('education', 'Education'),
        ('skills', 'Skills'),
        ('certifications', 'Certifications'),
        ('projects', 'Projects'),
        ('achievements', 'Achievements / Awards'),
        ('languages', 'Languages'),
    ]

    analysis = models.ForeignKey(
        ResumeAnalysisJob,
        on_delete=models.CASCADE,
        related_name='sections',
    )

    section_name = models.CharField(max_length=100, choices=SECTION_CHOICES)
    is_present = models.BooleanField(default=False)
    strength_score = models.DecimalField(max_digits=5, decimal_places=2, default=0)

    word_count = models.PositiveIntegerField(default=0)
    char_count = models.PositiveIntegerField(default=0)
    bullet_count = models.PositiveSmallIntegerField(default=0)

    # Human-readable feedback per section
    feedback = models.TextField(blank=True, default='')

    # Character offsets in extracted_text — used by Smart Editor for highlighting
    char_start = models.PositiveIntegerField(null=True, blank=True)
    char_end = models.PositiveIntegerField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'resume_section_results'
        unique_together = [('analysis', 'section_name')]
        ordering = ['section_name']

    def __str__(self):
        status = '✅' if self.is_present else '❌'
        return f"{status} {self.section_name} — {self.strength_score}%"


class ResumeKeywordResult(models.Model):
    """
    Keyword-level result for a resume analysis job.
    Tracks presence, frequency, and editor highlight positions.
    """

    TYPE_HARD_SKILL = 'hard_skill'
    TYPE_SOFT_SKILL = 'soft_skill'
    TYPE_TOOL = 'tool'
    TYPE_ACTION_VERB = 'action_verb'
    TYPE_INDUSTRY_TERM = 'industry_term'
    TYPE_CERTIFICATION = 'certification'

    KEYWORD_TYPE_CHOICES = [
        (TYPE_HARD_SKILL, 'Hard Skill'),
        (TYPE_SOFT_SKILL, 'Soft Skill'),
        (TYPE_TOOL, 'Tool / Technology'),
        (TYPE_ACTION_VERB, 'Action Verb'),
        (TYPE_INDUSTRY_TERM, 'Industry Term'),
        (TYPE_CERTIFICATION, 'Certification'),
    ]

    IMPORTANCE_REQUIRED = 'required'
    IMPORTANCE_PREFERRED = 'preferred'
    IMPORTANCE_BONUS = 'bonus'

    IMPORTANCE_CHOICES = [
        (IMPORTANCE_REQUIRED, 'Required'),
        (IMPORTANCE_PREFERRED, 'Preferred'),
        (IMPORTANCE_BONUS, 'Bonus'),
    ]

    analysis = models.ForeignKey(
        ResumeAnalysisJob,
        on_delete=models.CASCADE,
        related_name='keywords',
    )

    keyword = models.CharField(max_length=200)
    keyword_type = models.CharField(max_length=50, choices=KEYWORD_TYPE_CHOICES)
    job_role_context = models.CharField(max_length=200, blank=True, default='')

    is_present = models.BooleanField(default=False)
    frequency = models.PositiveSmallIntegerField(default=0)

    importance_level = models.CharField(max_length=20, choices=IMPORTANCE_CHOICES, default=IMPORTANCE_REQUIRED)
    importance_score = models.DecimalField(max_digits=5, decimal_places=2, default=0)

    # JSON: ["experience", "skills"]
    found_in_sections = models.TextField(blank=True, default='[]')

    # Short text around the keyword in the resume
    context_snippet = models.TextField(blank=True, default='')

    # JSON: [[start, end], [start, end]] — character positions for editor highlights
    char_positions = models.TextField(blank=True, default='[]')

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'resume_keyword_results'
        ordering = ['-importance_score', 'keyword']
        indexes = [
            models.Index(fields=['analysis', 'is_present']),
            models.Index(fields=['analysis', 'keyword_type']),
        ]

    def __str__(self):
        status = 'Found' if self.is_present else 'Missing'
        return f"[{status}] {self.keyword} ({self.keyword_type})"

    def get_found_in_sections(self):
        try:
            return json.loads(self.found_in_sections)
        except (json.JSONDecodeError, TypeError):
            return []

    def get_char_positions(self):
        try:
            return json.loads(self.char_positions)
        except (json.JSONDecodeError, TypeError):
            return []


class ResumeInsight(models.Model):
    """
    Strengths, weaknesses, and suggestions derived from a resume analysis.
    Each insight maps to a highlight in the Smart Editor.
    """

    TYPE_STRENGTH = 'strength'
    TYPE_WEAKNESS = 'weakness'
    TYPE_SUGGESTION = 'suggestion'

    INSIGHT_TYPE_CHOICES = [
        (TYPE_STRENGTH, 'Strength'),
        (TYPE_WEAKNESS, 'Weakness'),
        (TYPE_SUGGESTION, 'Suggestion'),
    ]

    CATEGORY_CHOICES = [
        ('keyword', 'Keyword'),
        ('format', 'Format'),
        ('section', 'Section'),
        ('content', 'Content'),
        ('quantification', 'Quantification'),
        ('action_verb', 'Action Verb'),
        ('length', 'Length'),
        ('readability', 'Readability'),
    ]

    HIGHLIGHT_CHOICES = [
        ('red', 'Red — Critical'),
        ('amber', 'Amber — Weak'),
        ('blue', 'Blue — Missing Keyword'),
        ('green', 'Green — Strong'),
    ]

    PRIORITY_LOW = 1
    PRIORITY_MEDIUM = 2
    PRIORITY_HIGH = 3

    analysis = models.ForeignKey(
        ResumeAnalysisJob,
        on_delete=models.CASCADE,
        related_name='insights',
    )

    insight_type = models.CharField(max_length=20, choices=INSIGHT_TYPE_CHOICES)
    category = models.CharField(max_length=100, choices=CATEGORY_CHOICES, blank=True, default='')

    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, default='')
    suggestion = models.TextField(blank=True, default='')

    # JSON array of 2–3 AI-generated rewrite alternatives
    ai_rewrites = models.TextField(blank=True, default='[]')

    priority = models.SmallIntegerField(default=PRIORITY_MEDIUM)

    # Smart Editor highlight mapping
    section_name = models.CharField(max_length=100, blank=True, default='')
    char_start = models.PositiveIntegerField(null=True, blank=True)
    char_end = models.PositiveIntegerField(null=True, blank=True)
    highlight_color = models.CharField(max_length=10, choices=HIGHLIGHT_CHOICES, blank=True, default='')

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'resume_insights'
        ordering = ['-priority', 'insight_type']
        indexes = [
            models.Index(fields=['analysis', 'insight_type']),
            models.Index(fields=['analysis', '-priority']),
        ]

    def __str__(self):
        return f"[{self.insight_type.upper()}] {self.title}"

    def get_ai_rewrites(self):
        try:
            return json.loads(self.ai_rewrites)
        except (json.JSONDecodeError, TypeError):
            return []


class JobRoleKeyword(models.Model):
    """
    Master keyword dictionary seeded per job role.
    Used by the analysis engine to check keyword presence.
    """

    CATEGORY_CHOICES = [
        ('tech', 'Technology'),
        ('marketing', 'Marketing'),
        ('finance', 'Finance'),
        ('hr', 'Human Resources'),
        ('design', 'Design'),
        ('ops', 'Operations'),
        ('sales', 'Sales'),
        ('data', 'Data & Analytics'),
        ('product', 'Product Management'),
        ('general', 'General'),
    ]

    KEYWORD_TYPE_CHOICES = [
        ('hard_skill', 'Hard Skill'),
        ('soft_skill', 'Soft Skill'),
        ('tool', 'Tool / Technology'),
        ('action_verb', 'Action Verb'),
        ('industry_term', 'Industry Term'),
        ('certification', 'Certification'),
    ]

    IMPORTANCE_CHOICES = [
        ('required', 'Required'),
        ('preferred', 'Preferred'),
        ('bonus', 'Bonus'),
    ]

    role_name = models.CharField(max_length=200)
    role_slug = models.CharField(max_length=200, db_index=True)
    role_category = models.CharField(max_length=100, choices=CATEGORY_CHOICES, default='general')

    keyword = models.CharField(max_length=200)
    keyword_type = models.CharField(max_length=50, choices=KEYWORD_TYPE_CHOICES, default='hard_skill')
    importance = models.CharField(max_length=20, choices=IMPORTANCE_CHOICES, default='required')
    weight = models.DecimalField(max_digits=5, decimal_places=2, default=1.0)

    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'job_role_keywords'
        unique_together = [('role_slug', 'keyword')]
        ordering = ['role_name', '-weight', 'keyword']
        indexes = [
            models.Index(fields=['role_slug', 'is_active']),
        ]

    def __str__(self):
        return f"[{self.role_slug}] {self.keyword} ({self.importance})"
