from rest_framework.decorators import api_view
from rest_framework.response import Response

from .exporterfactory import ExporterFactory
from drf_spectacular.utils import extend_schema, extend_schema_view,OpenApiResponse



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
                    'type' : 'list'
                }
            },
        }
    },
)
@api_view(['POST'])
def export_document(request, format):
    data = request.data.get('content')
    title = request.data.get('title')
    
    document = Document(title, data)
    
    file_name = f'{title}.{format}'
    try:
        exporter = ExporterFactory.get_exporter(format)
        exporter.exportar(document, file_name)
        return Response({'message': f'Documento exportado a {file_name}'}, status=200)
    except ValueError as e:
        return Response({'error': str(e)}, status=400)
