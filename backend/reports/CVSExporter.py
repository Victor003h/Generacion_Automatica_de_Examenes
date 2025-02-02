import csv
from io import StringIO
from .baseexporter import Exporter
from django.http import HttpResponse


class CSVExporter(Exporter):
    def exportar(self, data, nombre_archivo: str):
    
    
        buffer = StringIO()
        writer = csv.writer(buffer)
        
        
        with open(nombre_archivo, mode='w', newline='') as file:
            if datos:
                fieldnames = list(datos[0].keys())
                writer = csv.DictWriter(file, fieldnames=fieldnames)
                writer.writeheader()
                for row in datos:
                    writer.writerow(row)
        
        

    def export(self,data,file_name:str):
        # Crear la respuesta HTTP con el tipo de contenido de CSV
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = f'attachment; filename="{file_name}.csv"'

        # Crear un escritor de CSV
        writer = csv.writer(response)
        
        # Escribir el encabezado del CSV
        writer.writerow(['ID', 'Nombre', 'Edad'])

        # Escribir algunas filas de ejemplo (puedes reemplazar esto con tus datos reales)
        data = [
            [1, 'Alice', 30],
            [2, 'Bob', 25],
            [3, 'Charlie', 35]
        ]
        
        for row in data:
            writer.writerow(row)

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

