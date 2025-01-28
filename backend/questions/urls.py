from django.urls import path
from rest_framework import routers
from .views import *
from .viewss.subjects import *
from .viewss.topics import *
from .viewss.questions import *


router=routers.DefaultRouter()
#router.register('subject',SubjectViewSet)
# router.register('topic',TopicViewSet)
# router.register('question',QuestionViewSet)
# router.register('exam',ExamViewSet)


urlpatterns =[
    path('subjects/', subject_list),
    path('subject/<int:pk>/',subject_detail),
    path('subject/question/<int:subject_id>/',subject_questions),
    path('subject/topics/<int:subject_id>/',subject_topics),
    path('subject/teachers/<int:subject_id>/',subject_teachers),
     
    path('topic/', topic_list),
    path('topic/<int:pk>/',topic_detail),
    path('topic/subject/<int:topic_id>/',topic_subject),
    path('topic/questions/<int:topic_id>/',topic_question),
    
    path('question/', question_list),
    path('question/<int:pk>/',question_detail),
    path('question/topic/<int:question_id>/',question_topic),
    
  
    path('teacher/subjects/<int:teacher_id>/',teacher_subjects),
    path('teacher/head_of_subject/<int:teacher_id>',headofsubject),
     
]+router.urls
