from django.contrib import admin
from .models import ResumeAnalysisJob, ResumeSectionResult, ResumeKeywordResult, ResumeInsight, JobRoleKeyword


class ResumeSectionResultInline(admin.TabularInline):
    model = ResumeSectionResult
    extra = 0
    readonly_fields = ('section_name', 'is_present', 'strength_score', 'word_count', 'feedback')
    can_delete = False


class ResumeInsightInline(admin.TabularInline):
    model = ResumeInsight
    extra = 0
    readonly_fields = ('insight_type', 'category', 'title', 'priority', 'highlight_color')
    can_delete = False


@admin.register(ResumeAnalysisJob)
class ResumeAnalysisJobAdmin(admin.ModelAdmin):
    list_display = (
        'id', 'user', 'file_name', 'file_type', 'ats_score',
        'keyword_score', 'section_score', 'status', 'created_at',
    )
    list_filter = ('status', 'file_type', 'created_at')
    search_fields = ('user__email', 'file_name', 'detected_job_role')
    readonly_fields = ('created_at', 'updated_at', 'completed_at')
    inlines = [ResumeSectionResultInline, ResumeInsightInline]
    ordering = ('-created_at',)


@admin.register(JobRoleKeyword)
class JobRoleKeywordAdmin(admin.ModelAdmin):
    list_display = ('role_name', 'role_slug', 'role_category', 'keyword', 'keyword_type', 'importance', 'weight', 'is_active')
    list_filter = ('role_category', 'keyword_type', 'importance', 'is_active')
    search_fields = ('role_name', 'role_slug', 'keyword')
    list_editable = ('importance', 'weight', 'is_active')
    ordering = ('role_name', '-weight', 'keyword')


@admin.register(ResumeInsight)
class ResumeInsightAdmin(admin.ModelAdmin):
    list_display = ('analysis', 'insight_type', 'category', 'title', 'priority', 'highlight_color')
    list_filter = ('insight_type', 'category', 'highlight_color', 'priority')
    search_fields = ('title', 'description')
