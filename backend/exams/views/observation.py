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


@extend_schema(
    methods=['GET'],
    responses={
        200:ObservationSerializer,
        404: OpenApiResponse(description='Primary key not found.')}
)
@extend_schema(
    methods=['PUT'],
    request=ObservationSerializer,
    responses={
        201:ObservationSerializer,
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
            return Response(serializer.data,status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        observation.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
   
   
@extend_schema(
    methods=['GET'],
    responses={
        200:OpenApiResponse(description='OK'),
        404: OpenApiResponse(description='Primary key not found')
    }
)
@api_view(['GET'])
def exam_observations(request,pk):
    """
    Obtain all observations of an exam.

    """
    exam=get_object_or_404(Exam,pk)
    observations=Observation.objects.filter(exam=exam)
    serializer=ObservationSerializer(observations,many=True)
    return Response(serializer.data)


