from app.repository.material_repository import MaterialRepository


class MaterialService:
    def __init__(self):
        self.repo = MaterialRepository()

    def _validar_campos(self, nombre, cantidad):
        if not str(nombre).strip():
            raise ValueError("El campo 'nombre' no puede estar vacío")
        if cantidad < 0:
            raise ValueError("La cantidad no puede ser negativa")

    def crear_material(self, id, nombre, descripcion, cantidad):
        self._validar_campos(nombre, cantidad)
        if self.repo.obtener(id):
            raise ValueError(f"Ya existe un material con ID '{id}'")
        return self.repo.crear(
            id=id,
            nombre=str(nombre).strip(),
            descripcion=str(descripcion).strip() if descripcion else None,
            cantidad=cantidad
        )

    def obtener_material(self, material_id):
        return self.repo.obtener(material_id)

    def listar_materiales(self):
        return self.repo.obtener_todos()

    def actualizar_material(self, material_id, nombre, descripcion, cantidad):
        material = self.repo.obtener(material_id)
        if not material:
            raise ValueError(f"No se encontró un material con ID '{material_id}'.")
        self._validar_campos(nombre, cantidad)
        return self.repo.actualizar(
            material_id=material_id,
            nombre=str(nombre).strip(),
            descripcion=str(descripcion).strip() if descripcion else None,
            cantidad=cantidad
        )

    def eliminar_material(self, material_id):
        material = self.repo.obtener(material_id)
        if not material:
            raise ValueError(f"No se encontró un material con ID '{material_id}'.")
        return self.repo.eliminar(material_id)

    def usar_material(self, material_id, cantidad):
        if cantidad <= 0:
            raise ValueError("La cantidad a usar debe ser mayor a cero")
        material = self.repo.obtener(material_id)
        if not material:
            raise ValueError(f"No se encontró un material con ID '{material_id}'.")
        if material.cantidad < cantidad:
            raise ValueError(
                f"Stock insuficiente. Disponible: {material.cantidad}, solicitado: {cantidad}"
            )
        return self.repo.actualizar(
            material_id=material_id,
            nombre=material.nombre,
            descripcion=material.descripcion,
            cantidad=material.cantidad - cantidad
        )

    def reporte_stock_bajo(self, umbral=10):
        return self.repo.obtener_stock_bajo(umbral)