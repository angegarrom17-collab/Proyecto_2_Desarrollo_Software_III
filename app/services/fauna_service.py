from app.repository.fauna_repository import FaunaRepository

ESTADOS_VALIDOS = {"vivo", "herido", "muerto"}


class FaunaService:
    def __init__(self):
        self.repo = FaunaRepository()

    def _validar_estado(self, estado):
        if estado.lower() not in ESTADOS_VALIDOS:
            raise ValueError(f"Estado inválido. Debe ser uno de: {', '.join(ESTADOS_VALIDOS)}")

    def _validar_campos(self, especie, estado, descripcion):
        for campo, valor in [("especie", especie), ("descripcion", descripcion)]:
            if not str(valor).strip():
                raise ValueError(f"El campo '{campo}' no puede estar vacío")
        self._validar_estado(estado)

    def crear_animal(self, especie, estado, descripcion):
        self._validar_campos(especie, estado, descripcion)
        return self.repo.crear(
            especie=str(especie).strip(),
            estado=estado.lower().strip(),
            descripcion=str(descripcion).strip()
        )

    def obtener_animal(self, animal_id):
        return self.repo.obtener(animal_id)

    def listar_animales(self):
        return self.repo.obtener_todos()

    def actualizar_animal(self, animal_id, especie, estado, descripcion):
        animal = self.repo.obtener(animal_id)
        if not animal:
            raise ValueError(f"No se encontró un animal con ID '{animal_id}'.")
        self._validar_campos(especie, estado, descripcion)
        return self.repo.actualizar(
            animal_id=animal_id,
            especie=str(especie).strip(),
            estado=estado.lower().strip(),
            descripcion=str(descripcion).strip()
        )

    def eliminar_animal(self, animal_id):
        animal = self.repo.obtener(animal_id)
        if not animal:
            raise ValueError(f"No se encontró un animal con ID '{animal_id}'.")
        return self.repo.eliminar(animal_id)

    def buscar_por_estado(self, estado):
        self._validar_estado(estado)
        return self.repo.obtener_por_estado(estado.lower().strip())

    def reporte_fauna(self):
        todos = self.repo.obtener_todos()
        return {
            "total_animales": len(todos),
            "heridos": sum(1 for a in todos if a.estado == "herido"),
            "muertos": sum(1 for a in todos if a.estado == "muerto"),
            "vivos": sum(1 for a in todos if a.estado == "vivo")
        }