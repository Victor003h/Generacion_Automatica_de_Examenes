import csv
from io import StringIO
from .baseexporter import Exporter
from django.http import HttpResponse


class CSVExporter(Exporter):
    
    def export(self,data,file_name:str):
        # Create the HTTP response with the content type of CSV.
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = f'attachment; filename="{file_name}.csv"'

        
        
        writer = csv.writer(response)
        
        if not data:
        # Escribir un mensaje en el CSV indicando que no hay datos (opcional)
            writer.writerow(["No hay datos disponibles"])
        return response
        
        # Write the header of the CSV
        
        headers=data[0].keys()
        writer.writerow(headers)
    
        
        for item in data:
            writer.writerow(item.values())

        return response
