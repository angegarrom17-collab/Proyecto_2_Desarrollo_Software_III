from pydantic import BaseModel, ConfigDict


class ZonaSchema(BaseModel):
    id_zona: int              # <-- era 'id'
    nombre_zona: str
    ubicacion: str
    nivel_contaminacion: str
    descripcion: str

    model_config = ConfigDict(from_attributes=True)


class ZonaCrearSchema(BaseModel):
    id_zona: int | None = None   # <-- permití que el frontend envíe el ID
    nombre_zona: str
    ubicacion: str
    nivel_contaminacion: str
    descripcion: str