from django.shortcuts import render
from rest_framework import viewsets ,permissions
from .models import Exam, Question, Subject, Topic
from .serializer import ExamSerializer, QuestionSerializer, SubjectSerializer,TopicSerializer
from rest_framework import viewsets
from drf_spectacular.utils import extend_schema, extend_schema_view

@extend_schema_view(
    list=extend_schema(tags=['Subjects']),
    retrieve=extend_schema(tags=['Subjects']),
    create=extend_schema(tags=['Subjects']),
    update=extend_schema(tags=['Subjects']),
    partial_update=extend_schema(tags=['Subjects']),
    destroy=extend_schema(tags=['Subjects']),
)
class SubjectViewSet(viewsets.ModelViewSet):
    queryset=Subject.objects.all()
    permission_classes=[permissions.AllowAny]
    serializer_class=SubjectSerializer
    
@extend_schema_view(
    list=extend_schema(tags=['Topic']),
    retrieve=extend_schema(tags=['Topic']),
    create=extend_schema(tags=['Topic']),
    update=extend_schema(tags=['Topic']),
    partial_update=extend_schema(tags=['Topic']),
    destroy=extend_schema(tags=['Topic']),
)
class TopicViewSet(viewsets.ModelViewSet):
    queryset=Topic.objects.all()
    permission_classes=[permissions.AllowAny]
    serializer_class=TopicSerializer


@extend_schema_view(
    list=extend_schema(tags=['Question']),
    retrieve=extend_schema(tags=['Question']),
    create=extend_schema(tags=['Question']),
    update=extend_schema(tags=['Question']),
    partial_update=extend_schema(tags=['Question']),
    destroy=extend_schema(tags=['Question']),
)
class QuestionViewSet(viewsets.ModelViewSet):
    queryset=Question.objects.all()
    permission_classes=[permissions.AllowAny]
    serializer_class=QuestionSerializer


@extend_schema_view(
    list=extend_schema(tags=['Exam']),
    retrieve=extend_schema(tags=['Exam']),
    create=extend_schema(tags=['Exam']),
    update=extend_schema(tags=['Exam']),
    partial_update=extend_schema(tags=['Exam']),
    destroy=extend_schema(tags=['Exam']),
)
class ExamViewSet(viewsets.ModelViewSet):
    queryset=Exam.objects.all()
    permission_classes=[permissions.AllowAny]
    serializer_class=ExamSerializer



