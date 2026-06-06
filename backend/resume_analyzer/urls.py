from django.urls import path
from . import views

urlpatterns = [
    # Upload & start analysis
    path('upload', views.upload_resume_for_analysis, name='ra_upload'),

    # List history
    path('', views.list_analyses, name='ra_list'),

    # Job roles dropdown
    path('job-roles', views.job_roles_list, name='ra_job_roles'),

    # Analysis-specific endpoints
    path('<int:analysis_id>', views.analysis_detail, name='ra_detail'),
    path('<int:analysis_id>/status', views.analysis_status, name='ra_status'),
    path('<int:analysis_id>/keywords', views.analysis_keywords, name='ra_keywords'),
    path('<int:analysis_id>/sections', views.analysis_sections, name='ra_sections'),
    path('<int:analysis_id>/insights', views.analysis_insights, name='ra_insights'),
    path('<int:analysis_id>/editor-data', views.analysis_editor_data, name='ra_editor_data'),
    path('<int:analysis_id>/save-edit', views.save_edit, name='ra_save_edit'),
    path('<int:analysis_id>/quick-fix', views.apply_quick_fix, name='ra_quick_fix'),
]
