from django.urls import path
from .views import *
urlpatterns = [
    path('exportar/<str:format>/', export_document, name='exportar_documento'),
    path('exportar/pepe/', test),
]
