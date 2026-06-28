from sqlalchemy import Column, Integer, String
from app.config.database import Base

class MaterialORM(Base):
    __tablename__ = "materiales"

    id = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String(100), nullable=False)
    cantidad = Column(Integer, default=0)
    descripcion = Column(String(255))