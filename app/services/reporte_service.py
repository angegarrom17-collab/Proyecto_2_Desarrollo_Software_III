import json
from app.repository.reporte_repository import ReporteRepository


class ReporteService:
    def __init__(self):
        self.repo = ReporteRepository()

    def guardar_reporte(self, datos):
        residuos_json = json.dumps(datos.get("residuos_por_tipo", {}))
        return self.repo.guardar(
            total_basura_kg=datos.get("total_basura_kg", 0.0),
            promedio_basura_kg=datos.get("promedio_basura_kg", 0.0),
            total_jornadas=datos.get("total_jornadas", 0),
            total_animales_afectados=datos.get("total_animales_afectados", 0),
            animales_heridos=datos.get("animales_heridos", 0),
            animales_muertos=datos.get("animales_muertos", 0),
            residuos_por_tipo=residuos_json
        )

    def listar_reportes(self):
        return self.repo.listar()