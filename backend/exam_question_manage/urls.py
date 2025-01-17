from django.urls import path
from rest_framework import routers

from .views import subject_detail, subject_list, subject_questions, teacher_subjects,topic_list,topic_detail,question_list,question_detail,exam_list,exam_detail


router=routers.DefaultRouter()
#router.register('subject',SubjectViewSet)
# router.register('topic',TopicViewSet)
# router.register('question',QuestionViewSet)
# router.register('exam',ExamViewSet)


urlpatterns =[
    path('subjects/', subject_list),
    path('subject/<int:pk>/',subject_detail),
    
    path('topic/', topic_list),
    path('topic/<int:pk>/',topic_detail),
    
    path('question/', question_list),
    path('question/<int:pk>/',question_detail),
    
    path('exam/', exam_list),
    path('exam/<int:pk>/',exam_detail),
    path('teacher/subjects/<int:teacher_id>/',teacher_subjects),
    path('subject/question/<int:subject_id>/',subject_questions)
]+router.urls
