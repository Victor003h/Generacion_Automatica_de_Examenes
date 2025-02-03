import json
from django.shortcuts import get_object_or_404
from drf_spectacular.utils import extend_schema,OpenApiResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from questions.serializer import QuestionSerializer
from ..serializer import *
from ..models import *


#EXAMS
@extend_schema(
    methods=['GET'],
    responses={
        200:ExamSerializer(many=True),
    }
)
@extend_schema(
    methods=['POST'],
    request=ExamSerializer,
    responses={
        201:ExamSerializer,
        400: OpenApiResponse(description='Bad resquest.')
    }
)
@api_view(['GET','POST'])
def exam_list(request):
    if request.method=='GET':
        exam=Exam.objects.all()
        serializer=ExamSerializer(exam,many=True)
        return Response(serializer.data)

    serializer=ExamSerializer(data=request.data)
    if serializer.is_valid(raise_exception=True):
        serializer.save()
        return Response(serializer.data,status=status.HTTP_201_CREATED)
    return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)


@extend_schema(
    methods=['GET'],
    responses={
        200:ExamSerializer,
        404: OpenApiResponse(description='Primary key not found.'),
    }
)
@extend_schema(
    methods=['PUT'],
    request=ExamSerializer,
    responses={
        201:ExamSerializer,
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
            return Response(serializer.data,status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        exam.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@extend_schema(
    methods=['GET'],
    responses={
        200:QuestionSerializer(many=True),
        404: OpenApiResponse(description='Primary key not found.')
    }
)
@api_view(['GET'])
def exam_questions(request,pk):
    """
    Obtains all the question in an exam.

    """
    try:
        exam = Exam.objects.get(pk=pk)
    except Exam.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    questions=exam.questions.all()
    serializer=QuestionSerializer(questions,many=True)
    return Response(serializer.data,status=status.HTTP_200_OK)
 

@extend_schema(
    methods=['GET'],
    responses={
        200:ExamSerializer(many=True),
        400: OpenApiResponse(description='Bad resquest, incorrect state')
    }
)
@api_view(['GET'])
def exams_by_state(request,state):
    """
    Obtains all the exams for a specific state.

    """
    if state not in ['V', 'P','R']:
        return Response(status=status.HTTP_400_BAD_REQUEST)
    exams=Exam.objects.filter(state=state)
    serializer=ExamSerializer(exams,many=True)
    return Response(serializer.data,status=status.HTTP_200_OK)
   

@extend_schema(
    methods=['GET'],
    responses={
        200:ExamSerializer(many=True),
        400: OpenApiResponse(description='Bad resquest, incorrect state')
    }
)
@api_view(['GET'])
def subject_exams(request,pk):
    """
    Obtains all the exams of a subject.

    """
    
    subject=get_object_or_404(Subject,pk=pk)
    exams=Exam.objects.filter(subject=subject)
    serializer=ExamSerializer(exams,many=True)
    return Response(serializer.data,status=status.HTTP_200_OK)
   
@extend_schema(
    methods=['GET'],
    responses={
        204:OpenApiResponse(description='Its validated'),
        404: OpenApiResponse(description='Its not validated')
    }
)
@api_view(['GET'])
def isvalidated(request,pk):
    """
    Check if an exam is validated.

    """
    try:
        exam=Exam.objects.get(pk=pk)
    except Exam.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if exam.state=='V':
        return Response(status=status.HTTP_204_NO_CONTENT)
    return Response (status=status.HTTP_404_NOT_FOUND) 
    
 
 
@extend_schema(
    methods=['GET'],
    responses={
        200:OpenApiResponse(description='OK'),
        404: OpenApiResponse(description='Primary key not found')
    }
)
@api_view(['GET'])
def validatedby(request,pk):
    """
    Obtain all exam that was validated by a specific teacher.

    """
    teacher=get_object_or_404(Teacher,pk)
    exams=Exam.objects.filter(teacher=teacher)
    serializers=ExamSerializer(exams,many=True)
    return Response(serializers.data,status=status.HTTP_200_OK)
    
 