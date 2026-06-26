from sqlalchemy import Column, Integer, String
from app.config.database import Base


class VoluntarioORM(Base):
    __tablename__ = "voluntarios"

    id = Column(Integer, primary_key=True)
    cedula = Column(String(30), unique=True, nullable=False)
    nombre = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, nullable=False)
    edad = Column(Integer, nullable=False)
    organizacion = Column(String(100), nullable=False)

    def __repr__(self):
        return f"Voluntario(cedula='{self.cedula}', nombre='{self.nombre}', organizacion='{self.organizacion}')"