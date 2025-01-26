from django.db import models
from django.contrib.auth.models import AbstractUser

class Course(models.Model):
    name=models.CharField(max_length=150)
    startDate=models.DateTimeField()
    endDate=models.DateTimeField()
    

class User(AbstractUser):
    last_name2=models.CharField(max_length=50)


class Teacher(User):
    speciality=models.CharField(max_length=100)
    

class Student(User):
    age=models.PositiveIntegerField()
    course=models.ForeignKey(Course,null=True,on_delete=models.SET_NULL)
    
