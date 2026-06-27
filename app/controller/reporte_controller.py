from fastapi import APIRouter

from app.service.basura_service import BasuraService
from app.service.jornada_service import JornadaService
from app.config.database import SessionLocal
from app.entity.animal_afectado import AnimalORM

router = APIRouter(prefix="/reportes", tags=["Reportes"])
service_basura = BasuraService()
service_jornada = JornadaService()

@router.get("/resumen-ambiental")
def resumen_ambiental():
    total_basura = service_basura.total_basura()
    average_basura = service_basura.average_basura()
    por_tipo = service_basura.residuos_por_tipo()
    jornadas = service_jornada.list_jornadas()

    db = SessionLocal()
    try:
        total_animales = db.query(AnimalORM).count()
        animales_heridos = db.query(AnimalORM).filter_by(estado="herido").count()
        animales_muertos = db.query(AnimalORM).filter_by(estado="muerto").count()
    except Exception:
        total_animales = animales_heridos = animales_muertos = 0
    finally:
        db.close()

    return {
        "total_basura_kg": total_basura,
        "promedio_basura_kg": average_basura,
        "residuos_por_tipo": por_tipo,
        "total_jornadas": len(jornadas),
        "total_animales_afectados": total_animales,
        "animales_heridos": animales_heridos,
        "animales_muertos": animales_muertos
    }

@router.get("/jornadas-detalle")
def jornadas_detalle():
    return service_jornada.reporte_jornadas()

@router.get("/impacto-por-zona")
def impacto_por_zona():
    jornadas = service_jornada.list_jornadas()
    impacto = {}
    for jornada in jornadas:
        nombre_zona = jornada.zona.nombre_zona if jornada.zona else "Sin zona"
        impacto[nombre_zona] = impacto.get(nombre_zona, 0) + jornada.cantidad_basura_total
    return impacto