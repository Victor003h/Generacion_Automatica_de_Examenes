from django.contrib import admin
from .models import *

# Register models
admin.site.register(Subject)
admin.site.register(Question)
admin.site.register(Topic)
admin.site.register(Course)
