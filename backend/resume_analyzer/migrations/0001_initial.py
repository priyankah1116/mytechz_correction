from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        # ------------------------------------------------------------------ #
        # Table 1: resume_analysis_jobs                                       #
        # ------------------------------------------------------------------ #
        migrations.CreateModel(
            name='ResumeAnalysisJob',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('user', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE,
                    related_name='resume_analyses',
                    to=settings.AUTH_USER_MODEL,
                )),
                # File info
                ('file_name', models.CharField(max_length=255)),
                ('file_path', models.FileField(max_length=500, upload_to='resume_analyses/%Y/%m/')),
                ('file_type', models.CharField(
                    choices=[('pdf', 'PDF'), ('docx', 'DOCX'), ('doc', 'DOC'), ('txt', 'TXT')],
                    max_length=10,
                )),
                ('file_size_bytes', models.PositiveIntegerField(blank=True, null=True)),
                # Extracted content
                ('extracted_text', models.TextField(blank=True, default='')),
                # Job role context
                ('selected_job_roles', models.TextField(blank=True, default='[]')),
                ('detected_job_role', models.CharField(blank=True, default='', max_length=200)),
                # Composite scores
                ('ats_score', models.DecimalField(decimal_places=2, default=0, max_digits=5)),
                ('keyword_score', models.DecimalField(decimal_places=2, default=0, max_digits=5)),
                ('section_score', models.DecimalField(decimal_places=2, default=0, max_digits=5)),
                ('format_score', models.DecimalField(decimal_places=2, default=0, max_digits=5)),
                ('action_verb_score', models.DecimalField(decimal_places=2, default=0, max_digits=5)),
                ('quantification_score', models.DecimalField(decimal_places=2, default=0, max_digits=5)),
                ('readability_score', models.DecimalField(decimal_places=2, default=0, max_digits=5)),
                # Summary counts
                ('total_keywords_found', models.PositiveIntegerField(default=0)),
                ('total_keywords_expected', models.PositiveIntegerField(default=0)),
                ('total_sections_present', models.PositiveSmallIntegerField(default=0)),
                ('total_sections_expected', models.PositiveSmallIntegerField(default=9)),
                # Smart Editor
                ('edited_text', models.TextField(blank=True, null=True)),
                ('edited_ats_score', models.DecimalField(blank=True, decimal_places=2, max_digits=5, null=True)),
                ('last_edited_at', models.DateTimeField(blank=True, null=True)),
                # Status
                ('status', models.CharField(
                    choices=[
                        ('pending', 'Pending'),
                        ('processing', 'Processing'),
                        ('completed', 'Completed'),
                        ('failed', 'Failed'),
                    ],
                    default='pending',
                    max_length=20,
                )),
                ('error_message', models.TextField(blank=True, default='')),
                # Timestamps
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('completed_at', models.DateTimeField(blank=True, null=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'db_table': 'resume_analysis_jobs',
                'ordering': ['-created_at'],
            },
        ),
        migrations.AddIndex(
            model_name='ResumeAnalysisJob',
            index=models.Index(fields=['user', '-created_at'], name='raj_user_created_idx'),
        ),
        migrations.AddIndex(
            model_name='ResumeAnalysisJob',
            index=models.Index(fields=['status'], name='raj_status_idx'),
        ),

        # ------------------------------------------------------------------ #
        # Table 2: resume_section_results                                     #
        # ------------------------------------------------------------------ #
        migrations.CreateModel(
            name='ResumeSectionResult',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('analysis', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE,
                    related_name='sections',
                    to='resume_analyzer.resumeanalysisjob',
                )),
                ('section_name', models.CharField(
                    choices=[
                        ('contact', 'Contact Info'),
                        ('summary', 'Professional Summary'),
                        ('experience', 'Work Experience'),
                        ('education', 'Education'),
                        ('skills', 'Skills'),
                        ('certifications', 'Certifications'),
                        ('projects', 'Projects'),
                        ('achievements', 'Achievements / Awards'),
                        ('languages', 'Languages'),
                    ],
                    max_length=100,
                )),
                ('is_present', models.BooleanField(default=False)),
                ('strength_score', models.DecimalField(decimal_places=2, default=0, max_digits=5)),
                ('word_count', models.PositiveIntegerField(default=0)),
                ('char_count', models.PositiveIntegerField(default=0)),
                ('bullet_count', models.PositiveSmallIntegerField(default=0)),
                ('feedback', models.TextField(blank=True, default='')),
                ('char_start', models.PositiveIntegerField(blank=True, null=True)),
                ('char_end', models.PositiveIntegerField(blank=True, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
            options={
                'db_table': 'resume_section_results',
                'ordering': ['section_name'],
            },
        ),
        migrations.AddConstraint(
            model_name='resumesectionresult',
            constraint=models.UniqueConstraint(
                fields=['analysis', 'section_name'],
                name='unique_analysis_section',
            ),
        ),
        migrations.AddIndex(
            model_name='ResumeSectionResult',
            index=models.Index(fields=['analysis'], name='rsr_analysis_idx'),
        ),

        # ------------------------------------------------------------------ #
        # Table 3: resume_keyword_results                                     #
        # ------------------------------------------------------------------ #
        migrations.CreateModel(
            name='ResumeKeywordResult',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('analysis', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE,
                    related_name='keywords',
                    to='resume_analyzer.resumeanalysisjob',
                )),
                ('keyword', models.CharField(max_length=200)),
                ('keyword_type', models.CharField(
                    choices=[
                        ('hard_skill', 'Hard Skill'),
                        ('soft_skill', 'Soft Skill'),
                        ('tool', 'Tool / Technology'),
                        ('action_verb', 'Action Verb'),
                        ('industry_term', 'Industry Term'),
                        ('certification', 'Certification'),
                    ],
                    max_length=50,
                )),
                ('job_role_context', models.CharField(blank=True, default='', max_length=200)),
                ('is_present', models.BooleanField(default=False)),
                ('frequency', models.PositiveSmallIntegerField(default=0)),
                ('importance_level', models.CharField(
                    choices=[
                        ('required', 'Required'),
                        ('preferred', 'Preferred'),
                        ('bonus', 'Bonus'),
                    ],
                    default='required',
                    max_length=20,
                )),
                ('importance_score', models.DecimalField(decimal_places=2, default=0, max_digits=5)),
                ('found_in_sections', models.TextField(blank=True, default='[]')),
                ('context_snippet', models.TextField(blank=True, default='')),
                ('char_positions', models.TextField(blank=True, default='[]')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
            options={
                'db_table': 'resume_keyword_results',
                'ordering': ['-importance_score', 'keyword'],
            },
        ),
        migrations.AddIndex(
            model_name='ResumeKeywordResult',
            index=models.Index(fields=['analysis', 'is_present'], name='rkr_analysis_present_idx'),
        ),
        migrations.AddIndex(
            model_name='ResumeKeywordResult',
            index=models.Index(fields=['analysis', 'keyword_type'], name='rkr_analysis_type_idx'),
        ),

        # ------------------------------------------------------------------ #
        # Table 4: resume_insights                                            #
        # ------------------------------------------------------------------ #
        migrations.CreateModel(
            name='ResumeInsight',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('analysis', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE,
                    related_name='insights',
                    to='resume_analyzer.resumeanalysisjob',
                )),
                ('insight_type', models.CharField(
                    choices=[
                        ('strength', 'Strength'),
                        ('weakness', 'Weakness'),
                        ('suggestion', 'Suggestion'),
                    ],
                    max_length=20,
                )),
                ('category', models.CharField(
                    blank=True,
                    choices=[
                        ('keyword', 'Keyword'),
                        ('format', 'Format'),
                        ('section', 'Section'),
                        ('content', 'Content'),
                        ('quantification', 'Quantification'),
                        ('action_verb', 'Action Verb'),
                        ('length', 'Length'),
                        ('readability', 'Readability'),
                    ],
                    default='',
                    max_length=100,
                )),
                ('title', models.CharField(max_length=255)),
                ('description', models.TextField(blank=True, default='')),
                ('suggestion', models.TextField(blank=True, default='')),
                ('ai_rewrites', models.TextField(blank=True, default='[]')),
                ('priority', models.SmallIntegerField(default=2)),
                ('section_name', models.CharField(blank=True, default='', max_length=100)),
                ('char_start', models.PositiveIntegerField(blank=True, null=True)),
                ('char_end', models.PositiveIntegerField(blank=True, null=True)),
                ('highlight_color', models.CharField(
                    blank=True,
                    choices=[
                        ('red', 'Red — Critical'),
                        ('amber', 'Amber — Weak'),
                        ('blue', 'Blue — Missing Keyword'),
                        ('green', 'Green — Strong'),
                    ],
                    default='',
                    max_length=10,
                )),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
            options={
                'db_table': 'resume_insights',
                'ordering': ['-priority', 'insight_type'],
            },
        ),
        migrations.AddIndex(
            model_name='ResumeInsight',
            index=models.Index(fields=['analysis', 'insight_type'], name='ri_analysis_type_idx'),
        ),
        migrations.AddIndex(
            model_name='ResumeInsight',
            index=models.Index(fields=['analysis', '-priority'], name='ri_analysis_priority_idx'),
        ),

        # ------------------------------------------------------------------ #
        # Table 5: job_role_keywords                                          #
        # ------------------------------------------------------------------ #
        migrations.CreateModel(
            name='JobRoleKeyword',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('role_name', models.CharField(max_length=200)),
                ('role_slug', models.CharField(db_index=True, max_length=200)),
                ('role_category', models.CharField(
                    choices=[
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
                    ],
                    default='general',
                    max_length=100,
                )),
                ('keyword', models.CharField(max_length=200)),
                ('keyword_type', models.CharField(
                    choices=[
                        ('hard_skill', 'Hard Skill'),
                        ('soft_skill', 'Soft Skill'),
                        ('tool', 'Tool / Technology'),
                        ('action_verb', 'Action Verb'),
                        ('industry_term', 'Industry Term'),
                        ('certification', 'Certification'),
                    ],
                    default='hard_skill',
                    max_length=50,
                )),
                ('importance', models.CharField(
                    choices=[
                        ('required', 'Required'),
                        ('preferred', 'Preferred'),
                        ('bonus', 'Bonus'),
                    ],
                    default='required',
                    max_length=20,
                )),
                ('weight', models.DecimalField(decimal_places=2, default=1.0, max_digits=5)),
                ('is_active', models.BooleanField(default=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
            options={
                'db_table': 'job_role_keywords',
                'ordering': ['role_name', '-weight', 'keyword'],
            },
        ),
        migrations.AddConstraint(
            model_name='jobrolekeyword',
            constraint=models.UniqueConstraint(
                fields=['role_slug', 'keyword'],
                name='unique_role_keyword',
            ),
        ),
        migrations.AddIndex(
            model_name='JobRoleKeyword',
            index=models.Index(fields=['role_slug', 'is_active'], name='jrk_role_active_idx'),
        ),
    ]
