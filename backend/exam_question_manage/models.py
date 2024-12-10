from django.db import models
from account.models import Teacher

class Subject(models.Model):
    name=models.CharField(max_length=150)
    study_program=models.TextField()
    course=models.IntegerField()
    head_of_subject=models.ForeignKey(Teacher,null=True,blank=True,on_delete=models.DO_NOTHING)

class Topic(models.Model):
    name=models.CharField(max_length=150)
    Subject=models.ForeignKey(Subject,on_delete=models.CASCADE)
    
    
    
class Question(models.Model):
    #Content, Type, Difficulty
    content=models.TextField()
    TYPE_OF_QUESTION=[
        ("MO","Multiple Option"),
        ("TF", "True or False"),
        ("E","Essay"),
    ]
    type=models.CharField(max_length=2,choices=TYPE_OF_QUESTION)
    
    DIFFICULTY=[
        ("E","Easy"),
        ("M", "Medium"),
        ("D","Difficult"),
    ]
    difficulty=models.CharField(max_length=1,choices=DIFFICULTY)
    teacher=models.ForeignKey(Teacher,on_delete=models.DO_NOTHING)
    date=models.DateField(auto_now_add=True)
    topic=models.ForeignKey(Topic,on_delete=models.DO_NOTHING)
    
    
class Exam(models.Model):
    type=models.CharField(max_length=150)
    validation=models.BooleanField()
    parameters=models.CharField(max_length=150)
    teacher=models.ForeignKey(Teacher,on_delete=models.DO_NOTHING)
    subject=models.ForeignKey(Subject,on_delete=models.DO_NOTHING)
    date=models.DateField(auto_now_add=True)
    