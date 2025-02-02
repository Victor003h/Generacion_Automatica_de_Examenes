from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import viewsets ,permissions,status
from drf_spectacular.utils import extend_schema, extend_schema_view,OpenApiResponse

from exams.views.examgrade import teacher_examgraded_detail
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
def export_document(request, format_id):
    """
    Export of documents to various formats.    

    """
    if format_id==1:
        format='csv'
    elif format_id==2:
        format='pdf'
    else:
        return Response("errror : Invalid format",status=status.HTTP_400_BAD_REQUEST)
    data = request.data.get('content')
    title = request.data.get('title')
    file_name = f'{title}.{format}'
    
    try:
        exporter = ExporterFactory.get_exporter(format)
        response=exporter.export(data, file_name)
        return response
    except ValueError as e:
        return Response({'error': str(e)}, status=400)


