from sqlalchemy.orm import joinedload

from app.config.database import SessionLocal
from app.models.jornada_limpieza import JornadaORM, jornada_voluntario

class JornadaRepository:
    def __init__(self):
        self.db = SessionLocal()

    def create(self, id_jornada, fecha, descripcion, cantidad_basura_total, observaciones, id_zona):
        jornada = JornadaORM(
            id_jornada=id_jornada,
            fecha=fecha,
            descripcion=descripcion,
            cantidad_basura_total=cantidad_basura_total,
            observaciones=observaciones,
            id_zona=id_zona
        )
        self.db.add(jornada)
        self.db.commit()
        return jornada

    def get(self, id_jornada):
        return self.db.query(JornadaORM).options(
            joinedload(JornadaORM.zona),
            joinedload(JornadaORM.voluntarios)
        ).filter_by(id_jornada=id_jornada).first()

    def get_all(self):
        return self.db.query(JornadaORM).options(joinedload(JornadaORM.zona)).all()

    def update(self, id_jornada, fecha, descripcion, cantidad_basura_total, observaciones, id_zona):
        jornada = self.get(id_jornada)
        if jornada:
            jornada.fecha = fecha
            jornada.descripcion = descripcion
            jornada.cantidad_basura_total = cantidad_basura_total
            jornada.observaciones = observaciones
            jornada.id_zona = id_zona
            self.db.commit()
        return jornada

    def delete(self, id_jornada):
        jornada = self.get(id_jornada)
        if jornada:
            self.db.delete(jornada)
            self.db.commit()
        return jornada

    def assign_voluntario(self, id_jornada, id_voluntario):
        self.db.execute(
            jornada_voluntario.insert(),
            {"id_jornada": id_jornada, "id_voluntario": id_voluntario}
        )
        self.db.commit()

    def count_voluntarios(self, id_jornada):
        return self.db.query(jornada_voluntario).filter_by(id_jornada=id_jornada).count()

    def get_voluntarios(self, id_jornada):
        jornada = self.get(id_jornada)
        return jornada.voluntarios if jornada else []