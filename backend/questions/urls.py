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
    
    path('question/', question_list, name='question-list'),
    path('question/<int:pk>/', question_detail, name='question-detail'),
    path('question/topic/<int:question_id>/', question_topic, name='question-topic'),
    
    path('teacher/subjects/<int:teacher_id>/', teacher_subjects, name='teacher-subjects'),
] + router.urls
