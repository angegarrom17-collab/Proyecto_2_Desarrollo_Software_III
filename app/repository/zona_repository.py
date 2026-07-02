from app.config.database import SessionLocal
from app.models.zona import ZonaORM


class ZonaRepository:
    def __init__(self):
        self.db = SessionLocal()

    def crear(self, id_zona, nombre_zona, ubicacion, nivel_contaminacion, descripcion):
        kwargs = {
            "nombre_zona": nombre_zona,
            "ubicacion": ubicacion,
            "nivel_contaminacion": nivel_contaminacion,
            "descripcion": descripcion
        }
        if id_zona is not None:
            kwargs["id_zona"] = id_zona

        zona = ZonaORM(**kwargs)
        self.db.add(zona)
        self.db.commit()
        self.db.refresh(zona)
        return zona

    def obtener(self, zona_id):
        return self.db.query(ZonaORM).filter_by(id_zona=zona_id).first()

    def obtener_todos(self):
        return self.db.query(ZonaORM).all()

    def actualizar(self, zona_id, nombre_zona, ubicacion, nivel_contaminacion, descripcion):
        zona = self.obtener(zona_id)
        if zona:
            zona.nombre_zona = nombre_zona
            zona.ubicacion = ubicacion
            zona.nivel_contaminacion = nivel_contaminacion
            zona.descripcion = descripcion
            self.db.commit()
            self.db.refresh(zona)
        return zona

    def eliminar(self, zona_id):
        zona = self.obtener(zona_id)
        if zona:
            self.db.delete(zona)
            self.db.commit()
        return zona

    def obtener_por_nivel(self, nivel):
        return self.db.query(ZonaORM).filter_by(nivel_contaminacion=nivel).all()