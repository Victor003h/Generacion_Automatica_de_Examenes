from django.urls import path
from .views import login,teacher_register,student_register

urlpatterns = [
    path('register/teacher/',teacher_register),
    path('register/student/',student_register),
    path('login/',login)
]
