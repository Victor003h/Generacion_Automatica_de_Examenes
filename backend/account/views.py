from django.shortcuts import get_object_or_404, render
from rest_framework.decorators import api_view 
from rest_framework.response import Response
from .serializer import *
from .models import *
from rest_framework import status
from rest_framework.authtoken.models import Token
from drf_spectacular.utils import extend_schema,OpenApiResponse


@extend_schema(
    request={ 
        'application/json':{ 
            'type': 'object', 
            'properties': {
                'username': { 
                    'type': 'string',  
                }, 
                'password': { 
                    'type': 'string', 
                },
                'role': { 
                    'type': 'string', 
                }
                
            },
            'required': ['nombre', 'edad'] 
        } 
    },
    responses={201: UserSerializer}, 
    
)
@api_view(['POST'])
def login(request):
    print(request)
    user= get_object_or_404(User,username=request.data['username'])
    
    if not user.check_password(request.data['password']):
        return Response({'error': "Invalid Password"},status=status.HTTP_400_BAD_REQUEST)

    if request.data['role']=='teacher' :
        try:
            teacher = Teacher.objects.get(pk=user.pk)
        except Teacher.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
    elif request.data['role']=='student':    
        try:
            student = Student.objects.get(pk=user.pk)
        except Student.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
    elif request.data['role']=='admin':
        try:
            user = User.objects.get(pk=user.pk)
            if not user.is_superuser:
                return Response(status=status.HTTP_401_UNAUTHORIZED)
        except Teacher.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
        
    token,created=Token.objects.get_or_create(user=user)
    serializer=UserSerializer(instance=user)
    
    return Response({'token': token.key, 'user':serializer.data},status=status.HTTP_200_OK)



@extend_schema(
    request=TeacherSerializer, 
    responses={201: TeacherSerializer}, 
)
@api_view(['POST'])
def teacher_register(request):
    serializer=TeacherSerializer(data=request.data)
    print(request.data)
    if serializer.is_valid():
        serializer.save()    
      
        return Response({'user': serializer.data},status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)


@extend_schema(
    request=StudentSerializer, 
    responses={201: StudentSerializer}, 
)
@api_view(['POST'])
def student_register(request):
    serializer=StudentSerializer(data=request.data)
    
    if serializer.is_valid():
        serializer.save()    
      
        return Response({'user': serializer.data},status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)


@extend_schema(
    methods=['GET'],
    responses={200:TeacherSerializer(many=True)}
)
@extend_schema(
    methods=['POST'],
    request=TeacherSerializer,
    responses={
        201:TeacherSerializer,
        400: OpenApiResponse(description='Bad resquest')
    }
)
@api_view(['GET','POST'])
def teacher_list(request):
    if request.method=='GET':
        teacher=Teacher.objects.all()
        serializer=TeacherSerializer(teacher,many=True)
        return Response(serializer.data)

    serializer=TeacherSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data,status=status.HTTP_201_CREATED)
    return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def teacher_detail(request, pk):

    try:
        teacher = Teacher.objects.get(pk=pk)
    except Teacher.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = TeacherSerializer(teacher)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = TeacherSerializer(teacher, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        teacher.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    


@extend_schema(
    methods=['GET'],
    responses={200:StudentSerializer(many=True)}
)
@extend_schema(
    methods=['POST'],
    request=StudentSerializer,
    responses={
        201:StudentSerializer,
        400: OpenApiResponse(description='Bad resquest')
    }
)
@api_view(['GET','POST'])
def student_list(request):
    if request.method=='GET':
        student=Student.objects.all()
        serializer=StudentSerializer(student,many=True)
        return Response(serializer.data)

    serializer=StudentSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data,status=status.HTTP_201_CREATED)
    return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def student_detail(request, pk):

    try:
        student = Student.objects.get(pk=pk)
    except Student.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = StudentSerializer(student)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = StudentSerializer(student, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        student.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    

@api_view(['GET'])
def getUser(request,id):
    try:
        user=User.objects.get(pk=id)
    except User.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    serializer=UserSerializer(user)
    return Response(serializer.data,status=status.HTTP_200_OK)






@extend_schema(
    methods=['GET'],
    responses={200:CourseSerializer(many=True)}
)
@extend_schema(
    methods=['POST'],
    request=CourseSerializer,
    responses={
        201:CourseSerializer,
        400: OpenApiResponse(description='Bad resquest')
    }
)
@api_view(['GET','POST'])
def course_list(request):
    if request.method=='GET':
        courses=Course.objects.all()
        serializer=CourseSerializer(courses,many=True)
        return Response(serializer.data)

    serializer=CourseSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data,status=status.HTTP_201_CREATED)
    return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def course_detail(request, pk):

    try:
        course = Course.objects.get(pk=pk)
    except Course.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = CourseSerializer(course)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = CourseSerializer(course, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        course.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

