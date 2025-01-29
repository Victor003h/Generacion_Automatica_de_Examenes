from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import viewsets ,permissions,status
from ..models import *
from ..serializer import *
from drf_spectacular.utils import extend_schema, extend_schema_view,OpenApiResponse


@extend_schema(
    methods=['GET'],
    responses={200:QuestionSerializer(many=True)}
)
@extend_schema(
    methods=['POST'],
    request=QuestionSerializer,
    responses={
        201:QuestionSerializer,
        400: OpenApiResponse(description='Bad resquest')
    }
)
@api_view(['GET','POST'])
def question_list(request):
    if request.method=='GET':
        question=Question.objects.all()
        serializer=QuestionSerializer(question,many=True)
        return Response(serializer.data)

    serializer=QuestionSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data,status=status.HTTP_201_CREATED)
    return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def question_detail(request, pk):

    try:
        question = Question.objects.get(pk=pk)
    except Question.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = QuestionSerializer(question)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = QuestionSerializer(question, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        question.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    

@api_view(['GET'])
def question_topic(request,question_id):
    """
    Obtains the topic to which the question belongs.

    """
    try:
        question=Question.objects.get(pk=question_id)
    except Question.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
        
    topic=question.topic
    serializer=TopicSerializer(topic)
    return Response(serializer.data,status=status.HTTP_200_OK)
