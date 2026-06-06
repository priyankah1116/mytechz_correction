import threading
from django.utils import timezone
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import ResumeAnalysisJob, JobRoleKeyword
from .serializers import (
    ResumeAnalysisJobListSerializer,
    ResumeAnalysisJobDetailSerializer,
    EditorDataSerializer,
    SaveEditSerializer,
    ResumeUploadSerializer,
    JobRoleSerializer,
)
from .engine import run_analysis


# ---------------------------------------------------------------------------
# Helper
# ---------------------------------------------------------------------------

def _run_analysis_async(analysis_job, file_path):
    """Run analysis in a background thread so the upload response is instant."""
    try:
        with open(file_path, 'rb') as f:
            run_analysis(analysis_job, f)
    except Exception as e:
        analysis_job.status = ResumeAnalysisJob.STATUS_FAILED
        analysis_job.error_message = str(e)
        analysis_job.save(update_fields=['status', 'error_message'])


# ---------------------------------------------------------------------------
# Upload & Start Analysis
# ---------------------------------------------------------------------------

@api_view(['POST'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def upload_resume_for_analysis(request):
    """
    POST /api/resume-analysis/upload
    Accepts: multipart/form-data with `resume_file` and optional `job_roles[]`
    Creates a ResumeAnalysisJob and runs the analysis engine asynchronously.
    """
    serializer = ResumeUploadSerializer(data=request.data)
    if not serializer.is_valid():
        return Response({'success': False, 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    file = serializer.validated_data['resume_file']
    job_roles = serializer.validated_data.get('job_roles', [])

    ext = file.name.rsplit('.', 1)[-1].lower()

    # Create the analysis job record
    job = ResumeAnalysisJob(
        user=request.user,
        file_name=file.name,
        file_type=ext,
        file_size_bytes=file.size,
        status=ResumeAnalysisJob.STATUS_PENDING,
    )
    job.set_selected_job_roles(job_roles)
    job.file_path = file
    job.save()

    # Run analysis in background thread
    file_path = job.file_path.path
    thread = threading.Thread(target=_run_analysis_async, args=(job, file_path), daemon=True)
    thread.start()

    return Response({
        'success': True,
        'message': 'Resume uploaded. Analysis started.',
        'analysis_id': job.id,
        'status': job.status,
    }, status=status.HTTP_202_ACCEPTED)


# ---------------------------------------------------------------------------
# List past analyses
# ---------------------------------------------------------------------------

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_analyses(request):
    """GET /api/resume-analysis/ — list current user's analysis history."""
    jobs = ResumeAnalysisJob.objects.filter(user=request.user).order_by('-created_at')[:20]
    serializer = ResumeAnalysisJobListSerializer(jobs, many=True)
    return Response({'success': True, 'analyses': serializer.data, 'total': jobs.count()})


# ---------------------------------------------------------------------------
# Analysis detail
# ---------------------------------------------------------------------------

@api_view(['GET', 'DELETE'])
@permission_classes([IsAuthenticated])
def analysis_detail(request, analysis_id):
    """
    GET  /api/resume-analysis/{id}/ — full analysis result
    DELETE /api/resume-analysis/{id}/ — delete an analysis
    """
    try:
        job = ResumeAnalysisJob.objects.get(id=analysis_id, user=request.user)
    except ResumeAnalysisJob.DoesNotExist:
        return Response({'success': False, 'message': 'Analysis not found.'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'DELETE':
        job.delete()
        return Response({'success': True, 'message': 'Analysis deleted.'})

    serializer = ResumeAnalysisJobDetailSerializer(job)
    return Response({'success': True, 'analysis': serializer.data})


# ---------------------------------------------------------------------------
# Poll status (for frontend spinner while analysis runs)
# ---------------------------------------------------------------------------

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def analysis_status(request, analysis_id):
    """GET /api/resume-analysis/status/{id}/ — lightweight status poll."""
    try:
        job = ResumeAnalysisJob.objects.only(
            'id', 'status', 'ats_score', 'error_message', 'completed_at'
        ).get(id=analysis_id, user=request.user)
    except ResumeAnalysisJob.DoesNotExist:
        return Response({'success': False, 'message': 'Analysis not found.'}, status=status.HTTP_404_NOT_FOUND)

    return Response({
        'success': True,
        'id': job.id,
        'status': job.status,
        'ats_score': str(job.ats_score),
        'error_message': job.error_message,
        'completed_at': job.completed_at,
    })


# ---------------------------------------------------------------------------
# Keywords breakdown
# ---------------------------------------------------------------------------

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def analysis_keywords(request, analysis_id):
    """GET /api/resume-analysis/{id}/keywords/"""
    try:
        job = ResumeAnalysisJob.objects.get(id=analysis_id, user=request.user)
    except ResumeAnalysisJob.DoesNotExist:
        return Response({'success': False, 'message': 'Analysis not found.'}, status=status.HTTP_404_NOT_FOUND)

    from .serializers import ResumeKeywordResultSerializer
    keywords = job.keywords.all().order_by('-importance_score', 'keyword')

    # Group by type for frontend charts
    grouped = {}
    for kw in keywords:
        t = kw.keyword_type
        if t not in grouped:
            grouped[t] = {'found': [], 'missing': []}
        target = 'found' if kw.is_present else 'missing'
        grouped[t][target].append(ResumeKeywordResultSerializer(kw).data)

    return Response({'success': True, 'grouped': grouped, 'total': keywords.count()})


# ---------------------------------------------------------------------------
# Sections breakdown
# ---------------------------------------------------------------------------

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def analysis_sections(request, analysis_id):
    """GET /api/resume-analysis/{id}/sections/"""
    try:
        job = ResumeAnalysisJob.objects.get(id=analysis_id, user=request.user)
    except ResumeAnalysisJob.DoesNotExist:
        return Response({'success': False, 'message': 'Analysis not found.'}, status=status.HTTP_404_NOT_FOUND)

    from .serializers import ResumeSectionResultSerializer
    sections = job.sections.all()
    serializer = ResumeSectionResultSerializer(sections, many=True)
    return Response({'success': True, 'sections': serializer.data})


# ---------------------------------------------------------------------------
# Insights (strengths + weaknesses)
# ---------------------------------------------------------------------------

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def analysis_insights(request, analysis_id):
    """GET /api/resume-analysis/{id}/insights/"""
    try:
        job = ResumeAnalysisJob.objects.get(id=analysis_id, user=request.user)
    except ResumeAnalysisJob.DoesNotExist:
        return Response({'success': False, 'message': 'Analysis not found.'}, status=status.HTTP_404_NOT_FOUND)

    from .serializers import ResumeInsightSerializer
    strengths = job.insights.filter(insight_type='strength').order_by('-priority')
    weaknesses = job.insights.filter(insight_type='weakness').order_by('-priority')
    suggestions = job.insights.filter(insight_type='suggestion').order_by('-priority')

    return Response({
        'success': True,
        'strengths': ResumeInsightSerializer(strengths, many=True).data,
        'weaknesses': ResumeInsightSerializer(weaknesses, many=True).data,
        'suggestions': ResumeInsightSerializer(suggestions, many=True).data,
    })


# ---------------------------------------------------------------------------
# Editor data (Smart Editor highlight map)
# ---------------------------------------------------------------------------

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def analysis_editor_data(request, analysis_id):
    """GET /api/resume-analysis/{id}/editor-data/ — editor highlight map."""
    try:
        job = ResumeAnalysisJob.objects.get(id=analysis_id, user=request.user)
    except ResumeAnalysisJob.DoesNotExist:
        return Response({'success': False, 'message': 'Analysis not found.'}, status=status.HTTP_404_NOT_FOUND)

    if job.status != ResumeAnalysisJob.STATUS_COMPLETED:
        return Response({'success': False, 'message': 'Analysis not yet complete.'}, status=status.HTTP_400_BAD_REQUEST)

    serializer = EditorDataSerializer(job)
    return Response({'success': True, 'editor': serializer.data})


# ---------------------------------------------------------------------------
# Save edited resume text
# ---------------------------------------------------------------------------

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
@parser_classes([JSONParser])
def save_edit(request, analysis_id):
    """
    PATCH /api/resume-analysis/{id}/save-edit/
    Body: { "edited_text": "..." }
    Saves the edited text and triggers a re-score.
    """
    try:
        job = ResumeAnalysisJob.objects.get(id=analysis_id, user=request.user)
    except ResumeAnalysisJob.DoesNotExist:
        return Response({'success': False, 'message': 'Analysis not found.'}, status=status.HTTP_404_NOT_FOUND)

    serializer = SaveEditSerializer(data=request.data)
    if not serializer.is_valid():
        return Response({'success': False, 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    edited_text = serializer.validated_data['edited_text']
    job.edited_text = edited_text
    job.last_edited_at = timezone.now()

    # Re-score using the edited text (quick in-memory rescore, no file I/O)
    from .engine import (
        detect_sections, score_section, score_action_verbs,
        score_quantification, score_format, score_readability, compute_ats_score
    )
    from .models import JobRoleKeyword
    from .engine import match_keywords
    from decimal import Decimal

    roles = job.get_selected_job_roles()
    if roles:
        job_role_keywords = list(JobRoleKeyword.objects.filter(
            role_slug__in=[r.lower().replace(' ', '-') for r in roles],
            is_active=True,
        ))
    else:
        job_role_keywords = list(JobRoleKeyword.objects.filter(role_slug='general', is_active=True))

    keyword_results = match_keywords(edited_text, job_role_keywords)
    found = sum(1 for k in keyword_results if k['is_present'])
    expected = len(keyword_results)
    keyword_score = Decimal(str(round((found / expected) * 100, 2))) if expected else Decimal('50')

    section_data = detect_sections(edited_text)
    present_count = sum(1 for v in section_data.values() if v['is_present'])
    section_score = Decimal(str(round((present_count / 9) * 100, 2)))

    format_score, _ = score_format(edited_text, job.file_type)
    action_verb_score, _ = score_action_verbs(edited_text)
    quantification_score = score_quantification(edited_text)
    readability_score = score_readability(edited_text)

    new_ats = compute_ats_score(
        keyword_score, section_score, format_score,
        action_verb_score, quantification_score, readability_score,
    )
    job.edited_ats_score = new_ats
    job.save(update_fields=['edited_text', 'last_edited_at', 'edited_ats_score'])

    return Response({
        'success': True,
        'message': 'Resume saved and re-scored.',
        'edited_ats_score': str(new_ats),
        'original_ats_score': str(job.ats_score),
        'improvement': str(round(new_ats - job.ats_score, 2)),
    })


# ---------------------------------------------------------------------------
# Quick Fix — apply all amber suggestions
# ---------------------------------------------------------------------------

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def apply_quick_fix(request, analysis_id):
    """
    POST /api/resume-analysis/{id}/quick-fix/
    Returns list of all amber/medium-priority insights with their suggestions.
    Frontend applies them to the editor.
    """
    try:
        job = ResumeAnalysisJob.objects.get(id=analysis_id, user=request.user)
    except ResumeAnalysisJob.DoesNotExist:
        return Response({'success': False, 'message': 'Analysis not found.'}, status=status.HTTP_404_NOT_FOUND)

    quick_fixes = job.insights.filter(
        insight_type='weakness',
        priority=2,
        highlight_color='amber',
    ).values('id', 'title', 'suggestion', 'char_start', 'char_end', 'section_name')

    return Response({
        'success': True,
        'quick_fixes': list(quick_fixes),
        'total': len(quick_fixes),
    })


# ---------------------------------------------------------------------------
# Job Roles list
# ---------------------------------------------------------------------------

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def job_roles_list(request):
    """GET /api/resume-analysis/job-roles/ — all available job roles."""
    roles = (
        JobRoleKeyword.objects
        .filter(is_active=True)
        .values('role_name', 'role_slug', 'role_category')
        .distinct()
        .order_by('role_category', 'role_name')
    )
    return Response({'success': True, 'job_roles': list(roles)})
