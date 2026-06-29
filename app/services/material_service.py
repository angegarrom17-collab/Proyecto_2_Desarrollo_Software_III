from app.repository.material_repository import MaterialRepository


class MaterialService:
    def __init__(self):
        self.repo = MaterialRepository()

    def _validar_campos(self, nombre, unidad_medida, cantidad_disponible):
        for campo, valor in [("nombre", nombre), ("unidad_medida", unidad_medida)]:
            if not str(valor).strip():
                raise ValueError(f"El campo '{campo}' no puede estar vacío")
        if cantidad_disponible < 0:
            raise ValueError("La cantidad disponible no puede ser negativa")

    def crear_material(self, nombre, unidad_medida, cantidad_disponible):
        self._validar_campos(nombre, unidad_medida, cantidad_disponible)
        return self.repo.crear(
            nombre=str(nombre).strip(),
            unidad_medida=str(unidad_medida).strip(),
            cantidad_disponible=cantidad_disponible
        )

    def obtener_material(self, material_id):
        return self.repo.obtener(material_id)

    def listar_materiales(self):
        return self.repo.obtener_todos()

    def actualizar_material(self, material_id, nombre, unidad_medida, cantidad_disponible):
        material = self.repo.obtener(material_id)
        if not material:
            raise ValueError(f"No se encontró un material con ID '{material_id}'.")
        self._validar_campos(nombre, unidad_medida, cantidad_disponible)
        return self.repo.actualizar(
            material_id=material_id,
            nombre=str(nombre).strip(),
            unidad_medida=str(unidad_medida).strip(),
            cantidad_disponible=cantidad_disponible
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
        if material.cantidad_disponible < cantidad:
            raise ValueError(
                f"Stock insuficiente. Disponible: {material.cantidad_disponible}, solicitado: {cantidad}"
            )
        return self.repo.actualizar(
            material_id=material_id,
            nombre=material.nombre,
            unidad_medida=material.unidad_medida,
            cantidad_disponible=material.cantidad_disponible - cantidad
        )

    def reporte_stock_bajo(self, umbral=10):
        return self.repo.obtener_stock_bajo(umbral)