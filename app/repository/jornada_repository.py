from sqlalchemy import func
from sqlalchemy.orm import joinedload
from app.config.database import SessionLocal
from app.models.jornada_limpieza import JornadaORM, jornada_voluntario


class JornadaRepository:
    def __init__(self):
        self.db = SessionLocal()

    def create(self, id_jornada, fecha, descripcion, cantidad_basura_total, observaciones, id_zona, cantidad_voluntarios=0):
        jornada = JornadaORM(
            id_jornada=id_jornada,
            fecha=fecha,
            descripcion=descripcion,
            cantidad_basura_total=cantidad_basura_total,
            observaciones=observaciones,
            id_zona=id_zona,
            cantidad_voluntarios=cantidad_voluntarios
        )
        self.db.add(jornada)
        self.db.commit()
        self.db.refresh(jornada)
        return jornada

    def get(self, id_jornada):
        return self.db.query(JornadaORM).options(
            joinedload(JornadaORM.zona),
            joinedload(JornadaORM.voluntarios)
        ).filter_by(id_jornada=id_jornada).first()

    def get_all(self):
        return self.db.query(JornadaORM).options(
            joinedload(JornadaORM.zona),
            joinedload(JornadaORM.voluntarios)
        ).all()

    def update(self, id_jornada, fecha, descripcion, cantidad_basura_total, observaciones, id_zona, cantidad_voluntarios=0):
        jornada = self.get(id_jornada)
        if jornada:
            jornada.fecha = fecha
            jornada.descripcion = descripcion
            jornada.cantidad_basura_total = cantidad_basura_total
            jornada.observaciones = observaciones
            jornada.id_zona = id_zona
            jornada.cantidad_voluntarios = cantidad_voluntarios
            self.db.commit()
            self.db.refresh(jornada)
        return jornada

    def delete(self, id_jornada):
        jornada = self.get(id_jornada)
        if jornada:
            self.db.delete(jornada)
            self.db.commit()
        return jornada

    def assign_voluntario(self, id_jornada, id_voluntario):
        self.db.execute(
            jornada_voluntario.insert().values(
                id_jornada=id_jornada,
                id_voluntario=id_voluntario
            )
        )
        self.db.commit()

    def count_voluntarios(self, id_jornada):
        return self.db.query(func.count()).select_from(jornada_voluntario).filter_by(
            id_jornada=id_jornada
        ).scalar() or 0

    def get_voluntarios(self, id_jornada):
        jornada = self.get(id_jornada)
        return jornada.voluntarios if jornada else []

    def get_by_zona(self, id_zona):
        return self.db.query(JornadaORM).options(
            joinedload(JornadaORM.zona),
            joinedload(JornadaORM.voluntarios)
        ).filter_by(id_zona=id_zona).all()

    def get_by_fecha_range(self, fecha_desde, fecha_hasta):
        return self.db.query(JornadaORM).options(
            joinedload(JornadaORM.zona),
            joinedload(JornadaORM.voluntarios)
        ).filter(
            JornadaORM.fecha >= fecha_desde,
            JornadaORM.fecha <= fecha_hasta
        ).all()