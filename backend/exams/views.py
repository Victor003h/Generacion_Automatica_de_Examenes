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

@extend_schema(
    methods=['GET','PUT','DELETE'],
   # responses={200:ExamQuestionResponseSerializer(many=True)}
)
@extend_schema(
    methods=['GET','PUT','DELETE'],
    request=ExamSerializer,
    responses={
        201:ExamSerializer,
        400: OpenApiResponse(description='Bad resquest'),
        404:OpenApiResponse(description='It was successfully removed.')
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
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        exam.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
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
 

@api_view(['GET'])
def exams_by_state(request,state):
    if state not in ['V', 'P','R']:
        return Response(status=status.HTTP_400_BAD_REQUEST)
    exams=Exam.objects.filter(state=state)
    serializer=ExamSerializer(exams,many=True)
    return Response(serializer.data,status=status.HTTP_200_OK)
   

#ASSIGNED EXAM
@extend_schema(
    methods=['GET'],
    responses={200:AssignedExamSerializer(many=True)}
)
@extend_schema(
    methods=['POST'],
    request=AssignedExamSerializer,
    responses={
        201:AssignedExamSerializer,
        400: OpenApiResponse(description='Bad resquest')
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
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        assignedexam.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    
# OBSERVATION
@extend_schema(
    methods=['GET'],
    responses={200:ObservationSerializer(many=True)}
)
@extend_schema(
    methods=['POST'],
    request=ObservationSerializer,
    responses={
        201:ObservationSerializer,
        400: OpenApiResponse(description='Bad resquest')
    }
)
@api_view(['GET','POST'])
def observation_list(request):
    if request.method=='GET':
        observation=Observation.objects.all()
        serializer=ObservationSerializer(observation,many=True)
        return Response(serializer.data)

    serializer=ObservationSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data,status=status.HTTP_201_CREATED)
    return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def observation_detail(request, pk):

    try:
        observation = Observation.objects.get(pk=pk)
    except Observation.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = ObservationSerializer(observation)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = ObservationSerializer(observation, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        observation.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
      

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
        examdone = ExamDone.objects.get(pk=pk)
    except ExamDone.DoesNotExist:
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
        examquestionresponse = ExamQuestionResponse.objects.get(pk=pk)
    except ExamQuestionResponse.DoesNotExist:
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




# # VALIDATED EXAM
# @extend_schema(
#     methods=['GET'],
#     responses={200:ValidatedExamSerializer(many=True)}
# )
# @extend_schema(
#     methods=['POST'],
#     request=ValidatedExamSerializer,
#     responses={
#         201:ValidatedExamSerializer,
#         400: OpenApiResponse(description='Bad resquest')
#     }
# )
# @api_view(['GET','POST'])
# def validated_exam_list(request):
#     if request.method=='GET':
#         validatedexam=ValidatedExam.objects.all()
#         serializer=ValidatedExamSerializer(validatedexam,many=True)
#         return Response(serializer.data)

#     serializer=ValidatedExamSerializer(data=request.data)
#     if serializer.is_valid():
#         serializer.save()
#         return Response(serializer.data,status=status.HTTP_201_CREATED)
#     return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

# @api_view(['GET', 'PUT', 'DELETE'])
# def validated_exam_detail(request, pk):

#     try:
#         validatedexam = ValidatedExam.objects.get(pk=pk)
#     except ValidatedExam.DoesNotExist:
#         return Response(status=status.HTTP_404_NOT_FOUND)

#     if request.method == 'GET':
#         serializer = ValidatedExamSerializer(validatedexam)
#         return Response(serializer.data)

#     elif request.method == 'PUT':
#         serializer = ValidatedExamSerializer(validatedexam, data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#     elif request.method == 'DELETE':
#         validatedexam.delete()
#         return Response(status=status.HTTP_204_NO_CONTENT)
    
# @api_view(['GET'])
# def isvalidated(request,pk):
#     """
#     Check if an exam is validated.

#     """
#     try:
#         exam=Exam.objects.get(pk=pk)
#     except Exam.DoesNotExist:
#         return Response(status=status.HTTP_404_NOT_FOUND)
    
#     if ValidatedExam.objects.filter(exam=exam).exists():
#         return Response(status=status.HTTP_200_OK)
    
#     return Response (status=status.HTTP_404_NOT_FOUND) 
    
