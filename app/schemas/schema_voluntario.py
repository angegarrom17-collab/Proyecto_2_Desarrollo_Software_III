from pydantic import BaseModel, ConfigDict

class VoluntarioRegistroSchema(BaseModel):
    cedula: str
    nombre: str
    email: str
    edad: int
    organizacion: str

class VoluntarioSchema(BaseModel):
    id: int
    cedula: str
    nombre: str
    email: str
    edad: int
    organizacion: str

    model_config = ConfigDict(from_attributes=True)