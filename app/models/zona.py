from sqlalchemy import Column, Integer, String
from app.config.database import Base

class ZonaORM(Base):
    __tablename__ = "zonas"

    id_zona = Column(Integer, primary_key=True, autoincrement=True)
    nombre_zona = Column(String(100), nullable=False)
    ubicacion = Column(String(200), nullable=False)
    nivel_contaminacion = Column(String(50), nullable=False)