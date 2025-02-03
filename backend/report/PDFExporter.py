from .baseexporter import Exporter
from reportlab.lib.pagesizes import letter
from django.http import HttpResponse
import json
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle

class PDFExporter(Exporter):
    def export(self, data, file_name):
    # Create the HTTP response with the content type of PDF.
        response = HttpResponse(content_type='application/pdf')
        response['Content-Disposition'] = 'attachment; filename="data.pdf"'

        # Create the PDF document.
        doc = SimpleDocTemplate(response, pagesize=letter)
        elements = []

    
        # Create table
        headers = list(data[0].keys())
        table_data = [headers]
        for item in data:
            table_data.append(list(item.values()))

        # Define the style of the table.
        table_style = TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
            ('GRID', (0, 0), (-1, -1), 1, colors.black)
        ])

        table = Table(table_data)
        table.setStyle(table_style)
        elements.append(table)
        doc.build(elements)

        return response