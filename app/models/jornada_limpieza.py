from sqlalchemy import Column, String, Integer, Text, ForeignKey, Table
from sqlalchemy.orm import relationship
from app.config.database import Base

jornada_voluntario = Table(
    "jornada_voluntario",
    Base.metadata,
    Column("id_jornada", String(50), ForeignKey("jornadas.id_jornada"), primary_key=True),
    Column("id_voluntario", Integer, ForeignKey("voluntarios.id"), primary_key=True)
)


class JornadaORM(Base):
    __tablename__ = "jornadas"
    __table_args__ = {'extend_existing': True}

    id_jornada = Column(String(50), primary_key=True)
    fecha = Column(String(20), nullable=False)
    descripcion = Column(Text, nullable=False)
    cantidad_basura_total = Column(Integer, nullable=False)
    observaciones = Column(Text, nullable=False)
    id_zona = Column(Integer, ForeignKey("zonas.id_zona"), nullable=False)

    zona = relationship("ZonaORM", backref="jornadas")
    voluntarios = relationship("VoluntarioORM", secondary=jornada_voluntario, backref="jornadas_asignadas")

    def __repr__(self):
        return (
            f"JornadaORM(id_jornada='{self.id_jornada}', fecha='{self.fecha}', "
            f"descripcion='{self.descripcion[:30]}...')"
        )