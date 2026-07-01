from pydantic import BaseModel, ConfigDict
from typing import List, Optional


class ZonaResumenSchema(BaseModel):
    id_zona: int
    nombre_zona: str
    ubicacion: str
    nivel_contaminacion: str

    model_config = ConfigDict(from_attributes=True)


class VoluntarioResumenSchema(BaseModel):
    cedula: str
    nombre: str

    model_config = ConfigDict(from_attributes=True)


class JornadaSchema(BaseModel):
    id_jornada: str
    fecha: str
    descripcion: str
    cantidad_basura_total: int
    observaciones: str
    id_zona: int
    cantidad_voluntarios: int = 0
    zona: Optional[ZonaResumenSchema] = None
    voluntarios: List[VoluntarioResumenSchema] = []

    model_config = ConfigDict(from_attributes=True)


class JornadaRegistroSchema(BaseModel):
    id_jornada: str
    fecha: str
    descripcion: str
    cantidad_basura_total: int
    observaciones: str
    id_zona: int
    cantidad_voluntarios: int = 0          # <-- NUEVO


class AsignacionVoluntarioSchema(BaseModel):
    id_voluntario: str


class JornadaFiltroSchema(BaseModel):
    fecha_desde: Optional[str] = None
    fecha_hasta: Optional[str] = None
    id_zona: Optional[int] = None