from rest_framework import serializers
from .models import User,Teacher,Student



class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model=User
        fields=['id','username','email','password','first_name','last_name','last_name2']
        

class TeacherSerializer(serializers.ModelSerializer):
    class Meta:
        model=Teacher
        fields=['first_name','email','password','last_name','last_name2','speciality']
        extra_kwargs={'password': {'write_only':True } }
        

    def create(self, validated_data): 
        if 'username' not in validated_data: 
            validated_data['username'] = validated_data['first_name'] 
            user = Teacher(**validated_data) 
            user.set_password(validated_data['password']) 
            user.save() 
            return user

class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model=Student
        fields=['first_name','email','password','last_name','last_name2','age','course']
        extra_kwargs={'password': {'write_only':True } }
        
    def create(self, validated_data): 
        if 'username' not in validated_data: 
            validated_data['username'] = validated_data['first_name'] 
            user = Student(**validated_data) 
            user.set_password(validated_data['password']) 
            user.save() 
            return user
        