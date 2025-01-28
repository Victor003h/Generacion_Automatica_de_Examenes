from django.urls import path
from .views import *

urlpatterns = [
    path('exam/', exam_list, name='exam_list'),
    path('exam/<int:pk>/', exam_detail, name='exam_detail'),
]