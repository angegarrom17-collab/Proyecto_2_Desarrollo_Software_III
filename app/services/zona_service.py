from app.repository.zona_repository import ZonaRepository

NIVELES_VALIDOS = {"bajo", "medio", "alto", "critico"}


class ZonaService:
    def __init__(self):
        self.repo = ZonaRepository()

    def _validar_nivel_contaminacion(self, nivel):
        if nivel.lower() not in NIVELES_VALIDOS:
            raise ValueError(f"Nivel de contaminación inválido. Debe ser uno de: {', '.join(NIVELES_VALIDOS)}")

    def _validar_campos(self, nombre_zona, ubicacion, nivel_contaminacion, descripcion):
        for campo, valor in [("nombre_zona", nombre_zona), ("ubicacion", ubicacion),
                              ("descripcion", descripcion)]:
            if not str(valor).strip():
                raise ValueError(f"El campo '{campo}' no puede estar vacío")
        self._validar_nivel_contaminacion(nivel_contaminacion)

    def crear_zona(self, id_zona, nombre_zona, ubicacion, nivel_contaminacion, descripcion):
        self._validar_campos(nombre_zona, ubicacion, nivel_contaminacion, descripcion)
        return self.repo.crear(
            id_zona=id_zona,              # <-- agregado
            nombre_zona=str(nombre_zona).strip(),
            ubicacion=str(ubicacion).strip(),
            nivel_contaminacion=nivel_contaminacion.lower().strip(),
            descripcion=str(descripcion).strip()
        )

    def obtener_zona(self, zona_id):
        return self.repo.obtener(zona_id)

    def listar_zonas(self):
        return self.repo.obtener_todos()

    def actualizar_zona(self, zona_id, nombre_zona, ubicacion, nivel_contaminacion, descripcion):
        zona = self.repo.obtener(zona_id)
        if not zona:
            raise ValueError(f"No se encontró una zona con ID '{zona_id}'.")
        self._validar_campos(nombre_zona, ubicacion, nivel_contaminacion, descripcion)
        return self.repo.actualizar(
            zona_id=zona_id,
            nombre_zona=str(nombre_zona).strip(),
            ubicacion=str(ubicacion).strip(),
            nivel_contaminacion=nivel_contaminacion.lower().strip(),
            descripcion=str(descripcion).strip()
        )

    def eliminar_zona(self, zona_id):
        zona = self.repo.obtener(zona_id)
        if not zona:
            raise ValueError(f"No se encontró una zona con ID '{zona_id}'.")
        return self.repo.eliminar(zona_id)

    def buscar_por_nivel(self, nivel):
        self._validar_nivel_contaminacion(nivel)
        return self.repo.obtener_por_nivel(nivel.lower().strip())