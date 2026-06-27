from fastapi import APIRouter, HTTPException

from app.service.basura_service import BasuraService
from app.schemas.basura_schema import BasuraSchema, BasuraRegistroSchema
import uuid

router = APIRouter(prefix="/basura", tags=["Basura"])
service = BasuraService()

@router.post("/", response_model=BasuraSchema)
def create_basura(basura: BasuraRegistroSchema):
    try:
        id_basura = str(uuid.uuid4())[:8]
        return service.create_basura(
            id_basura,
            basura.tipoResiduo,
            basura.pesoKilos,
            basura.fecha
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/", response_model=list[BasuraSchema])
def list_basura():
    return service.list_basura()

@router.get("/{id_basura}", response_model=BasuraSchema)
def get_basura(id_basura: str):
    basura = service.get_basura(id_basura)
    if not basura:
        raise HTTPException(status_code=404, detail="No encontrado")
    return basura

@router.put("/{id_basura}", response_model=BasuraSchema)
def update_basura(id_basura: str, basura: BasuraRegistroSchema):
    try:
        updated = service.update_basura(
            id_basura,
            basura.tipoResiduo,
            basura.pesoKilos,
            basura.fecha
        )
        if not updated:
            raise HTTPException(status_code=404, detail="No encontrado")
        return updated
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/{id_basura}")
def delete_basura(id_basura: str):
    deleted = service.delete_basura(id_basura)
    if not deleted:
        raise HTTPException(status_code=404, detail="Registro no encontrado")
    return {"message": "Basura eliminado"}

@router.get("/statistics/total")
def total_basura():
    return {"total enkg": service.total_basura()}

@router.get("/statistics/average")
def average_basura():
    return {"average en kg": service.average_basura()}

@router.get("/statistics/by-type")
def basura_by_type():
    return service.residuos_por_tipo()