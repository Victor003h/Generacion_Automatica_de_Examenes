from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from .models import *

class ExamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exam
        fields = '__all__'
        
    def validate_questions(self,value):
        subject= self.instance.subject if self.instance else self.initial_data.get('subject')
        
        for question in value:
            if question.topic.Subject.id != subject.id:
                
                raise ValidationError(f' Question "{question.id}"  does not belong to the subject "{subject.id}. not "')
            
        return value
    
    def validate(self, attrs):
        return super().validate(attrs)
        
    

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
        
        
    def validate_exam(self,value):
        if value.state!="V":
            raise ValidationError(f' Exam "{value.id} must be validated."')
            
        return value
        
    
    def validate(self, attrs):
        return super().validate(attrs)
    
        
        
    
        
class ExamGradeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExamGrade
        fields = '__all__'
        
class ReevaluatedExamSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReevaluatedExam
        fields = '__all__'
        

class ExamQuestionResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExamQuestionResponse
        fields = '__all__'
        