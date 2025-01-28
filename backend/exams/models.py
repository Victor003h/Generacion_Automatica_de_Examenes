from django.db import models

from account.models import Teacher,Student
from questions.models import Subject,Question


# jefe de asig , revisa y valida el examen


class Exam(models.Model):
    type=models.CharField(max_length=150) # final , Inter-Semester ,etc
    teacher=models.ForeignKey(Teacher,null=True,on_delete=models.SET_NULL)
    validation_teacher=models.ForeignKey(Teacher,null=True,on_delete=models.SET_NULL,related_name='validation_teacher')
    subject=models.ForeignKey(Subject,on_delete=models.CASCADE)
    date=models.DateField(auto_now_add=True)
    questions=models.ManyToManyField(Question,related_name='exams')
    
# que pasa si deseo obtener todos los examnevalidads y sus profesores , si un profesor se borra
class ValidatedExam(models.Model):
    exam=models.ForeignKey(Exam,null=False,on_delete=models.CASCADE)
    teacher=models.ForeignKey(Teacher,null=True,on_delete=models.SET_NULL)
    date=models.DateField(auto_now_add=True)
    observations=models.CharField(max_length=500)
    
    # class Meta:
    #     constraints = [
    #         models.UniqueConstraint(fields=['teacher', 'exam'], name='unique_validacion')
    #     ]
    
    

class ExamDone(models.Model):
    validated_exam=models.ForeignKey(ValidatedExam,null=True,on_delete=models.SET_NULL)
    student=models.ForeignKey(Student,null=True,on_delete=models.SET_NULL)
    date=models.DateField(auto_now_add=True)
    
    # class Meta:
    #     constraints = [
    #         models.UniqueConstraint(fields=['validated_exam', 'student'], name='unique_validacion')
    #     ]
    
       
   # add unique field

class ExamQuestionResponse(models.Model):
    exam_Done=models.ForeignKey(ExamDone,on_delete=models.CASCADE)
    question=models.ForeignKey(Question,null=True,on_delete=models.SET_NULL)
    response=models.TextField()
    observation=models.CharField(max_length=500)
    
    # class Meta:
    #     constraints = [
    #         models.UniqueConstraint(fields=['question', 'exam_Done'], name='unique_validacion')
    #     ]