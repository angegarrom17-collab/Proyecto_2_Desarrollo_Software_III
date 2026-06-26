from sqlalchemy import func
from app.config.database import SessionLocal
from app.models.voluntario import Voluntario


class VoluntarioRepository:
    def __init__(self):
        self.db = SessionLocal()

    def create(self, cedula, nombre, email, edad, organizacion):
        voluntario = Voluntario(
            cedula=cedula,
            nombre=nombre,
            email=email,
            edad=edad,
            organizacion=organizacion
        )
        self.db.add(voluntario)
        self.db.commit()
        self.db.refresh(voluntario)
        return voluntario

    def get(self, voluntario_id):
        return self.db.query(Voluntario).filter_by(id=voluntario_id).first()

    def get_by_cedula(self, cedula):
        return self.db.query(Voluntario).filter_by(cedula=cedula).first()

    def get_all(self):
        return self.db.query(Voluntario).all()

    def update(self, voluntario_id, cedula, nombre, email, edad, organizacion):
        voluntario = self.get(voluntario_id)
        if voluntario:
            voluntario.cedula = cedula
            voluntario.nombre = nombre
            voluntario.email = email
            voluntario.edad = edad
            voluntario.organizacion = organizacion
            self.db.commit()
        return voluntario

    def delete(self, voluntario_id):
        voluntario = self.get(voluntario_id)
        if voluntario:
            self.db.delete(voluntario)
            self.db.commit()
        return voluntario

    def get_by_organizacion(self, organizacion):
        return self.db.query(Voluntario).filter(func.lower(Voluntario.organizacion) == organizacion.lower()).all()

    def search_by_age_range(self, min_age, max_age):
        return self.db.query(Voluntario).filter(Voluntario.edad >= min_age, Voluntario.edad <= max_age).all()