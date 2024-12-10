
from django.contrib import admin
from django.urls import path,include
from drf_spectacular.views import SpectacularAPIView,SpectacularSwaggerView

from exam_question_manage.views import QuestionViewSet, SubjectViewSet, TopicViewSet
from rest_framework import routers



urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/account/',include('account.urls')),
    path('api/docs/schema/',SpectacularAPIView.as_view(),name="schema"),
    path('api/docs/schema/ui/',SpectacularSwaggerView.as_view()),
    path('api/',include('exam_question_manage.urls'))
    
]
