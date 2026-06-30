from pydantic import BaseModel, ConfigDict
from datetime import datetime


class ReporteGeneradoSchema(BaseModel):
    id: int
    fecha_generacion: datetime
    total_basura_kg: float
    promedio_basura_kg: float
    total_jornadas: int
    total_animales_afectados: int
    animales_heridos: int
    animales_muertos: int
    residuos_por_tipo: str

    model_config = ConfigDict(from_attributes=True)