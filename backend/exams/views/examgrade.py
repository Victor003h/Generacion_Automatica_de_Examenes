from django.shortcuts import get_object_or_404
from drf_spectacular.utils import extend_schema,OpenApiResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from questions.serializer import QuestionSerializer
from ..serializer import *
from ..models import *



@extend_schema(
    methods=['GET'],
    responses={200:ExamGradeSerializer(many=True)}
)
@extend_schema(
    methods=['POST'],
    request=ExamGradeSerializer,
    responses={
        201:ExamGradeSerializer,
        400: OpenApiResponse(description='Bad resquest')
    }
)
@api_view(['GET','POST'])
def examgrade_list(request):
    if request.method=='GET':
        examgrade=ExamGrade.objects.all()
        serializer=ExamGradeSerializer(examgrade,many=True)
        return Response(serializer.data)

    serializer=ExamGradeSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data,status=status.HTTP_201_CREATED)
    return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)


@extend_schema(
    methods=['GET'],
    responses={
        200:ExamGradeSerializer,
        404: OpenApiResponse(description='Primary key not found.')}
)
@extend_schema(
    methods=['PUT'],
    request=ExamGradeSerializer,
    responses={
        201:ExamGradeSerializer,
        400: OpenApiResponse(description='Bad resquest.'),
        404: OpenApiResponse(description='Primary key not found.')}
)
@extend_schema(
    methods=['DELETE'],
    responses={
        204: OpenApiResponse(description='It was successfully removed.'),
        404: OpenApiResponse(description='Primary key not found.')}
)
@api_view(['GET', 'PUT', 'DELETE'])
def examgrade_detail(request, pk):

    try:
        observation = ExamGrade.objects.get(pk=pk)
    except ExamGrade.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = ExamGradeSerializer(observation)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = ExamGradeSerializer(observation, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        observation.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@extend_schema(
    methods=['GET'],
    responses={
        200:ExamGradeSerializer(many=True),
        404:OpenApiResponse(description="Primary key not found")
    }
)
@api_view(['GET'])
def student_examgrade(request,pk):
    """
    Obtains all the exams grade of a student.

    """
    student=get_object_or_404(Student,pk=pk)
    examgrade=ExamGrade.objects.filter(examdone__student=student)
    serializer=ExamGradeSerializer(examgrade,many=True)
    return Response(serializer.data)
    