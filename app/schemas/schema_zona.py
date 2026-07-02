from pydantic import BaseModel, ConfigDict


class ZonaSchema(BaseModel):
    id_zona: int
    nombre_zona: str
    ubicacion: str
    nivel_contaminacion: str
    descripcion: str

    model_config = ConfigDict(from_attributes=True)


class ZonaCrearSchema(BaseModel):
    id_zona: int | None = None
    nombre_zona: str
    ubicacion: str
    nivel_contaminacion: str
    descripcion: str