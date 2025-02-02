from rest_framework.response import Response
from django.shortcuts import render
from drf_spectacular.utils import extend_schema,OpenApiResponse
from rest_framework.decorators import api_view
from rest_framework import status

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
def export_document(request, format):
    return Response("erdiablo")
    data = request.data.get('content')
    title = request.data.get('title')
    
    file_name = f'{title}.{format}'
    
    try:
        exporter = ExporterFactory.get_exporter(format)
        exporter.export(data, file_name)
        return Response({'message': f'Documento exportado a {file_name}'}, status=200)
    except ValueError as e:
        return Response({'error': str(e)}, status=400)


@api_view(['GET'])
def test(request, pk):
    return Response(status=status.HTTP_200_OK)
    