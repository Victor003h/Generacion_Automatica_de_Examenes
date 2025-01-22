from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import viewsets ,permissions,status

from account.models import Teacher
from .models import Exam, Question, Subject, Topic
from .serializer import ExamSerializer, QuestionSerializer, SubjectSerializer,TopicSerializer
from rest_framework import viewsets
from drf_spectacular.utils import extend_schema, extend_schema_view,OpenApiResponse

# @extend_schema_view(
#     list=extend_schema(tags=['Subjects']),
#     retrieve=extend_schema(tags=['Subjects']),
#     create=extend_schema(tags=['Subjects']),
#     update=extend_schema(tags=['Subjects']),
#     partial_update=extend_schema(tags=['Subjects']),
#     destroy=extend_schema(tags=['Subjects']),
# )
# class SubjectViewSet(viewsets.ModelViewSet):
#     queryset=Subject.objects.all()
#     permission_classes=[permissions.AllowAny]
#     serializer_class=SubjectSerializer
    
# @extend_schema_view(
#     list=extend_schema(tags=['Topic']),
#     retrieve=extend_schema(tags=['Topic']),
#     create=extend_schema(tags=['Topic']),
#     update=extend_schema(tags=['Topic']),
#     partial_update=extend_schema(tags=['Topic']),
#     destroy=extend_schema(tags=['Topic']),
# )
# class TopicViewSet(viewsets.ModelViewSet):
#     queryset=Topic.objects.all()
#     permission_classes=[permissions.AllowAny]
#     serializer_class=TopicSerializer

# @extend_schema_view(
#     list=extend_schema(tags=['Question']),
#     retrieve=extend_schema(tags=['Question']),
#     create=extend_schema(tags=['Question']),
#     update=extend_schema(tags=['Question']),
#     partial_update=extend_schema(tags=['Question']),
#     destroy=extend_schema(tags=['Question']),
# )
# class QuestionViewSet(viewsets.ModelViewSet):
#     queryset=Question.objects.all()
#     permission_classes=[permissions.AllowAny]
#     serializer_class=QuestionSerializer

# @extend_schema_view(
#     list=extend_schema(tags=['Exam']),
#     retrieve=extend_schema(tags=['Exam']),
#     create=extend_schema(tags=['Exam']),
#     update=extend_schema(tags=['Exam']),
#     partial_update=extend_schema(tags=['Exam']),
#     destroy=extend_schema(tags=['Exam']),
# )
# class ExamViewSet(viewsets.ModelViewSet):
#     queryset=Exam.objects.all()
#     permission_classes=[permissions.AllowAny]
#     serializer_class=ExamSerializer


########## EXAMAN
@extend_schema(
    methods=['GET'],
    responses={200:ExamSerializer(many=True)}
)
@extend_schema(
    methods=['POST'],
    request=ExamSerializer,
    responses={
        201:ExamSerializer,
        400: OpenApiResponse(description='Bad resquest')
    }
)
@api_view(['GET','POST'])
def exam_list(request):
    if request.method=='GET':
        exam=Exam.objects.all()
        serializer=ExamSerializer(exam,many=True)
        return Response(serializer.data)

    serializer=ExamSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data,status=status.HTTP_201_CREATED)
    return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def exam_detail(request, pk):

    try:
        exam = Exam.objects.get(pk=pk)
    except Exam.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = ExamSerializer(exam)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = ExamSerializer(exam, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        exam.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    
    
    
