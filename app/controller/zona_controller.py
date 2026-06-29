from fastapi import APIRouter, HTTPException
from app.services.zona_service import ZonaService
from app.schemas.schema_zona import ZonaSchema, ZonaCrearSchema

router = APIRouter(tags=["Zonas"])   # <-- quitá prefix="/zonas"
service = ZonaService()


@router.get("/", response_model=list[ZonaSchema])
def listar_zonas():
    return service.listar_zonas()


@router.get("/{zona_id}", response_model=ZonaSchema)
def obtener_zona(zona_id: int):
    zona = service.obtener_zona(zona_id)
    if not zona:
        raise HTTPException(status_code=404, detail="Zona no encontrada")
    return zona


@router.post("/", response_model=ZonaSchema)
def crear_zona(data: ZonaCrearSchema):
    try:
        return service.crear_zona(
            id_zona=data.id_zona,          # <-- agregá id_zona
            nombre_zona=data.nombre_zona,
            ubicacion=data.ubicacion,
            nivel_contaminacion=data.nivel_contaminacion,
            descripcion=data.descripcion
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.put("/{zona_id}", response_model=ZonaSchema)
def actualizar_zona(zona_id: int, data: ZonaCrearSchema):
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


@router.delete("/{zona_id}")
def eliminar_zona(zona_id: int):
    zona = service.eliminar_zona(zona_id)
    if not zona:
        raise HTTPException(status_code=404, detail="Zona no encontrada")
    return {"message": "Zona eliminada correctamente"}


@router.get("/buscar/nivel", response_model=list[ZonaSchema])
def buscar_por_nivel(nivel: str):
    try:
        return service.buscar_por_nivel(nivel)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))