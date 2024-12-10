from django.urls import path
from rest_framework import routers

from .views import ExamViewSet, QuestionViewSet, SubjectViewSet, TopicViewSet


router=routers.DefaultRouter()
router.register('subject',SubjectViewSet)
router.register('topic',TopicViewSet)
router.register('question',QuestionViewSet)
router.register('exam',ExamViewSet)


urlpatterns = router.urls

