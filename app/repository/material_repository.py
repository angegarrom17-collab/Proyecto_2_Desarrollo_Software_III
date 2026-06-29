from app.config.database import SessionLocal
from app.models.material import MaterialORM


class MaterialRepository:
    def __init__(self):
        self.db = SessionLocal()

    def crear(self, id, nombre, descripcion, cantidad):
        material = MaterialORM(
            id=id,
            nombre=nombre,
            descripcion=descripcion,
            cantidad=cantidad
        )
        self.db.add(material)
        self.db.commit()
        self.db.refresh(material)
        return material

    def obtener(self, material_id):
        return self.db.query(MaterialORM).filter_by(id=material_id).first()

    def obtener_todos(self):
        return self.db.query(MaterialORM).all()

    def actualizar(self, material_id, nombre, descripcion, cantidad):
        material = self.obtener(material_id)
        if material:
            material.nombre = nombre
            material.descripcion = descripcion
            material.cantidad = cantidad
            self.db.commit()
            self.db.refresh(material)
        return material

    def eliminar(self, material_id):
        material = self.obtener(material_id)
        if material:
            self.db.delete(material)
            self.db.commit()
        return material

    def obtener_stock_bajo(self, umbral=10):
        return self.db.query(MaterialORM).filter(
            MaterialORM.cantidad < umbral
        ).all()