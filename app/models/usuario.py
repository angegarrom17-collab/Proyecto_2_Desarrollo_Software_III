from sqlalchemy import Column, String
from app.config.database import Base

class UsuarioORM(Base):
    __tablename__ = "usuarios"

    id = Column(String(50), primary_key=True)
    nombre = Column(String(100), nullable=False, default="")  # ← NUEVO
    email = Column(String(150), unique=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    rol = Column(String(50), default="encargado", nullable=False)