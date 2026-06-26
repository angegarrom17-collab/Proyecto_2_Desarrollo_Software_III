from sqlalchemy import Column, Integer, String
from app.config.database import Base


class UsuarioORM(Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, autoincrement=True)
    email = Column(String(150), unique=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    rol = Column(String(50), default="encargado", nullable=False)

    def __repr__(self):
        return f"Usuario(id={self.id}, email='{self.email}', rol='{self.rol}')"