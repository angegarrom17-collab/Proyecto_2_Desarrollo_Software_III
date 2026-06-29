from pydantic import BaseModel, ConfigDict


class MaterialSchema(BaseModel):
    id: int
    nombre: str
    unidad_medida: str
    cantidad_disponible: int

    model_config = ConfigDict(from_attributes=True)


class MaterialCrearSchema(BaseModel):
    nombre: str
    unidad_medida: str
    cantidad_disponible: int