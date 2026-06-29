from fastapi import APIRouter, HTTPException
from app.services.jornada_service import JornadaService
from app.schemas.schema_jornada_limpieza import JornadaSchema, JornadaRegistroSchema, AsignacionVoluntarioSchema

router = APIRouter(prefix="/jornadas", tags=["Jornadas"])
service = JornadaService()

@router.get("/report/jornadas")
def reporte_jornadas():
    return service.reporte_jornadas()


@router.get("/report/jornadas-filtradas")
def jornadas_filtradas(fecha_desde: str = None, fecha_hasta: str = None, id_zona: int = None):
    return service.filtrar_jornadas(fecha_desde, fecha_hasta, id_zona)

@router.post("/", response_model=JornadaSchema)
def create_jornada(jornada: JornadaRegistroSchema):
    try:
        return service.create_jornada(
            jornada.id_jornada,
            jornada.fecha,
            jornada.descripcion,
            jornada.cantidad_basura_total,
            jornada.observaciones,
            jornada.id_zona
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/", response_model=list[JornadaSchema])
def list_jornadas():
    return service.list_jornadas()


@router.put("/{id_jornada}", response_model=JornadaSchema)
def update_jornada(id_jornada: str, jornada: JornadaRegistroSchema):
    try:
        updated = service.update_jornada(
            id_jornada,
            jornada.fecha,
            jornada.descripcion,
            jornada.cantidad_basura_total,
            jornada.observaciones,
            jornada.id_zona
        )
        if not updated:
            raise HTTPException(status_code=404, detail="Jornada no encontrada")
        return updated
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/{id_jornada}")
def delete_jornada(id_jornada: str):
    deleted = service.delete_jornada(id_jornada)
    if not deleted:
        raise HTTPException(status_code=404, detail="Jornada no encontrada")
    return {"message": "Jornada eliminada"}


@router.post("/{id_jornada}/voluntarios")
def assign_voluntario(id_jornada: str, body: AsignacionVoluntarioSchema):
    try:
        return service.assign_voluntario(id_jornada, body.id_voluntario)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/{id_jornada}", response_model=JornadaSchema)
def get_jornada(id_jornada: str):
    jornada = service.get_jornada(id_jornada)
    if not jornada:
        raise HTTPException(status_code=404, detail="Jornada no encontrada")
    return jornada