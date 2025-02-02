from .CSVExporter import CSVExporter
from .PDFExporter import  PDFExporter
from .baseexporter import Exporter


class ExporterFactory:
    @staticmethod
    def get_exporter(formato: str) -> Exporter:
        if formato.lower() == 'pdf':
            return PDFExporter()
        elif formato.lower() == 'csv':
            return CSVExporter()
        elif formato.lower() == 'excel':
            return ExcelExporter()
        elif formato.lower() == 'json':
            return JSONExporter()
        else:
            raise ValueError(f'Formato de exportación desconocido: {formato}')
