from fastapi import APIRouter, HTTPException
from app.services.zona_service import ZonaService
from app.schemas.schema_zona import ZonaSchema, ZonaCrearSchema

router = APIRouter(prefix="/zonas", tags=["Zonas"])
service = ZonaService()


# GET /zonas/
@router.get("/", response_model=list[ZonaSchema])
def listar_zonas():
    """Devuelve la lista completa de zonas registradas."""
    return service.listar_zonas()


# GET /zonas/{zona_id}
@router.get("/{zona_id}", response_model=ZonaSchema)
def obtener_zona(zona_id: int):
    """Devuelve una zona específica por su ID."""
    zona = service.obtener_zona(zona_id)
    if not zona:
        raise HTTPException(status_code=404, detail="Zona no encontrada")
    return zona


# POST /zonas/
@router.post("/", response_model=ZonaSchema)
def crear_zona(data: ZonaCrearSchema):
    """Registra una nueva zona en el sistema."""
    try:
        return service.crear_zona(
            nombre_zona=data.nombre_zona,
            ubicacion=data.ubicacion,
            nivel_contaminacion=data.nivel_contaminacion,
            descripcion=data.descripcion
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


# PUT /zonas/{zona_id}
@router.put("/{zona_id}", response_model=ZonaSchema)
def actualizar_zona(zona_id: int, data: ZonaCrearSchema):
    """Actualiza los datos de una zona existente."""
    try:
        return service.actualizar_zona(
            zona_id=zona_id,
            nombre_zona=data.nombre_zona,
            ubicacion=data.ubicacion,
            nivel_contaminacion=data.nivel_contaminacion,
            descripcion=data.descripcion
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


# DELETE /zonas/{zona_id}
@router.delete("/{zona_id}")
def eliminar_zona(zona_id: int):
    """Elimina una zona del sistema por su ID."""
    zona = service.eliminar_zona(zona_id)
    if not zona:
        raise HTTPException(status_code=404, detail="Zona no encontrada")
    return {"message": "Zona eliminada correctamente"}


# GET /zonas/buscar/nivel?nivel=alto
@router.get("/buscar/nivel", response_model=list[ZonaSchema])
def buscar_por_nivel(nivel: str):
    """Filtra zonas por nivel de contaminación."""
    try:
        return service.buscar_por_nivel(nivel)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))