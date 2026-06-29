from app.config.database import SessionLocal
from app.models.material import MaterialORM


class MaterialRepository:
    def __init__(self):
        self.db = SessionLocal()

    def crear(self, nombre, unidad_medida, cantidad_disponible):
        material = MaterialORM(
            nombre=nombre,
            unidad_medida=unidad_medida,
            cantidad_disponible=cantidad_disponible
        )
        self.db.add(material)
        self.db.commit()
        self.db.refresh(material)
        return material

    def obtener(self, material_id):
        return self.db.query(MaterialORM).filter_by(id=material_id).first()

    def obtener_todos(self):
        return self.db.query(MaterialORM).all()

    def actualizar(self, material_id, nombre, unidad_medida, cantidad_disponible):
        material = self.obtener(material_id)
        if material:
            material.nombre = nombre
            material.unidad_medida = unidad_medida
            material.cantidad_disponible = cantidad_disponible
            self.db.commit()
        return material

    def eliminar(self, material_id):
        material = self.obtener(material_id)
        if material:
            self.db.delete(material)
            self.db.commit()
        return material

    def obtener_stock_bajo(self, umbral=10):
        return self.db.query(MaterialORM).filter(
            MaterialORM.cantidad_disponible < umbral
        ).all()