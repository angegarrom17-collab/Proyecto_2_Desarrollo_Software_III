from pydantic import BaseModel, ConfigDict

class UsuarioSchema(BaseModel):

    id: int
    email: str
    password: str
    rol: str

    model_config = ConfigDict(from_attributes=True)