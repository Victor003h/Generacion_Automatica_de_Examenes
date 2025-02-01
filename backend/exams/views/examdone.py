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
    responses={200:ExamDoneSerializer(many=True)}
)
@extend_schema(
    methods=['POST'],
    request=ExamDoneSerializer,
    responses={
        201:ExamDoneSerializer,
        400: OpenApiResponse(description='Bad resquest')}
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


@extend_schema(
    methods=['GET'],
    responses={
        200:ExamDoneSerializer,
        404: OpenApiResponse(description='Primary key not found.')}
)
@extend_schema(
    methods=['PUT'],
    request=ExamDoneSerializer,
    responses={
        201:ExamDoneSerializer,
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
            return Response(serializer.data,status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        examdone.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    
@extend_schema(
    methods=['GET'],
    responses={
        200:ExamQuestionResponseSerializer(many=True),
        404:OpenApiResponse(description="Primary key not found")
    }
)
@api_view(['GET'])
def questions_response(request,pk):
    """
    Obtains all the question response in an exam done.

    """
    examdone=get_object_or_404(ExamDone,pk=pk)
    questions_response=examdone.examquestionresponse_set.all()
    serializer=ExamQuestionResponseSerializer(questions_response,many=True)
    return Response(serializer.data,status=status.HTTP_200_OK)



@extend_schema(
    methods=['GET'],
    responses={
        200:ExamDoneSerializer(many=True),
        404:OpenApiResponse(description="Primary key not found")
    }
)
@api_view(['GET'])
def subject_examsdone(request,pk):
    """
    Obtains all the exams done of a subject.

    """
    
    subject=get_object_or_404(Subject,pk=pk)
    examsdone=ExamDone.objects.filter(exam__subject=subject)
    serializer=ExamDoneSerializer(examsdone,many=True)
    return Response(serializer.data)


@extend_schema(
    methods=['GET'],
    responses={
        200:ExamDoneSerializer(many=True),
        404:OpenApiResponse(description="Primary key not found")
    }
)
@api_view(['GET'])
def examsdone_ungraded(request,pk):
    """
    Obtains all the exams done ungraded of a subject

    """
    subject= get_object_or_404(Subject,pk=pk)
    examdone=ExamDone.objects.filter(exam__subject=subject)
    examsgrade=ExamGrade.objects.filter(examdone__exam__subject=subject)
    exams_ungraded=ExamDone.objects.exclude(id__in=examsgrade.values('examdone_id'))
    serializer=ExamDoneSerializer(exams_ungraded,many=True)
    return Response(serializer.data)



@extend_schema(
    methods=['GET'],
    responses={
        200:ExamDoneSerializer(many=True),
        404:OpenApiResponse(description="Primary key not found")
    }
)
@api_view(['GET'])
def examsdone_ungraded(request,pk):
    """
    Obtains all the exams done ungraded of a subject

    """
    subject= get_object_or_404(Subject,pk=pk)
    examdone=ExamDone.objects.filter(exam__subject=subject)
    examsgrade=ExamGrade.objects.filter(examdone__exam__subject=subject)
    exams_ungraded=ExamDone.objects.exclude(id__in=examsgrade.values('examdone_id'))
    serializer=ExamDoneSerializer(exams_ungraded,many=True)
    return Response(serializer.data)
