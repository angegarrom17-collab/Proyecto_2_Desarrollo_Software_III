from sqlalchemy import Column, Integer, String, Float, DateTime, func
from app.config.database import Base


class ReporteGeneradoORM(Base):
    __tablename__ = "reportes_generados"

    id = Column(Integer, primary_key=True, autoincrement=True)
    fecha_generacion = Column(DateTime, server_default=func.now())
    total_basura_kg = Column(Float, default=0.0)
    promedio_basura_kg = Column(Float, default=0.0)
    total_jornadas = Column(Integer, default=0)
    total_animales_afectados = Column(Integer, default=0)
    animales_heridos = Column(Integer, default=0)
    animales_muertos = Column(Integer, default=0)
    residuos_por_tipo = Column(String(1000), default="")

    def __repr__(self):
        return f"ReporteGenerado(id={self.id}, fecha={self.fecha_generacion})"