from sqlalchemy import Column, String, Float
from app.config.database import Base

class BasuraORM(Base):
    __tablename__ = "basura_recolectada"
    __table_args__ = {'extend_existing': True}

    idBasura = Column(String(50), primary_key=True)
    tipoResiduo = Column(String(100), nullable=False)
    pesoKilos = Column(Float, nullable=False)
    fecha = Column(String(20), nullable=False)

    def __repr__(self):
        return (
            f"BasuraORM(idBasura='{self.idBasura}', tipoResiduo='{self.tipoResiduo}', "
            f"pesoKilos={self.pesoKilos})"
        )