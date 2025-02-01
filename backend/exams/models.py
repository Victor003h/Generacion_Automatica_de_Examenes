from django.db import models
from django.core.exceptions import ValidationError

from account.models import Teacher,Student
from questions.models import Subject,Question


# jefe de asig , revisa y valida el examen

class Exam(models.Model):
    type=models.CharField(max_length=150) # final , Inter-Semester ,etc
    teacher=models.ForeignKey(Teacher,null=True,on_delete=models.SET_NULL)
    validation_teacher=models.ForeignKey(Teacher,null=True,on_delete=models.SET_NULL,related_name='validation_teacher')
    validation_date=date=models.DateField(null=True,blank=True)
    subject=models.ForeignKey(Subject,on_delete=models.CASCADE)
    date=models.DateField(auto_now_add=True)
    questions=models.ManyToManyField(Question,related_name='exams')
    POSSIBLES_STATES=[
        ("V","Validated"),
        ("R", "Rejected"),
        ("P","Pending"),
    ]
    state=models.CharField(max_length=1,choices=POSSIBLES_STATES,default="P")
    
    
class Observation(models.Model):
    exam=models.ForeignKey(Exam,null=False,on_delete=models.CASCADE)
    date=models.DateField(auto_now_add=True)
    observations=models.CharField(max_length=500)
    checked=models.BooleanField(default=False)
    
    
class AssignedExam(models.Model):
    exam=models.ForeignKey(Exam,null=False,on_delete=models.CASCADE)
    type=models.CharField(max_length=150)
    date=models.DateField(auto_now_add=True)



#duda al borrar un examen
class ExamDone(models.Model):
    exam=models.ForeignKey(Exam,null=True,on_delete=models.SET_NULL)
    student=models.ForeignKey(Student,null=True,on_delete=models.SET_NULL)
    date=models.DateField(auto_now_add=True)
    
    # class Meta:
    #     constraints = [
    #         models.UniqueConstraint(fields=['validated_exam', 'student'], name='unique_validacion')
    #     ]
    
       
class ExamQuestionResponse(models.Model):
    exam_Done=models.ForeignKey(ExamDone,on_delete=models.CASCADE)
    question=models.ForeignKey(Question,null=True,on_delete=models.SET_NULL)
    response=models.TextField()
    note=models.DecimalField(max_digits=5,null=True,blank=True, decimal_places=2)
    
    class Meta:
        constraints = [
            models.CheckConstraint(
                check=models.Q(note__gte=0) & models.Q(note__lte=100),
                name='note_range'
            )
        ]
    

class ExamGrade(models.Model):
    examdone=models.ForeignKey(ExamDone,on_delete=models.CASCADE)
    teacher=models.ForeignKey(Teacher,null=True,on_delete=models.SET_NULL)
    date=models.DateField(auto_now_add=True)
    finalnote=models.DecimalField(max_digits=5,decimal_places=2)
    
    class Meta:
        constraints = [
            models.CheckConstraint(
                check=models.Q(finalnote__gte=0) & models.Q(finalnote__lte=100),
                name='finalnote_range'
            )
        ]
   
   
class ReevaluatedExam(models.Model):
    examgrade=models.ForeignKey(ExamGrade,on_delete=models.CASCADE)
    teacher=models.ForeignKey(Teacher,null=True,on_delete=models.SET_NULL)
    note=models.DecimalField(max_digits=5,null=True,blank=True, decimal_places=2)
    
    class Meta:
        constraints = [
            models.CheckConstraint(
                check=models.Q(note__gte=0) & models.Q(note__lte=100),
                name='reevaluated_note_range'
            )
        ]
    
    