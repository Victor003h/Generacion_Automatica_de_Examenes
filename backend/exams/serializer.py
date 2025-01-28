from rest_framework import serializers
from .models import *

class ExamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exam
        fields = '__all__'
        
        
class ValidatedExamSerializer(serializers.ModelSerializer):
    class Meta:
        model = ValidatedExam
        fields = '__all__'
        

class ExamDoneSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExamDone
        fields = '__all__'
        

class ExamQuestionResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExamQuestionResponse
        fields = '__all__'
        