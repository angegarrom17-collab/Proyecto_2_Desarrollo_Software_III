from app.config.database import SessionLocal
from app.models.animal_afectado import AnimalAfectadoORM
from sqlalchemy.exc import IntegrityError

class FaunaRepository:
    def crear(self, id, especie, estado, descripcion):
        db = SessionLocal()
        try:
            animal = AnimalAfectadoORM(
                id=id,
                especie=especie,
                estado=estado,
                descripcion=descripcion
            )
            db.add(animal)
            db.commit()
            db.refresh(animal)
            return animal
        except IntegrityError:
            db.rollback()
            raise ValueError(f"Ya existe un animal con ID {id}.")
        except Exception:
            db.rollback()
            raise
        finally:
            db.close()

    def obtener(self, animal_id):
        db = SessionLocal()
        try:
            return db.query(AnimalAfectadoORM).filter_by(id=animal_id).first()
        finally:
            db.close()

    def obtener_todos(self):
        db = SessionLocal()
        try:
            return db.query(AnimalAfectadoORM).all()
        finally:
            db.close()

    def actualizar(self, animal_id, especie, estado, descripcion):
        db = SessionLocal()
        try:
            animal = db.query(AnimalAfectadoORM).filter_by(id=animal_id).first()
            if animal:
                animal.especie = especie
                animal.estado = estado
                animal.descripcion = descripcion
                db.commit()
                db.refresh(animal)
            return animal
        except Exception:
            db.rollback()
            raise
        finally:
            db.close()

    def eliminar(self, animal_id):
        db = SessionLocal()
        try:
            animal = db.query(AnimalAfectadoORM).filter_by(id=animal_id).first()
            if animal:
                db.delete(animal)
                db.commit()
            return animal
        except Exception:
            db.rollback()
            raise
        finally:
            db.close()

    def obtener_por_estado(self, estado):
        db = SessionLocal()
        try:
            return db.query(AnimalAfectadoORM).filter_by(estado=estado).all()
        finally:
            db.close()