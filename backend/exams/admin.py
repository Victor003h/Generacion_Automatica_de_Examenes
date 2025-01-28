from django.contrib import admin

from .models import *

# Register your models here.
admin.site.register(Exam)
admin.site.register(ValidatedExam)
admin.site.register(ExamDone)
admin.site.register(ExamQuestionResponse)
