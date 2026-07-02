from sqlalchemy import Column, Integer, String
from app.config.database import Base

class MaterialORM(Base):
    __tablename__ = "materiales"

    id = Column(Integer, primary_key=True, autoincrement=False)
    nombre = Column(String(100), nullable=False)
    descripcion = Column(String(200), nullable=True)
    cantidad = Column(Integer, nullable=False)

    def __repr__(self):
        return f"Material(id={self.id}, nombre='{self.nombre}', cantidad={self.cantidad})"