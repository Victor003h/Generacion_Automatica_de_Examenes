from django.db import models

from account.models import Teacher
from questions.models import Subject,Question


# jefe de asig , revisa y valida el examen



class Exam(models.Model):
    type=models.CharField(max_length=150) # final , Inter-Semester ,etc
    teacher=models.ForeignKey(Teacher,null=True,on_delete=models.SET_NULL)
    validation_teacher=models.ForeignKey(Teacher,null=True,on_delete=models.SET_NULL,related_name='validation_teacher')
    subject=models.ForeignKey(Subject,on_delete=models.CASCADE)
    date=models.DateField(auto_now_add=True)
    questions=models.ManyToManyField(Question,related_name='exams')
    

