from django.contrib import admin
from .models import Exam, Question, Subject, Topic

admin.site.register(Subject)
admin.site.register(Exam)
admin.site.register(Question)
admin.site.register(Topic)
