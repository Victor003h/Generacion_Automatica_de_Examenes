from django.db.models import Count
import json
from django.utils import timezone
from datetime import timedelta
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import viewsets ,permissions,status
from drf_spectacular.utils import extend_schema, extend_schema_view,OpenApiResponse

from questions.serializer import QuestionSerializer
from exams.models import *
from exams.serializer import *
from .exporterfactory import ExporterFactory


@extend_schema(
    methods=['POST'],
    request={
        'application/json': {
            'type' : 'object',
            'properties': {
                'title':{
                    'type' : 'string'
                },
                'content':{
                    'type' : 'str'
                }
            },
        }
    },
)
@api_view(['POST'])
def export_document(request,extension):
    """
    Export of documents to various formats.    

    """
    data = request.data.get('content')
    
    title = request.data.get('title')
    file_name = f'{title}.{extension}'
    
    try:
        exporter = ExporterFactory.get_exporter(extension)
        response=exporter.export(data, file_name)
        
        return response
    except ValueError as e:
        return Response({'error': str(e)}, status=400)




@extend_schema(
    methods=['GET'],
    responses={
        200:ExamSerializer(many=True),
        400: OpenApiResponse(description='Bad resquest, incorrect state')
    }
)
@api_view(['GET'])
def subject_exams(request,pk):
    """
    Obtains all the exams of a subject.

    """
    
    subject=get_object_or_404(Subject,pk=pk)
    exams=Exam.objects.filter(subject=subject)
    serializer=ExamSerializer(exams,many=True)
    result=[{"exam":exam.id,"date":exam.date,"creator":exam.teacher.first_name} for exam in exams]
    return Response(result,status=status.HTTP_200_OK)
   
   
   
@extend_schema(
    methods=['GET'],
    responses={
        200:OpenApiResponse(description='OK'),
        404: OpenApiResponse(description='Primary key not found')
    }
)
@api_view(['GET'])
def validatedby(request,pk):
    """
    Obtain all exam that was validated by a specific teacher.

    """
    teacher=get_object_or_404(Teacher,pk)
    exams=Exam.objects.filter(teacher=teacher)
    serializers=ExamSerializer(exams,many=True)
    return Response(serializers.data,status=status.HTTP_200_OK)
    
@api_view(['GET'])
def exam_compare(request):
    subjects = set(Exam.objects.values_list('subject__name', flat=True))
    report = []

    for subject in subjects:
        exams = Exam.objects.filter(subject__name=subject)
        questions_distribution = {}
        questionsTotal = 0
        questions_used=[]
        for exam in exams:
            for question in exam.questions.all():
                if questions_used.__contains__(question.pk):    continue
                topic = question.topic.name
                diff = question.get_difficulty_display()

                if topic not in questions_distribution:
                    questions_distribution[topic] = {'Easy': 0, 'Medium': 0, 'Difficult': 0}

                questions_distribution[topic][diff] += 1
                questionsTotal += 1
                questions_used.append(question.pk)

        criterios_equilibrio = all(
            all(dificultad_count > 0 for dificultad_count in dificultades.values())
            for dificultades in questions_distribution.values()
        )

        report.append({
            'asignatura': subject,
            'distribucion_preguntas': questions_distribution,
            'total_preguntas': questionsTotal,
            'criterios_equilibrio_cumplidos': criterios_equilibrio,
        })
        
    return Response(report)


@extend_schema(
    methods=['GET'],
    responses={
        200:OpenApiResponse(description="Ok"),
    }
)
@api_view(['GET'])
def teacher_examgraded_detail(request,months):
    """
    Detailed record of the teachers who have reviewed exams in the last months.

    """
    today=timezone.now().date()
    range=today - timedelta(days=months*31)
    examgrades=ExamGrade.objects.filter(date__gte=range)
    
    details=examgrades.values('teacher','examdone__exam__subject').annotate(num_exam_grade=Count('id'))
    
    result=[]
    for detail in details:
        teacher=Teacher.objects.get(pk=detail['teacher']).first_name
        try:
            subject=Subject.objects.get(pk=detail['examdone__exam__subject']).name
        except Subject.DoesNotExist:
            subject="null"
        num=detail['num_exam_grade']
        result.append({"teacher" : teacher, "subject" : subject, "num_exam_grade" : num })
    return Response(result)


@extend_schema(
    methods=['GET'],
    responses={
        200:QuestionSerializer(many=True),
        404:OpenApiResponse(description="Primary key not found.")
    }
)
@api_view(['GET'])   
def common_questions(request,pk):
    """
    Obtain the most commond used question in final exams

    """
    subject=get_object_or_404(Subject,pk=pk)
    
    questions=Question.objects.filter(
        exams__assignedexam__type='final',
        exams__subject=subject
    ).annotate(usage_count=Count('exams__assignedexam')).order_by('-usage_count')
    
    result=[]
    for question in questions:
        id=question.pk
        difficulty=question.difficulty
        topic=question.topic
        used=question.usage_count
        result.append({"question" : id, "difficulty" : difficulty, "topic" : topic.name , "used":used})
    return Response(result)


@extend_schema(
    methods=['GET'],
    responses={
         200:QuestionSerializer(many=True),
        404:OpenApiResponse(description="Primary key not found.")
    }
)
@api_view(['GET'])  
def unused_questions(request,pk):
    """
    Questions not used in the last 2 years.

    """
    subject=get_object_or_404(Subject,pk=pk)
    today=timezone.now().date()
    range= today-timedelta(days=730)
    ques=Question.objects.filter(topic__Subject=subject)
    questions=ques.exclude(exams__date__gte=range).distinct()
    serializer=QuestionSerializer(questions,many=True)
    return Response(serializer.data)