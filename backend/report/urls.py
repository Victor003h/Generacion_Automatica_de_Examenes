from django.urls import path
from .views import *


urlpatterns = [
    path('export/<str:extension>/', export_document),
    path('subject/exams/<int:pk>/',subject_exams), 
    path('exam/validatedby/<int:pk>/',validatedby),
    path('exam/compare/',exam_compare),
    path('teacher/exam_graded/detail/<int:months>',teacher_examgraded_detail),
    path('questions/most_used/<int:pk>',common_questions), 
    path('questions/unused/<int:pk>/',unused_questions),
    
]
