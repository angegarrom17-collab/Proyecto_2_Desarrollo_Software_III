from pydantic import BaseModel, ConfigDict

class UsuarioRegistroSchema(BaseModel):
    id: str  # <-- String en vez de int
    email: str
    password: str
    rol: str = "encargado"

class UsuarioSchema(BaseModel):
    id: str  # <-- String en vez de int
    email: str
    rol: str

    model_config = ConfigDict(from_attributes=True)