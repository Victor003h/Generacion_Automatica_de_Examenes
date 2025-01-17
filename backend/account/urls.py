from django.urls import path
from .views import login,teacher_register,student_register,getallStudent,getallTeacher

urlpatterns = [
    path('register/teacher/',teacher_register),
    path('register/student/',student_register),
    path('get/students/',getallStudent),
    path('get/teachers/',getallTeacher),
    path('login/',login)
]
