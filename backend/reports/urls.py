from django.urls import path
from .views import export_document

urlpatterns = [
    path('exportar/<str:format>/', export_document, name='exportar_documento'),
]
