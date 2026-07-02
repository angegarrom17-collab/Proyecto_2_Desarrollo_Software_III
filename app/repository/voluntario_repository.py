from app.config.database import SessionLocal
from app.models.voluntario import VoluntarioORM
from sqlalchemy.exc import IntegrityError

class VoluntarioRepository:
    def __init__(self):
        self.db = SessionLocal()

    def create(self, id, nombre, email, edad, organizacion, telefono):
        try:
            voluntario = VoluntarioORM(
                id=id,
                nombre=nombre,
                email=email,
                edad=edad,
                organizacion=organizacion,
                telefono=telefono
            )
            self.db.add(voluntario)
            self.db.commit()
            return voluntario
        except IntegrityError:
            self.db.rollback()
            return None
        except Exception:
            self.db.rollback()
            raise

    def get(self, id):
        try:
            return self.db.query(VoluntarioORM).filter_by(id=id).first()
        except Exception:
            self.db.rollback()
            raise

    def get_all(self):
        try:
            return self.db.query(VoluntarioORM).all()
        except Exception:
            self.db.rollback()
            raise

    def update(self, id, nombre, email, edad, organizacion, telefono):
        try:
            voluntario = self.get(id)
            if voluntario:
                voluntario.nombre = nombre
                voluntario.email = email
                voluntario.edad = edad
                voluntario.organizacion = organizacion
                voluntario.telefono = telefono
                self.db.commit()
            return voluntario
        except IntegrityError:
            self.db.rollback()
            return None
        except Exception:
            self.db.rollback()
            raise

    def delete(self, id):
        try:
            voluntario = self.get(id)
            if voluntario:
                self.db.delete(voluntario)
                self.db.commit()
            return voluntario
        except Exception:
            self.db.rollback()
            raise