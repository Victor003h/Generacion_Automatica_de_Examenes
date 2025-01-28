from django.shortcuts import render
from drf_spectacular.utils import extend_schema, extend_schema_view,OpenApiResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from questions.serializer import QuestionSerializer
from .serializer import *
from .models import *


#EXAMS
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
    
@api_view(['GET'])
def exam_questions(request,pk):
    try:
        exam = Exam.objects.get(pk=pk)
    except Exam.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    questions=exam.questions.all()
    serializer=QuestionSerializer(questions,many=True)
    return Response(serializer.data,status=status.HTTP_200_OK)
    
    
    
# VALIDATED EXAM
@extend_schema(
    methods=['GET'],
    responses={200:ValidatedExamSerializer(many=True)}
)
@extend_schema(
    methods=['POST'],
    request=ValidatedExamSerializer,
    responses={
        201:ValidatedExamSerializer,
        400: OpenApiResponse(description='Bad resquest')
    }
)
@api_view(['GET','POST'])
def validated_exam_list(request):
    if request.method=='GET':
        validatedexam=ValidatedExam.objects.all()
        serializer=ValidatedExamSerializer(validatedexam,many=True)
        return Response(serializer.data)

    serializer=ValidatedExamSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data,status=status.HTTP_201_CREATED)
    return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def validated_exam_detail(request, pk):

    try:
        validatedexam = ValidatedExam.objects.get(pk=pk)
    except ValidatedExam.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = ValidatedExamSerializer(validatedexam)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = ValidatedExamSerializer(validatedexam, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        validatedexam.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
@api_view(['GET'])
def isvalidated(request,pk):
    try:
        exam=Exam.objects.get(pk=pk)
    except Exam.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if ValidatedExam.objects.filter(exam=exam).exists():
        return Response(status=status.HTTP_200_OK)
    
    return Response (status=status.HTTP_404_NOT_FOUND) 
    

# EXAM DONE
@extend_schema(
    methods=['GET'],
    responses={200:ExamDoneSerializer(many=True)}
)
@extend_schema(
    methods=['POST'],
    request=ExamDoneSerializer,
    responses={
        201:ExamDoneSerializer,
        400: OpenApiResponse(description='Bad resquest')
    }
)
@api_view(['GET','POST'])
def exam_done_list(request):
    if request.method=='GET':
        examdone=ExamDone.objects.all()
        serializer=ExamDoneSerializer(examdone,many=True)
        return Response(serializer.data)

    serializer=ExamDoneSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data,status=status.HTTP_201_CREATED)
    return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def exam_done_detail(request, pk):

    try:
        examdone = ExamDoneSerializer.objects.get(pk=pk)
    except ExamDoneSerializer.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = ExamDoneSerializer(examdone)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = ExamDoneSerializer(examdone, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        examdone.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    
# EXAM QUESTION RESPONSE
@extend_schema(
    methods=['GET'],
    responses={200:ExamQuestionResponseSerializer(many=True)}
)
@extend_schema(
    methods=['POST'],
    request=ExamQuestionResponseSerializer,
    responses={
        201:ExamQuestionResponseSerializer,
        400: OpenApiResponse(description='Bad resquest')
    }
)
@api_view(['GET','POST'])
def exam_question_response_list(request):
    if request.method=='GET':
        examquestionresponse=ExamQuestionResponse.objects.all()
        serializer=ExamQuestionResponseSerializer(examquestionresponse,many=True)
        return Response(serializer.data)

    serializer=ExamQuestionResponseSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data,status=status.HTTP_201_CREATED)
    return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def exam_question_response_detail(request, pk):

    try:
        examquestionresponse = ExamQuestionResponseSerializer.objects.get(pk=pk)
    except ExamQuestionResponseSerializer.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = ExamQuestionResponseSerializer(examquestionresponse)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = ExamQuestionResponseSerializer(examquestionresponse, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        examquestionresponse.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    


