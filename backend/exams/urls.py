from django.urls import path
from .views import *


urlpatterns = [
    path('exam/',exam_list),
    path('exam/<int:pk>/',exam_detail),
]
