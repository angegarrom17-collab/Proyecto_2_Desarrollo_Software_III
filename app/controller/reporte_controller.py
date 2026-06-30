from fastapi import APIRouter, HTTPException
from app.services.basura_service import BasuraService
from app.services.jornada_service import JornadaService
from app.services.fauna_service import FaunaService
from app.services.material_service import MaterialService
from app.services.reporte_service import ReporteService

router = APIRouter( tags=["Reportes"])
service_basura = BasuraService()
service_jornada = JornadaService()
service_fauna = FaunaService()
service_material = MaterialService()
service_reporte = ReporteService()


@router.get("/resumen-ambiental")
def resumen_ambiental():
    total_basura = service_basura.total_basura()
    average_basura = service_basura.average_basura()
    por_tipo = service_basura.residuos_por_tipo()
    jornadas = service_jornada.list_jornadas()

    try:
        reporte_fauna = service_fauna.reporte_fauna()
        total_animales = reporte_fauna.get("total_animales", 0)
        animales_heridos = reporte_fauna.get("heridos", 0)
        animales_muertos = reporte_fauna.get("muertos", 0)
    except Exception:
        total_animales = animales_heridos = animales_muertos = 0

    resultado = {
        "total_basura_kg": total_basura,
        "promedio_basura_kg": average_basura,
        "residuos_por_tipo": por_tipo,
        "total_jornadas": len(jornadas),
        "total_animales_afectados": total_animales,
        "animales_heridos": animales_heridos,
        "animales_muertos": animales_muertos
    }

    # Guardar en base de datos
    try:
        service_reporte.guardar_reporte(resultado)
    except Exception as e:
        print(f"Error guardando reporte: {e}")

    return resultado


@router.get("/jornadas-detalle")
def jornadas_detalle():
    return service_jornada.reporte_jornadas()


@router.get("/jornadas-filtradas")
def jornadas_filtradas(fecha_desde: str = None, fecha_hasta: str = None, id_zona: int = None):
    return service_jornada.filtrar_jornadas(fecha_desde, fecha_hasta, id_zona)


@router.get("/impacto-por-zona")
def impacto_por_zona():
    jornadas = service_jornada.list_jornadas()
    impacto = {}
    for jornada in jornadas:
        nombre_zona = jornada.zona.nombre_zona if jornada.zona else "Sin zona"
        impacto[nombre_zona] = impacto.get(nombre_zona, 0) + jornada.cantidad_basura_total
    return impacto


@router.get("/materiales-bajo-stock")
def materiales_bajo_stock(umbral: int = 10):
    try:
        return service_material.reporte_stock_bajo(umbral)
    except Exception as e:
        raise HTTPException(
            status_code=503,
            detail=f"Servicio de materiales no disponible: {str(e)}"
        )


@router.get("/historial")
def historial_reportes():
    """Devuelve todos los reportes guardados en la base de datos."""
    return service_reporte.listar_reportes()