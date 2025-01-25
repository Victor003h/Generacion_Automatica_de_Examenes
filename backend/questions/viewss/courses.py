from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import viewsets ,permissions,status

from account.models import Teacher
from account.serializer import TeacherSerializer
from ..models import Exam, Question, Subject, Topic,Course
from ..serializer import ExamSerializer, QuestionSerializer, SubjectSerializer,TopicSerializer,CourseSerializer
from rest_framework import viewsets
from drf_spectacular.utils import extend_schema, extend_schema_view,OpenApiResponse


@extend_schema(
    methods=['GET'],
    responses={200:CourseSerializer(many=True)}
)
@extend_schema(
    methods=['POST'],
    request=CourseSerializer,
    responses={
        201:CourseSerializer,
        400: OpenApiResponse(description='Bad resquest')
    }
)
@api_view(['GET','POST'])
def course_list(request):
    if request.method=='GET':
        courses=Course.objects.all()
        serializer=CourseSerializer(courses,many=True)
        return Response(serializer.data)

    serializer=CourseSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data,status=status.HTTP_201_CREATED)
    return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def course_detail(request, pk):

    try:
        course = Course.objects.get(pk=pk)
    except Course.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = CourseSerializer(course)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = CourseSerializer(course, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        course.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

