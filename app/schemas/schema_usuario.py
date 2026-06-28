from pydantic import BaseModel, ConfigDict
from typing import Optional

class UsuarioRegistroSchema(BaseModel):
    id: str
    nombre: str           # ← NUEVO
    email: str
    password: str
    rol: str = "encargado"

class UsuarioActualizarSchema(BaseModel):
    nombre: str           # ← NUEVO
    email: str
    password: Optional[str] = ""
    rol: str = "encargado"

class UsuarioSchema(BaseModel):
    id: str
    nombre: str           # ← NUEVO
    email: str
    rol: str

    model_config = ConfigDict(from_attributes=True)