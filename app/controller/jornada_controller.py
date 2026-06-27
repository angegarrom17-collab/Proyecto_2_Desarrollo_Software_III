from fastapi import APIRouter, HTTPException

from app.service.jornada_service import JornadaService
from app.schemas.jornada_schema import JornadaSchema, JornadaRegistroSchema, AsignacionVoluntarioSchema
from app.config.database import SessionLocal
from app.entity.zona import ZonaORM

router = APIRouter(prefix="/jornadas", tags=["Jornadas"])
service = JornadaService()

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

@router.get("/{id_jornada}", response_model=JornadaSchema)
def get_jornada(id_jornada: str):
    jornada = service.get_jornada(id_jornada)
    if not jornada:
        raise HTTPException(status_code=404, detail="Jornada no encontrada")
    return jornada

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

@router.get("/report/jornadas")
def reporte_jornadas():
    return service.reporte_jornadas()

@router.get("/zonas/registradas")
def zonas_registradas():
    db = SessionLocal()
    try:
        zonas = db.query(ZonaORM).all()
        return [
            {
                "id_zona": z.id_zona,
                "nombre_zona": z.nombre_zona,
                "ubicacion": z.ubicacion,
                "nivel_contaminacion": z.nivel_contaminacion
            }
            for z in zonas
        ]
    finally:
        db.close()