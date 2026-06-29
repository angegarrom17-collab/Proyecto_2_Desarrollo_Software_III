from pydantic import BaseModel, ConfigDict


class MaterialSchema(BaseModel):
    id: int
    nombre: str
    descripcion: str | None = None
    cantidad: int

    model_config = ConfigDict(from_attributes=True)


class MaterialCrearSchema(BaseModel):
    id: int
    nombre: str
    descripcion: str | None = None
    cantidad: int