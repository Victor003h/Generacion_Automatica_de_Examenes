from django.urls import path
from .views import *


urlpatterns = [
    path('export/<str:extension>/', export_document),
]
