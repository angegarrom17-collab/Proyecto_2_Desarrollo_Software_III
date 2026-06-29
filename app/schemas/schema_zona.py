from pydantic import BaseModel, ConfigDict


class ZonaSchema(BaseModel):
    id: int
    nombre_zona: str
    ubicacion: str
    nivel_contaminacion: str
    descripcion: str

    model_config = ConfigDict(from_attributes=True)

class ZonaCrearSchema(BaseModel):
    nombre_zona: str
    ubicacion: str
    nivel_contaminacion: str
    descripcion: str