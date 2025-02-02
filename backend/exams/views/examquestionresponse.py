from drf_spectacular.utils import extend_schema,OpenApiResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from questions.serializer import QuestionSerializer
from ..serializer import *
from ..models import *



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


@extend_schema(
    methods=['GET'],
    responses={
        200:ExamQuestionResponseSerializer,
        404: OpenApiResponse(description='Primary key not found.')}
)
@extend_schema(
    methods=['PUT'],
    request=ExamQuestionResponseSerializer,
    responses={
        201:ExamQuestionResponseSerializer,
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
            return Response(serializer.data,status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        examquestionresponse.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
