from rest_framework import serializers
from .models import User,Teacher,Student



class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model=User
        fields=['id','username','email','password','first_name']
