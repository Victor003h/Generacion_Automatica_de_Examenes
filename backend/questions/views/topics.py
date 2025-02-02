from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import viewsets ,permissions,status
from ..models import *
from ..serializer import *
from drf_spectacular.utils import extend_schema, extend_schema_view,OpenApiResponse


@extend_schema(
    methods=['GET'],
    responses={200:TopicSerializer(many=True)}
)
@extend_schema(
    methods=['POST'],
    request=TopicSerializer,
    responses={
        201:TopicSerializer,
        400: OpenApiResponse(description='Bad resquest')
    }
)
@api_view(['GET','POST'])
def topic_list(request):
    if request.method=='GET':
        topic=Topic.objects.all()
        serializer=TopicSerializer(topic,many=True)
        return Response(serializer.data)

    serializer=TopicSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data,status=status.HTTP_201_CREATED)
    return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

@extend_schema(
    methods=['GET'],
    responses={
        200:TopicSerializer,
        404: OpenApiResponse(description='Primary key not found.'),
    }
)
@extend_schema(
    methods=['PUT'],
    request=TopicSerializer,
    responses={
        201:TopicSerializer,
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
def topic_detail(request, pk):

    try:
        topic = Topic.objects.get(pk=pk)
    except Topic.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = TopicSerializer(topic)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = TopicSerializer(topic, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        topic.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
@extend_schema(
    methods=['GET'],
    responses={
        200:SubjectSerializer,
        404:OpenApiResponse(description="Primary key not fount.")}
)
@api_view(['GET'])
def topic_subject(request,topic_id):
    """
    Obtains the subject to which the topic belongs.

    """
    try:
        topic=Topic.objects.get(pk=topic_id)
    except Topic.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
        
    subject=topic.Subject
    serializer=SubjectSerializer(subject)
    return Response(serializer.data,status=status.HTTP_200_OK)

@extend_schema(
    methods=['GET'],
    responses={
        200:QuestionSerializer,
        404:OpenApiResponse(description="Primary key not fount.")}
)
@api_view(['GET'])
def topic_question(request,topic_id):
    """
    Obtain all the questions of a topic.
    
    """
    try:
        topic=Topic.objects.get(pk=topic_id)
    except Topic.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
        
    questions=Question.objects.filter(topic=topic)
    serializer=QuestionSerializer(questions,many=True)
    return Response(serializer.data,status=status.HTTP_200_OK)


# views.py
import csv
from django.http import HttpResponse
@api_view(['POST'])
def export_csv(request):
    # Crear la respuesta HTTP con el tipo de contenido de CSV
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="data.csv"'

    # Crear un escritor de CSV
    writer = csv.writer(response)
    
    # Escribir el encabezado del CSV
    writer.writerow(['ID', 'Nombre', 'Edad'])

    # Escribir algunas filas de ejemplo (puedes reemplazar esto con tus datos reales)
    data = [
        [1, 'Alice', 30],
        [2, 'Bob', 25],
        [3, 'Charlie', 35]
    ]
    
    for row in data:
        writer.writerow(row)

    return response
