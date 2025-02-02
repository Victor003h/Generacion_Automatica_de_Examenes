from django.db import models
from account.models import Teacher,Course

class Subject(models.Model):
    name=models.CharField(max_length=150)
    study_program=models.TextField()
    course=models.ForeignKey(Course,null=False,on_delete=models.CASCADE)
    teachers_subject=models.ManyToManyField(Teacher,related_name='subjects')
    head_of_subject=models.ForeignKey(Teacher,null=True,on_delete=models.SET_NULL)
    

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
    teacher=models.ForeignKey(Teacher,null=True,on_delete=models.SET_NULL)
    date=models.DateField(auto_now_add=True)
    topic=models.ForeignKey(Topic,null=True,on_delete=models.SET_NULL)
    subject=models.ForeignKey(Subject,null=True,on_delete=models.SET_NULL)  # sobra
    
    
