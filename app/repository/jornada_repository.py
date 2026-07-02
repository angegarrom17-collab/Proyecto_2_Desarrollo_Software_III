from sqlalchemy import func
from sqlalchemy.orm import joinedload
from app.config.database import SessionLocal
from app.models.jornada_limpieza import JornadaORM, jornada_voluntario


class JornadaRepository:
    def create(self, id_jornada, fecha, descripcion, cantidad_basura_total, observaciones, id_zona, cantidad_voluntarios=0):
        db = SessionLocal()
        try:
            jornada = JornadaORM(
                id_jornada=id_jornada,
                fecha=fecha,
                descripcion=descripcion,
                cantidad_basura_total=cantidad_basura_total,
                observaciones=observaciones,
                id_zona=id_zona,
                cantidad_voluntarios=cantidad_voluntarios
            )
            db.add(jornada)
            db.commit()
            db.refresh(jornada)
            return jornada
        except Exception:
            db.rollback()
            raise
        finally:
            db.close()

    def get(self, id_jornada):
        db = SessionLocal()
        try:
            return db.query(JornadaORM).options(
                joinedload(JornadaORM.zona),
                joinedload(JornadaORM.voluntarios)
            ).filter_by(id_jornada=id_jornada).first()
        finally:
            db.close()

    def get_all(self):
        db = SessionLocal()
        try:
            return db.query(JornadaORM).options(
                joinedload(JornadaORM.zona),
                joinedload(JornadaORM.voluntarios)
            ).all()
        finally:
            db.close()

    def update(self, id_jornada, fecha, descripcion, cantidad_basura_total, observaciones, id_zona, cantidad_voluntarios=0):
        db = SessionLocal()
        try:
            jornada = db.query(JornadaORM).filter_by(id_jornada=id_jornada).first()
            if jornada:
                jornada.fecha = fecha
                jornada.descripcion = descripcion
                jornada.cantidad_basura_total = cantidad_basura_total
                jornada.observaciones = observaciones
                jornada.id_zona = id_zona
                jornada.cantidad_voluntarios = cantidad_voluntarios
                db.commit()
                db.refresh(jornada)
            return jornada
        except Exception:
            db.rollback()
            raise
        finally:
            db.close()

    def delete(self, id_jornada):
        db = SessionLocal()
        try:
            jornada = db.query(JornadaORM).filter_by(id_jornada=id_jornada).first()
            if jornada:
                db.delete(jornada)
                db.commit()
            return jornada
        except Exception:
            db.rollback()
            raise
        finally:
            db.close()

    def assign_voluntario(self, id_jornada, id_voluntario):
        db = SessionLocal()
        try:
            db.execute(
                jornada_voluntario.insert().values(
                    id_jornada=id_jornada,
                    id_voluntario=id_voluntario
                )
            )
            db.commit()
        except Exception:
            db.rollback()
            raise
        finally:
            db.close()

    def count_voluntarios(self, id_jornada):
        db = SessionLocal()
        try:
            return db.query(func.count()).select_from(jornada_voluntario).filter_by(
                id_jornada=id_jornada
            ).scalar() or 0
        finally:
            db.close()

    def get_voluntarios(self, id_jornada):
        db = SessionLocal()
        try:
            jornada = db.query(JornadaORM).options(
                joinedload(JornadaORM.voluntarios)
            ).filter_by(id_jornada=id_jornada).first()
            return jornada.voluntarios if jornada else []
        finally:
            db.close()

    def get_by_zona(self, id_zona):
        db = SessionLocal()
        try:
            return db.query(JornadaORM).options(
                joinedload(JornadaORM.zona),
                joinedload(JornadaORM.voluntarios)
            ).filter_by(id_zona=id_zona).all()
        finally:
            db.close()

    def get_by_fecha_range(self, fecha_desde, fecha_hasta):
        db = SessionLocal()
        try:
            return db.query(JornadaORM).options(
                joinedload(JornadaORM.zona),
                joinedload(JornadaORM.voluntarios)
            ).filter(
                JornadaORM.fecha >= fecha_desde,
                JornadaORM.fecha <= fecha_hasta
            ).all()
        finally:
            db.close()
