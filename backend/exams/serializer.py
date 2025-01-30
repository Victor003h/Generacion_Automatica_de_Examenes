from rest_framework import serializers
from .models import *

class ExamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exam
        fields = '__all__'
        
        
# class ValidatedExamSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = ValidatedExam
#         fields = '__all__'
        

class ExamDoneSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExamDone
        fields = '__all__'
        
class ObservationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Observation
        fields = '__all__'
        

class AssignedExamSerializer(serializers.ModelSerializer):
    class Meta:
        model = AssignedExam
        fields = '__all__'
        

class ExamQuestionResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExamQuestionResponse
        fields = '__all__'
        