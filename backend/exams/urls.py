from django.urls import path
from .views import *
from .views.exam import *
from .views.assignedexam import *
from .views.examdone import *
from .views.examgrade import *
from .views.examquestionresponse import *
from .views.observation import * 
from .views.reevaluatedExam import * 

urlpatterns = [
    path('exam/',exam_list),
    path('exam/<int:pk>/',exam_detail),
    path('exam/questions/<int:pk>/',exam_questions),
    path('exam/bystate/<str:state>/',exams_by_state),
    path('subject/exams/<int:pk>/',subject_exams),
    path('exam/isvalidated/<int:pk>/',isvalidated),
    path('exam/validatedby/<int:pk>/',validatedby),
    path('exam/observations/<int:pk>/',exam_observations),
   
   
    path('exam_grade/',examgrade_list),
    path('exam_grade/<int:pk>/',examgrade_detail),
    path('exam_grade/is_reevaluated/<int:pk>/',is_reevaluated),
    
    path('student/exams_grade/<int:pk>/',student_examgrade),
    path('teacher/exam_graded/detail/<int:months>',teacher_examgraded_detail),
    
    path('assigned_exam/',assigned_exam_list),
    path('assigned_exam/<int:pk>/',assigned_exam_detail),
    path('questions/most_used/<int:pk>',common_questions),
    path('questions/unused/<int:pk>',unused_questions),
    
    path('observation/',observation_list),
    path('observation/<int:pk>/',observation_detail),
    
    
    path('exam_done/',exam_done_list),
    path('exam_done/<int:pk>/',exam_done_detail),
    path('exam_done/questions/<int:pk>/',questions_response),
    path('exam_done/ungraded/<int:pk>',examsdone_ungraded),
     path('exam_done/exist/<int:student_pk>/<int:exam_pk>',examdone_exist),
    path('subject/exams_done/<int:pk>/',subject_examsdone),
    
    
    
    path('exam_question_response/',exam_question_response_list),
    path('exam_question_response/<int:pk>/',exam_question_response_detail),
    
    path('reevaluated_exam/',reevaluated_exam_list),
    path('reevaluated_exam/<int:pk>/',reevaluated_exam_detail),
    path('teacher/re_evaluated_exam/<int:pk>/',teacher_reevaluatedexam),
    path('examgrade/re_evaluated_exam/<int:pk>/',examgrade_exam_reevaluted),   
]