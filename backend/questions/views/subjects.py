from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import viewsets ,permissions,status
from account.models import *
from account.serializer import TeacherSerializer
from ..models import *
from ..serializer import *
from drf_spectacular.utils import extend_schema, extend_schema_view,OpenApiResponse


@extend_schema(
    methods=['GET'],
    responses={200:SubjectSerializer(many=True)}
)
@extend_schema(
    methods=['POST'],
    request=SubjectSerializer,
    responses={
        201:SubjectSerializer,
        400: OpenApiResponse(description='Bad resquest')
    }
)
@api_view(['GET','POST'])
def subject_list(request):
    if request.method=='GET':
        subjects=Subject.objects.all()
        serializer=SubjectSerializer(subjects,many=True)
        return Response(serializer.data)

    serializer=SubjectSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data,status=status.HTTP_201_CREATED)
    return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)


@extend_schema(
    methods=['GET'],
    responses={
        200:SubjectSerializer,
        404: OpenApiResponse(description='Primary key not found.'),
    }
)
@extend_schema(
    methods=['PUT'],
    request=SubjectSerializer,
    responses={
        201:SubjectSerializer,
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
def subject_detail(request, pk):

    try:
        subject = Subject.objects.get(pk=pk)
    except Subject.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = SubjectSerializer(subject)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = SubjectSerializer(subject, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        subject.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@extend_schema(
    methods=['GET'],
    responses={
        200:QuestionSerializer(many=True),
        404:OpenApiResponse(description="Primary key not found")}
)
@api_view(['GET'])
def subject_questions(request,subject_id):
    """
    Obtain all the questions of a subject.

    """
    try:
        subject = Subject.objects.get(pk=subject_id)
    except Subject.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    questions=Question.objects.filter(subject=subject)
    serializer=QuestionSerializer(questions,many=True)
    return Response(serializer.data,status=status.HTTP_200_OK)


@extend_schema(
    methods=['GET'],
    responses={
        200:TopicSerializer(many=True),
        404:OpenApiResponse(description="Primary key not found")}
)
@api_view(['GET'])
def subject_topics(request,subject_id):
    """
    Obtain all the topics of a subject.

    """
    try:
        subject=Subject.objects.get(pk=subject_id)
    except Subject.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
        
    topic=Topic.objects.filter(Subject=subject)
    serializer=TopicSerializer(topic,many=True)
    return Response(serializer.data,status=status.HTTP_200_OK)

@extend_schema(
    methods=['GET'],
    responses={
        200:SubjectSerializer(many=True),
        404:OpenApiResponse(description="Primary key not found")}
)
@api_view(['GET'])
def teacher_subjects(request,teacher_id):
    """
    To obtain all the subjects taught by a teacher.

    """
    
    try:
        teacher = Teacher.objects.get(pk=teacher_id)
    except Teacher.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    subjects=teacher.subjects.all()
    serializer=SubjectSerializer(subjects,many=True)
    return Response(serializer.data,status=status.HTTP_200_OK)




@extend_schema(
    methods=['GET'],
    responses={
        200:TeacherSerializer(many=True),
        404:OpenApiResponse(description="Primary key not found")}
)
@api_view(['GET'])
def subject_teachers(request,subject_id):
    """
    Obtain all the teacher of a subject.

    """
    try:
        subject = Subject.objects.get(pk=subject_id)
    except Teacher.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    teachers=subject.teachers_subject.all()
    serializer=TeacherSerializer(teachers,many=True)
    return Response(serializer.data,status=status.HTTP_200_OK)


@extend_schema(
    methods=['GET'],
    responses={
        200:TeacherSerializer,
        404:OpenApiResponse(description="Primary key not found")}
)
@api_view(['GET'])
def headofsubject(request,teacher_id):
    """
    Obtain the Head of the subject.

    """
    try:
        teacher=Teacher.objects.get(pk=teacher_id)
    except Teacher.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    

    subject=Subject.objects.filter(head_of_subject=teacher)
   
    
    serializer= SubjectSerializer(subject,many=True)
    return Response(serializer.data,status=status.HTTP_200_OK)

@extend_schema(
    methods=['GET'],
    responses={
        200:SubjectSerializer(many=True),
        404:OpenApiResponse(description="Primary key not found")}
)
@api_view(['GET'])
def student_subjects(request,pk):
    """
    To obtain all the subjects that a student is taking.

    """
    
    try:
        student=Student.objects.get(pk=pk)
    except Student.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    course=student.course
    subjects= Subject.objects.filter(course=course)
    serializer=SubjectSerializer(subjects,many=True)
    return Response(serializer.data,status=status.HTTP_200_OK)


