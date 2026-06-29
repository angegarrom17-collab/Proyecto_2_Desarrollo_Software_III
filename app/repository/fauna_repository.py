from app.config.database import SessionLocal
from app.models.animal_afectado import AnimalORM


class FaunaRepository:
    def __init__(self):
        self.db = SessionLocal()

    def crear(self, especie, estado, descripcion):
        animal = AnimalORM(
            especie=especie,
            estado=estado,
            descripcion=descripcion
        )
        self.db.add(animal)
        self.db.commit()
        self.db.refresh(animal)
        return animal

    def obtener(self, animal_id):
        return self.db.query(AnimalORM).filter_by(id=animal_id).first()

    def obtener_todos(self):
        return self.db.query(AnimalORM).all()

    def actualizar(self, animal_id, especie, estado, descripcion):
        animal = self.obtener(animal_id)
        if animal:
            animal.especie = especie
            animal.estado = estado
            animal.descripcion = descripcion
            self.db.commit()
        return animal

    def eliminar(self, animal_id):
        animal = self.obtener(animal_id)
        if animal:
            self.db.delete(animal)
            self.db.commit()
        return animal

    def obtener_por_estado(self, estado):
        return self.db.query(AnimalORM).filter_by(estado=estado).all()