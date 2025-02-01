from django.shortcuts import get_object_or_404
from django.db.models import Count
from drf_spectacular.utils import extend_schema,OpenApiResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from questions.serializer import QuestionSerializer
from ..serializer import *
from ..models import *
from django.utils import timezone
from datetime import timedelta




@extend_schema(
    methods=['GET'],
    responses={
        200:AssignedExamSerializer(many=True),
    }
)
@extend_schema(
    methods=['POST'],
    request=AssignedExamSerializer,
    responses={
        201:AssignedExamSerializer,
        400: OpenApiResponse(description='Bad resquest.')
    }
)
@api_view(['GET','POST'])
def assigned_exam_list(request):
    if request.method=='GET':
        assignedexam=AssignedExam.objects.all()
        serializer=AssignedExamSerializer(assignedexam,many=True)
        return Response(serializer.data)

    serializer=AssignedExamSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data,status=status.HTTP_201_CREATED)
    return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)


@extend_schema(
    methods=['GET'],
    responses={
        200:AssignedExamSerializer,
        404: OpenApiResponse(description='Primary key not found.'),
    }
)
@extend_schema(
    methods=['PUT'],
    request=AssignedExamSerializer,
    responses={
        201:AssignedExamSerializer,
        400: OpenApiResponse(description='Bad resquest.'),
        404: OpenApiResponse(description='Primary key not found.'),
    }
)
@extend_schema(
    methods=['DELETE'],
    responses={
        204: OpenApiResponse(description='It was successfully removed.'),
        404: OpenApiResponse(description='Primary key not found.'),
    }
)
@api_view(['GET', 'PUT', 'DELETE'])
def assigned_exam_detail(request, pk):

    try:
        assignedexam = AssignedExam.objects.get(pk=pk)
    except AssignedExam.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = AssignedExamSerializer(assignedexam)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = AssignedExamSerializer(assignedexam, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        assignedexam.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
   
   
@extend_schema(
    methods=['GET'],
    responses={
        200:QuestionSerializer(many=True),
        404:OpenApiResponse(description="Primary key not found.")
    }
)
@api_view(['GET'])   
def common_questions(request,pk):
    """
    Obtain the most commond used question in final exams

    """
    subject=get_object_or_404(Subject,pk=pk)
    
    questions=Question.objects.filter(
        exams__assignedexam__type='final',
        exams__subject=subject
    ).annotate(usage_count=Count('exams__assignedexam')).order_by('-usage_count')
    
    serializer=QuestionSerializer(questions,many=True)
    return Response(serializer.data)
    

@extend_schema(
    methods=['GET'],
    responses={
         200:QuestionSerializer(many=True),
        404:OpenApiResponse(description="Primary key not found.")
    }
)
@api_view(['GET'])  
def unused_questions(request,pk):
    """
    Questions not used in the last 2 years.

    """
    subject=get_object_or_404(Subject,pk=pk)
    today=timezone.now().date()
    range= today-timedelta(days=730)
    
    questions=Question.objects.exclude(exams__date__gte=range).distinct()
    serializer=QuestionSerializer(questions,many=True)
    return Response(serializer.data)