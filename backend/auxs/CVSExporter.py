import csv
from io import StringIO
from .baseexporter import Exporter
from django.http import HttpResponse


class CSVExporter(Exporter):
    
    def export(self,data,file_name:str):
        # Crear la respuesta HTTP con el tipo de contenido de CSV
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = f'attachment; filename="{file_name}.csv"'

        # Crear un escritor de CSV
        writer = csv.writer(response)
        
        # Escribir el encabezado del CSV
        headers=data[0].keys()
        writer.writerow(headers)
    
        for item in data:
            writer.writerow(item.values())

        return response
    # def export(self, data):
    #     # Usamos StringIO para manejar el CSV en memoria
    #     buffer = StringIO()
    #     writer = csv.writer(buffer)

    #     for section, rows in data.items():
    #         # Escribimos el encabezado de la sección
    #         writer.writerow([section])  # Título de la sección
    #         if rows:
    #             # Escribimos los encabezados de las columnas
    #             headers = rows[0].keys()
    #             writer.writerow(headers)
    #             # Escribimos los datos fila por fila
    #             for row in rows:
    #                 writer.writerow(row.values())
    #         # Línea en blanco entre secciones
    #         writer.writerow([])

    #     # Convertimos el buffer en una cadena
    #     buffer.seek(0)
    #     return buffer.getvalue()

