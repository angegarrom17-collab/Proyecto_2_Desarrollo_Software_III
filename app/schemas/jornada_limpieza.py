from pydantic import BaseModel, ConfigDict
from typing import List

class ZonaResumenSchema(BaseModel):
    id_zona: int
    nombre_zona: str
    ubicacion: str
    nivel_contaminacion: str

    model_config = ConfigDict(from_attributes=True)

class VoluntarioResumenSchema(BaseModel):
    id_voluntario: str
    nombre: str

    model_config = ConfigDict(from_attributes=True)

class JornadaSchema(BaseModel):
    id_jornada: str
    fecha: str
    descripcion: str
    cantidad_basura_total: int
    observaciones: str
    id_zona: int
    zona: ZonaResumenSchema | None = None
    voluntarios: List[VoluntarioResumenSchema] = []

    model_config = ConfigDict(from_attributes=True)

class JornadaRegistroSchema(BaseModel):
    id_jornada: str
    fecha: str
    descripcion: str
    cantidad_basura_total: int
    observaciones: str
    id_zona: int

class AsignacionVoluntarioSchema(BaseModel):
    id_voluntario: str