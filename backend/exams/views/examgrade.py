from  datetime import timedelta
import json
from django.shortcuts import get_object_or_404
from django.db.models import Count
from django.utils import timezone
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
    
    
    
@extend_schema(
    methods=['GET'],
    responses={
        200:OpenApiResponse(description="Ok"),
    }
)
@api_view(['GET'])
def teacher_examgraded_detail(request,months):
    """
    Detailed record of the teachers who have reviewed exams in the last months.

    """
    today=timezone.now().date()
    range=today - timedelta(days=months*31)
    examgrades=ExamGrade.objects.filter(date__gte=range)
    
    details=examgrades.values('teacher','examdone__exam__subject').annotate(num_exam_grade=Count('id'))
    
    result=[]
    for  detail in details:
        result.append({
            'teacher' : detail['teacher'],
            'subject' : detail['examdone__exam__subject'],
            'num_exam_grade': detail['num_exam_grade']
            })
     
    jsonresult=json.dumps(result, ensure_ascii=False,indent=4)
    return Response(jsonresult)




@extend_schema(
    methods=['GET'],
    responses={
        200: OpenApiResponse(description="OK"),
        404:OpenApiResponse(description="Primary key not found")
    }
)
@api_view(['GET'])
def is_reevaluated(request,pk):
    """
    Check if an exam grade is a revaluated exam.

    """
    examgrade=get_object_or_404(ExamGrade,pk=pk)
    try:
        reevaluated_exam = ReevaluatedExam.objects.get(examgrade=examgrade)
        return Response({'reevaluated : True'},status=status.HTTP_200_OK)
    except ReevaluatedExam.DoesNotExist:
        return Response({'reevaluated : False'},status=status.HTTP_200_OK)

    
    
