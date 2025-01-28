
from django.urls import path
from .views import *

#Add a name parameter to each path in urlpatterns

urlpatterns = [
    path('register/teacher/', teacher_register, name='teacher_register'),
    path('register/student/', student_register, name='student_register'),
    path('login/', login, name='login'),
    path('get/user/', getUser, name='getUser'),
    path('teacher/', teacher_list, name='teacher_list'),
    path('teacher/<int:pk>', teacher_detail, name='teacher_detail'),
    path('student/', student_list, name='student_list'),
    path('student/<int:pk>', student_detail, name='student_detail'),
    path('course/', course_list, name='course_list'),
    path('course/<int:pk>', course_detail, name='course_detail'),
]