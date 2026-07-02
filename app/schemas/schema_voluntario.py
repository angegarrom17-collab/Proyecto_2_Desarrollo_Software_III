from pydantic import BaseModel, ConfigDict

class VoluntarioSchema(BaseModel):
    id: int
    nombre: str
    email: str
    edad: int
    organizacion: str
    telefono: str

    model_config = ConfigDict(from_attributes=True)