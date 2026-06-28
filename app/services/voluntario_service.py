from app.repository.voluntario_repository import VoluntarioRepository

class VoluntarioService:
    def __init__(self):
        self.repo = VoluntarioRepository()

    def _validar_reglas_negocio(self, cedula, nombre, telefono, email, edad, organizacion):
        campos_obligatorios = ("cedula", "nombre", "telefono", "email", "organizacion")
        valores = (cedula, nombre, telefono, email, organizacion)

        for campo, valor in zip(campos_obligatorios, valores):
            if not str(valor).strip():
                raise ValueError(f"El campo '{campo}' no puede estar vacío")

        if edad <= 0:
            raise ValueError("La edad debe ser mayor a cero")
        if edad < 18:
            raise ValueError("El voluntario debe ser mayor de 18 años")
        if "@" not in email:
            raise ValueError("El correo no tiene formato válido")

    def crear_voluntario(self, cedula, nombre, telefono, email, edad, organizacion):
        if self.repo.get_by_cedula(str(cedula).strip()):
            raise ValueError(f"Ya existe un voluntario con ID {cedula}")

        self._validar_reglas_negocio(cedula, nombre, telefono, email, edad, organizacion)

        return self.repo.create(
            cedula=str(cedula).strip(),
            nombre=str(nombre).strip(),
            telefono=str(telefono).strip(),
            email=str(email).strip(),
            edad=edad,
            organizacion=str(organizacion).strip()
        )

    def obtener_voluntario(self, voluntario_id):
        return self.repo.get(voluntario_id)

    def listar_voluntarios(self):
        return self.repo.get_all()

    def actualizar_voluntario(self, voluntario_id, cedula, nombre, telefono, email, edad, organizacion):
        voluntario = self.repo.get(voluntario_id)
        if not voluntario:
            raise ValueError(f"No se encontró un voluntario con ID '{voluntario_id}'.")

        self._validar_reglas_negocio(cedula, nombre, telefono, email, edad, organizacion)

        return self.repo.update(
            voluntario_id=voluntario_id,
            cedula=str(cedula).strip(),
            nombre=str(nombre).strip(),
            telefono=str(telefono).strip(),
            email=str(email).strip(),
            edad=edad,
            organizacion=str(organizacion).strip()
        )

    def eliminar_voluntario(self, voluntario_id):
        voluntario = self.repo.get(voluntario_id)
        if not voluntario:
            raise ValueError(f"No se encontró un voluntario con ID '{voluntario_id}'.")

        return self.repo.delete(voluntario_id)

    def buscar_por_organizacion(self, organizacion: str) -> list:
        if not organizacion.strip():
            raise ValueError("La organización de búsqueda no puede estar vacía.")
        return self.repo.get_by_organizacion(organizacion.strip())

    def obtener_organizaciones_unicas(self) -> set:
        todos = self.repo.get_all()
        return {volun.organizacion for volun in todos if volun.organizacion}