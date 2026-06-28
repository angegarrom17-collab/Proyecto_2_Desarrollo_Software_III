from pydantic import BaseModel, ConfigDict

class UsuarioRegistroSchema(BaseModel):
    email: str
    password: str
    rol: str = "encargado"

class UsuarioSchema(BaseModel):
    id: int
    email: str
    rol: str


    model_config = ConfigDict(from_attributes=True)