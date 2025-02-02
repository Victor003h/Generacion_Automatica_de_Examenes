from django.urls import path
from .views import *


urlpatterns = [
    path('test/pepe/',test),
    path('export/<int:format_id>/', export_document),
]
