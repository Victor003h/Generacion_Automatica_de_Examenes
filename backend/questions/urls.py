from django.urls import path
from rest_framework import routers
from .views import *
from .views.subjects import *
from .views.topics import *
from .views.questions import *


router=routers.DefaultRouter()
#router.register('subject',SubjectViewSet)
# router.register('topic',TopicViewSet)
# router.register('question',QuestionViewSet)
# router.register('exam',ExamViewSet)


urlpatterns = [
    path('subjects/', subject_list, name='subject-list'),
    path('subject/<int:pk>/', subject_detail, name='subject-detail'),
    path('subject/question/<int:subject_id>/', subject_questions, name='subject-questions'),
    path('subject/topics/<int:subject_id>/', subject_topics, name='subject-topics'),
    path('subject/teachers/<int:subject_id>/', subject_teachers, name='subject-teachers'),
    
    path('topic/', topic_list, name='topic-list'),
    path('topic/<int:pk>/', topic_detail, name='topic-detail'),
    path('topic/subject/<int:topic_id>/', topic_subject, name='topic-subject'),
    path('topic/questions/<int:topic_id>/', topic_question, name='topic-questions'),
    
    
    path('question/', question_list),
    path('question/<int:pk>/', question_detail),
    path('question/topic/<int:pk>/', question_topic),
  
    path('teacher/subjects/<int:teacher_id>/',teacher_subjects),
    path('teacher/head_of_subject/<int:teacher_id>',headofsubject),
    path('student/subjects/<int:pk>/',student_subjects),
     
]+router.urls
