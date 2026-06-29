from pydantic import BaseModel, ConfigDict


class BasuraSchema(BaseModel):
    idBasura: str
    tipoResiduo: str
    pesoKilos: float
    fecha: str

    model_config = ConfigDict(from_attributes=True)


class BasuraRegistroSchema(BaseModel):
    tipoResiduo: str
    pesoKilos: float
    fecha: str