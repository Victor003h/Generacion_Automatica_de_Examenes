from django.urls import path
from .views import *


urlpatterns = [
    path('exam/',exam_list),
    path('exam/<int:pk>/',exam_detail),
    path('exam/questions/<int:pk>/',exam_questions),
    
    path('validated_exam/',validated_exam_list),
    path('validated_exam/<int:pk>/',validated_exam_detail),
    
    path('exam_done/',exam_done_list),
    path('exam_done/<int:pk>/',exam_done_detail),
    
    path('exam_question_response/',exam_question_response_list),
    path('exam_question_response/<int:pk>/',exam_question_response_detail),
]

