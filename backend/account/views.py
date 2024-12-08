from django.shortcuts import get_object_or_404, render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializer import UserSerializer,TeacherSerializer,StudentSerializer
from .models import User
from rest_framework import status
from rest_framework.authtoken.models import Token
from drf_spectacular.utils import extend_schema,OpenApiParameter


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
                } 
            },
            'required': ['nombre', 'edad'] 
        } 
    },
    responses={201: UserSerializer}, 
    
)
@api_view(['POST'])
def login(request):
    user= get_object_or_404(User,username=request.data['username'])
    
    if not user.check_password(request.data['password']):
        return Response({'error': "Invalid Password"},status=status.HTTP_400_BAD_REQUEST)

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

