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
   
   