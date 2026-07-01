from pydantic import BaseModel, ConfigDict

class UsuarioSchema(BaseModel):
    id: str
    nombre: str
    email: str
    hashed_password: str
    rol: str
    model_config = ConfigDict(from_attributes=True)

class UsuarioRegistroSchema(BaseModel):
    id: str
    nombre: str
    email: str
    password: str
    rol: str

class UsuarioActualizarSchema(BaseModel):
    nombre: str
    email: str
    password: str | None = None
    rol: str

class UsuarioLoginSchema(BaseModel):
    email: str
    password: str
