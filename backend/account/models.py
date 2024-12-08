from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    last_name2=models.CharField(max_length=50)


class Teacher(User):
    speciality=models.CharField(max_length=100)


class Student(User):
    age=models.PositiveIntegerField()
    course=models.PositiveIntegerField()
    
    
    
    
    
    