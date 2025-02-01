from django.contrib import admin

from .models import *

# Register your models here.
admin.site.register(Exam)
admin.site.register(Observation)
admin.site.register(AssignedExam)
admin.site.register(ExamDone)
admin.site.register(ExamGrade)
admin.site.register(ExamQuestionResponse)
admin.site.register(ReevaluatedExam)
