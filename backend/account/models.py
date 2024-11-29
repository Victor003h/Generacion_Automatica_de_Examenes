from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    pass


class Admin(models.Model):
    user=models.OneToOneField(User,on_delete=models.CASCADE)

class Teacher(models.Model):
    user=models.OneToOneField(User,on_delete=models.CASCADE)
    speciality=models.CharField(max_length=100)
    
    
class Student(models.Model):
    user=models.OneToOneField(User,on_delete=models.CASCADE)
    age=models.PositiveIntegerField()
    course=models.PositiveIntegerField()
    
    
    
    
    
    