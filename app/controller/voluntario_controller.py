from fastapi import APIRouter, HTTPException
from app.services.voluntario_service import VoluntarioService
from app.schemas.schema_voluntario import VoluntarioSchema, VoluntarioRegistroSchema

router = APIRouter(prefix="/voluntarios", tags=["Voluntarios"])
voluntario_service = VoluntarioService()


@router.post("/", response_model=VoluntarioSchema)
def crear_voluntario(voluntario: VoluntarioRegistroSchema):
    try:
        return voluntario_service.crear_voluntario(
            cedula=voluntario.cedula,
            nombre=voluntario.nombre,
            email=voluntario.email,
            edad=voluntario.edad,
            organizacion=voluntario.organizacion
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/", response_model=list[VoluntarioSchema])
def listar_voluntarios():
    return voluntario_service.listar_voluntarios()


@router.get("/{voluntario_id}", response_model=VoluntarioSchema)
def obtener_voluntario(voluntario_id: int):
    voluntario = voluntario_service.obtener_voluntario(voluntario_id)
    if not voluntario:
        raise HTTPException(status_code=404, detail="Voluntario no encontrado")
    return voluntario


@router.put("/{voluntario_id}", response_model=VoluntarioSchema)
def actualizar_voluntario(voluntario_id: int, voluntario: VoluntarioRegistroSchema):
    try:
        return voluntario_service.actualizar_voluntario(
            voluntario_id=voluntario_id,
            cedula=voluntario.cedula,
            nombre=voluntario.nombre,
            email=voluntario.email,
            edad=voluntario.edad,
            organizacion=voluntario.organizacion
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/{voluntario_id}")
def eliminar_voluntario(voluntario_id: int):
    try:
        voluntario_service.eliminar_voluntario(voluntario_id)
        return {"status": "success", "message": "Voluntario eliminado correctamente"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/buscar/{organizacion}", response_model=list[VoluntarioSchema])
def buscar_por_organizacion(organizacion: str):
    try:
        return voluntario_service.buscar_por_organizacion(organizacion)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))