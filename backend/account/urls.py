from django.urls import path
from .views import *

urlpatterns = [
    path('register/teacher/',teacher_register),
    path('register/student/',student_register),
    # path('get/students/',getallStudent),
    # path('get/teachers/',getallTeacher),
    path('login/',login),
    path('get/user/', getUser),
    path('teacher/',teacher_list),
    path('teacher/<int:pk>',teacher_detail),
    path('student/',student_list),
    path('student/<int:pk>',student_detail),
    
]
