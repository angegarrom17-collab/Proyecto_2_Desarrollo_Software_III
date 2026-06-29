from sqlalchemy import Column, Integer, String
from app.config.database import Base


class ZonaORM(Base):
    __tablename__ = "zonas"

    id_zona = Column(Integer, primary_key=True)
    nombre_zona = Column(String(100), nullable=False)
    ubicacion = Column(String(200), nullable=False)
    nivel_contaminacion = Column(String(20), nullable=False)
    descripcion = Column(String(300), nullable=False)

    def __repr__(self):
        return f"Zona(nombre='{self.nombre_zona}', nivel='{self.nivel_contaminacion}', ubicacion='{self.ubicacion}')"