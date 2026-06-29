from sqlalchemy import Column, Integer, String
from app.config.database import Base

class MaterialORM(Base):
    __tablename__ = "materiales"

    id = Column(Integer, primary_key=True)
    nombre = Column(String(100), nullable=False)
    unidad_medida = Column(String(50), nullable=False)
    cantidad_disponible = Column(Integer, nullable=False)

    def __repr__(self):
        return f"Material(nombre='{self.nombre}', cantidad={self.cantidad_disponible}, unidad='{self.unidad_medida}')"