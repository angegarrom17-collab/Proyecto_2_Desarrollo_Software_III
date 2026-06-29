from fastapi import APIRouter, HTTPException
from app.services.voluntario_service import VoluntarioService
from app.schemas.schema_voluntario import VoluntarioSchema

router = APIRouter(tags=["Voluntarios"])
service = VoluntarioService()

@router.post("/", response_model=VoluntarioSchema)
def create_voluntario(voluntario: VoluntarioSchema):
    result = service.create_voluntario(
        voluntario.id,
        voluntario.nombre,
        voluntario.email,
        voluntario.edad,
        voluntario.organizacion,
        voluntario.telefono
    )
    if result is None:
        raise HTTPException(status_code=400, detail="Ya existe un voluntario con ese email o ID")
    return result

@router.get("/{id}", response_model=VoluntarioSchema)
def get_voluntario(id: int):
    voluntario = service.get_voluntario(id)
    if not voluntario:
        raise HTTPException(status_code=404, detail="Voluntario no encontrado")
    return voluntario

@router.get("/", response_model=list[VoluntarioSchema])
def list_voluntarios():
    return service.list_voluntarios()

@router.put("/{id}", response_model=VoluntarioSchema)
def update_voluntario(id: int, voluntario: VoluntarioSchema):
    updated = service.update_voluntario(
        id,
        voluntario.nombre,
        voluntario.email,
        voluntario.edad,
        voluntario.organizacion,
        voluntario.telefono
    )
    if updated is None:
        raise HTTPException(status_code=400, detail="Ya existe un voluntario con ese email o no se encontro")
    return updated

@router.delete("/{id}")
def delete_voluntario(id: int):
    deleted = service.delete_voluntario(id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Voluntario no encontrado")
    return {"message": "Voluntario eliminado"}