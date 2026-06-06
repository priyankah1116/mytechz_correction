import json
from rest_framework import serializers
from .models import ResumeAnalysisJob, ResumeSectionResult, ResumeKeywordResult, ResumeInsight, JobRoleKeyword


class ResumeSectionResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResumeSectionResult
        fields = [
            'id', 'section_name', 'is_present', 'strength_score',
            'word_count', 'bullet_count', 'feedback', 'char_start', 'char_end',
        ]


class ResumeKeywordResultSerializer(serializers.ModelSerializer):
    found_in_sections = serializers.SerializerMethodField()
    char_positions = serializers.SerializerMethodField()

    class Meta:
        model = ResumeKeywordResult
        fields = [
            'id', 'keyword', 'keyword_type', 'job_role_context',
            'is_present', 'frequency', 'importance_level', 'importance_score',
            'found_in_sections', 'context_snippet', 'char_positions',
        ]

    def get_found_in_sections(self, obj):
        return obj.get_found_in_sections()

    def get_char_positions(self, obj):
        return obj.get_char_positions()


class ResumeInsightSerializer(serializers.ModelSerializer):
    ai_rewrites = serializers.SerializerMethodField()

    class Meta:
        model = ResumeInsight
        fields = [
            'id', 'insight_type', 'category', 'title', 'description',
            'suggestion', 'ai_rewrites', 'priority',
            'section_name', 'char_start', 'char_end', 'highlight_color',
        ]

    def get_ai_rewrites(self, obj):
        return obj.get_ai_rewrites()


class ResumeAnalysisJobListSerializer(serializers.ModelSerializer):
    """Compact serializer for listing past analyses."""
    selected_job_roles = serializers.SerializerMethodField()

    class Meta:
        model = ResumeAnalysisJob
        fields = [
            'id', 'file_name', 'file_type', 'selected_job_roles', 'detected_job_role',
            'ats_score', 'keyword_score', 'section_score',
            'total_keywords_found', 'total_keywords_expected',
            'total_sections_present', 'total_sections_expected',
            'status', 'created_at', 'completed_at',
        ]

    def get_selected_job_roles(self, obj):
        return obj.get_selected_job_roles()


class ResumeAnalysisJobDetailSerializer(serializers.ModelSerializer):
    """Full serializer with nested sections, keywords, insights."""
    selected_job_roles = serializers.SerializerMethodField()
    sections = ResumeSectionResultSerializer(many=True, read_only=True)
    keywords = ResumeKeywordResultSerializer(many=True, read_only=True)
    insights = ResumeInsightSerializer(many=True, read_only=True)
    keyword_coverage_pct = serializers.ReadOnlyField()
    section_coverage_pct = serializers.ReadOnlyField()

    class Meta:
        model = ResumeAnalysisJob
        fields = [
            'id', 'file_name', 'file_type', 'file_size_bytes',
            'selected_job_roles', 'detected_job_role',
            'ats_score', 'keyword_score', 'section_score', 'format_score',
            'action_verb_score', 'quantification_score', 'readability_score',
            'total_keywords_found', 'total_keywords_expected',
            'total_sections_present', 'total_sections_expected',
            'keyword_coverage_pct', 'section_coverage_pct',
            'edited_ats_score', 'last_edited_at',
            'status', 'error_message',
            'created_at', 'completed_at', 'updated_at',
            'sections', 'keywords', 'insights',
        ]

    def get_selected_job_roles(self, obj):
        return obj.get_selected_job_roles()


class EditorDataSerializer(serializers.ModelSerializer):
    """
    Serializer for the Smart Editor — includes extracted text
    plus all highlight positions (sections + insights).
    """
    selected_job_roles = serializers.SerializerMethodField()
    sections = ResumeSectionResultSerializer(many=True, read_only=True)
    highlights = serializers.SerializerMethodField()

    class Meta:
        model = ResumeAnalysisJob
        fields = [
            'id', 'extracted_text', 'edited_text',
            'ats_score', 'edited_ats_score',
            'selected_job_roles',
            'sections', 'highlights',
        ]

    def get_selected_job_roles(self, obj):
        return obj.get_selected_job_roles()

    def get_highlights(self, obj):
        """
        Merge insights with char positions into a flat highlight list
        for the editor frontend to render.
        """
        highlights = []
        for insight in obj.insights.filter(char_start__isnull=False):
            highlights.append({
                'insight_id': insight.id,
                'type': insight.insight_type,
                'color': insight.highlight_color,
                'char_start': insight.char_start,
                'char_end': insight.char_end,
                'title': insight.title,
                'description': insight.description,
                'suggestion': insight.suggestion,
                'ai_rewrites': insight.get_ai_rewrites(),
                'section_name': insight.section_name,
            })
        return highlights


class SaveEditSerializer(serializers.Serializer):
    """Used when the user saves edited resume text from the Smart Editor."""
    edited_text = serializers.CharField(allow_blank=False)


class ResumeUploadSerializer(serializers.Serializer):
    """Used for the upload endpoint."""
    resume_file = serializers.FileField()
    job_roles = serializers.ListField(
        child=serializers.CharField(max_length=200),
        required=False,
        default=list,
        allow_empty=True,
    )

    def validate_resume_file(self, value):
        max_size = 10 * 1024 * 1024  # 10 MB
        if value.size > max_size:
            raise serializers.ValidationError('File size cannot exceed 10 MB.')

        ext = value.name.rsplit('.', 1)[-1].lower()
        if ext not in ('pdf', 'doc', 'docx', 'txt'):
            raise serializers.ValidationError('Only PDF, DOC, DOCX, and TXT files are accepted.')

        return value


class JobRoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobRoleKeyword
        fields = ['role_name', 'role_slug', 'role_category']
