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
    responses={200:ReevaluatedExamSerializer(many=True)}
)
@extend_schema(
    methods=['POST'],
    request=ReevaluatedExamSerializer,
    responses={
        201:ReevaluatedExamSerializer,
        400: OpenApiResponse(description='Bad resquest')
    }
)
@api_view(['GET','POST'])
def reevaluated_exam_list(request):
    if request.method=='GET':
        reevaluatedExam=ReevaluatedExam.objects.all()
        serializer=ReevaluatedExamSerializer(reevaluatedExam,many=True)
        return Response(serializer.data)

    serializer=ReevaluatedExamSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data,status=status.HTTP_201_CREATED)
    return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)


@extend_schema(
    methods=['GET'],
    responses={
        200:ReevaluatedExamSerializer,
        404: OpenApiResponse(description='Primary key not found.')}
)
@extend_schema(
    methods=['PUT'],
    request=ReevaluatedExamSerializer,
    responses={
        201:ReevaluatedExamSerializer,
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
def reevaluated_exam_detail(request, pk):

    try:
        reevaluatedExam = ReevaluatedExam.objects.get(pk=pk)
    except ReevaluatedExam.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = ReevaluatedExamSerializer(reevaluatedExam)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = ReevaluatedExamSerializer(reevaluatedExam, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        reevaluatedExam.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@extend_schema(
    methods=['GET'],
    responses={
        200:ReevaluatedExamSerializer(many=True),
        404:OpenApiResponse(description="Primary key not found")
    }
)
def teacher_reevaluatedexam(request,pk):
    """
    Obtain all the re-evaluated exam of a teacher 

    """
    teacher=get_object_or_404(Teacher,pk=pk)
    reevaluatedexam=ReevaluatedExam.objects.filter(teacher=pk)
    serializer=ReevaluatedExamSerializer(reevaluatedexam,many=True)
    return Response(serializer.data)