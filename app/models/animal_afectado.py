from sqlalchemy import Column, Integer, String
from app.config.database import Base

class AnimalORM(Base):
    __tablename__ = "animales_afectados"

    id = Column(Integer, primary_key=True, autoincrement=True)
    especie = Column(String(100), nullable=False)
    estado = Column(String(50), nullable=False)
    descripcion = Column(String(255))
    id_zona = Column(Integer, nullable=True)