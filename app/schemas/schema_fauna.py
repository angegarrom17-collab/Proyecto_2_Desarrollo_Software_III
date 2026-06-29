from pydantic import BaseModel, ConfigDict


class AnimalAfectadoSchema(BaseModel):
    id: int
    especie: str
    estado: str
    descripcion: str

    model_config = ConfigDict(from_attributes=True)


class AnimalAfectadoCrearSchema(BaseModel):
    especie: str
    estado: str
    descripcion: str