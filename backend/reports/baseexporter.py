from abc import ABC, abstractmethod

class Exporter(ABC):
    @abstractmethod
    def exportar(self, data, nombre_archivo: str):
        pass





