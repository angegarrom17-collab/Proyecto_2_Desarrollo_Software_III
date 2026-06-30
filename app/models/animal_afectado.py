from sqlalchemy import Column, Integer, String
from app.config.database import Base

class AnimalAfectadoORM(Base):
    __tablename__ = "animales_afectados"

    id = Column(Integer, primary_key=True, autoincrement=False)  # ← tú pones el ID
    especie = Column(String(100), nullable=False)
    estado = Column(String(20), nullable=False)
    descripcion = Column(String(300), nullable=False)

    def __repr__(self):
        return f"AnimalAfectado(id={self.id}, especie='{self.especie}', estado='{self.estado}')"