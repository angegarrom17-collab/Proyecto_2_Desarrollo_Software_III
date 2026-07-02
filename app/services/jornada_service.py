from app.repository.jornada_repository import JornadaRepository
from app.repository.zona_repository import ZonaRepository
from app.repository.voluntario_repository import VoluntarioRepository


class JornadaService:
    def __init__(self):
        self.repo = JornadaRepository()
        self.zona_repo = ZonaRepository()
        self.voluntario_repo = VoluntarioRepository()

    def _validate_zona_exists(self, id_zona):
        zona = self.zona_repo.obtener(id_zona)
        if not zona:
            raise ValueError(f"La zona con id '{id_zona}' no existe")

    def _validate_voluntario_exists(self, id_voluntario):
        vol = self.voluntario_repo.get_by_cedula(id_voluntario)
        if not vol:
            raise ValueError(f"El voluntario con cedula '{id_voluntario}' no existe")

    def _validate_common_data(self, fecha, descripcion, cantidad_basura_total, observaciones):
        if not fecha or fecha.strip() == "":
            raise ValueError("La fecha no puede estar vacia")
        if not descripcion or descripcion.strip() == "":
            raise ValueError("La descripcion no puede estar vacia")
        if cantidad_basura_total <= 0:
            raise ValueError("La basura debe ser mayor a cero")
        if not observaciones or observaciones.strip() == "":
            raise ValueError("Las observaciones no pueden estar vacias")

    def create_jornada(self, id_jornada, fecha, descripcion, cantidad_basura_total, observaciones, id_zona, cantidad_voluntarios=0):
        if not id_jornada or id_jornada.strip() == "":
            raise ValueError("El id no puede estar vacio")
        if self.repo.get(id_jornada):
            raise ValueError("El id ya esta guardado")

        self._validate_common_data(fecha, descripcion, cantidad_basura_total, observaciones)
        self._validate_zona_exists(id_zona)

        return self.repo.create(
            id_jornada.strip(),
            fecha.strip(),
            descripcion.strip(),
            cantidad_basura_total,
            observaciones.strip(),
            id_zona,
            cantidad_voluntarios
        )

    def get_jornada(self, id_jornada):
        return self.repo.get(id_jornada)

    def list_jornadas(self):
        return self.repo.get_all()

    def update_jornada(self, id_jornada, fecha, descripcion, cantidad_basura_total, observaciones, id_zona, cantidad_voluntarios=0):
        jornada = self.repo.get(id_jornada)
        if not jornada:
            return None

        self._validate_common_data(fecha, descripcion, cantidad_basura_total, observaciones)
        self._validate_zona_exists(id_zona)

        return self.repo.update(
            id_jornada,
            fecha.strip(),
            descripcion.strip(),
            cantidad_basura_total,
            observaciones.strip(),
            id_zona,
            cantidad_voluntarios
        )

    def delete_jornada(self, id_jornada):
        return self.repo.delete(id_jornada)

    def assign_voluntario(self, id_jornada, id_voluntario):
        jornada = self.repo.get(id_jornada)
        if not jornada:
            raise ValueError("La jornada no existe")

        self._validate_voluntario_exists(id_voluntario)

        cantidad_actual = self.repo.count_voluntarios(id_jornada)
        if cantidad_actual >= 20:
            raise ValueError("Limite de 20 voluntarios alcanzado")

        actuales = self.repo.get_voluntarios(id_jornada)
        cedulas_actuales = [v.cedula for v in actuales]
        if id_voluntario in cedulas_actuales:
            raise ValueError("El voluntario ya esta asignado")

        vol = self.voluntario_repo.get_by_cedula(id_voluntario)
        self.repo.assign_voluntario(id_jornada, vol.id)
        return {"message": f"Voluntario '{id_voluntario}' asignado a jornada '{id_jornada}'."}

    def reporte_jornadas(self):
        jornadas = self.list_jornadas()
        reporte = []
        for jornada in jornadas:
            cantidad_voluntarios = jornada.cantidad_voluntarios if jornada.cantidad_voluntarios is not None else 0
            reporte.append({
                "ID": jornada.id_jornada,
                "Fecha": jornada.fecha,
                "Descripcion": jornada.descripcion,
                "Basura (kg)": jornada.cantidad_basura_total,
                "Voluntarios": cantidad_voluntarios,
                "Zona": jornada.zona.nombre_zona if jornada.zona else "N/A"
            })
        return reporte

    def filtrar_jornadas(self, fecha_desde=None, fecha_hasta=None, id_zona=None):
        jornadas = self.list_jornadas()

        resultado = []
        for jornada in jornadas:
            if fecha_desde and jornada.fecha < fecha_desde:
                continue
            if fecha_hasta and jornada.fecha > fecha_hasta:
                continue
            if id_zona is not None and jornada.id_zona != id_zona:
                continue

            cantidad_voluntarios = jornada.cantidad_voluntarios if jornada.cantidad_voluntarios is not None else 0
            resultado.append({
                "ID": jornada.id_jornada,
                "Fecha": jornada.fecha,
                "Descripcion": jornada.descripcion,
                "Basura (kg)": jornada.cantidad_basura_total,
                "Voluntarios": cantidad_voluntarios,
                "Zona": jornada.zona.nombre_zona if jornada.zona else "N/A"
            })
        return resultado