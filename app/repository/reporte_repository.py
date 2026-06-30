import json
from app.config.database import SessionLocal
from app.models.reporte_generado import ReporteGeneradoORM


class ReporteRepository:
    def guardar(self, total_basura_kg, promedio_basura_kg, total_jornadas,
                total_animales_afectados, animales_heridos, animales_muertos, residuos_por_tipo):
        db = SessionLocal()
        try:
            reporte = ReporteGeneradoORM(
                total_basura_kg=total_basura_kg,
                promedio_basura_kg=promedio_basura_kg,
                total_jornadas=total_jornadas,
                total_animales_afectados=total_animales_afectados,
                animales_heridos=animales_heridos,
                animales_muertos=animales_muertos,
                residuos_por_tipo=residuos_por_tipo
            )
            db.add(reporte)
            db.commit()
            db.refresh(reporte)
            return reporte
        except Exception:
            db.rollback()
            raise
        finally:
            db.close()

    def listar(self):
        db = SessionLocal()
        try:
            return db.query(ReporteGeneradoORM).order_by(ReporteGeneradoORM.fecha_generacion.desc()).all()
        finally:
            db.close()