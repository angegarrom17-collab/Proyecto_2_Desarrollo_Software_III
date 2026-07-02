from sqlalchemy import func
from app.config.database import SessionLocal
from app.models.basura_recolectada import BasuraORM


class BasuraRepository:
    def create(self, id_basura, tipo_residuo, peso_kilos, fecha):
        db = SessionLocal()
        try:
            basura = BasuraORM(
                idBasura=id_basura,
                tipoResiduo=tipo_residuo,
                pesoKilos=peso_kilos,
                fecha=fecha
            )
            db.add(basura)
            db.commit()
            db.refresh(basura)
            return basura
        except Exception:
            db.rollback()
            raise
        finally:
            db.close()

    def get(self, id_basura):
        db = SessionLocal()
        try:
            return db.query(BasuraORM).filter_by(idBasura=id_basura).first()
        finally:
            db.close()

    def get_all(self):
        db = SessionLocal()
        try:
            return db.query(BasuraORM).all()
        finally:
            db.close()

    def update(self, id_basura, tipo_residuo, peso_kilos, fecha):
        db = SessionLocal()
        try:
            basura = db.query(BasuraORM).filter_by(idBasura=id_basura).first()
            if basura:
                basura.tipoResiduo = tipo_residuo
                basura.pesoKilos = peso_kilos
                basura.fecha = fecha
                db.commit()
                db.refresh(basura)
            return basura
        except Exception:
            db.rollback()
            raise
        finally:
            db.close()

    def delete(self, id_basura):
        db = SessionLocal()
        try:
            basura = db.query(BasuraORM).filter_by(idBasura=id_basura).first()
            if basura:
                db.delete(basura)
                db.commit()
            return basura
        except Exception:
            db.rollback()
            raise
        finally:
            db.close()

    def total_peso(self):
        db = SessionLocal()
        try:
            total = db.query(func.sum(BasuraORM.pesoKilos)).scalar()
            return float(total) if total is not None else 0.0
        finally:
            db.close()

    def average_peso(self):
        db = SessionLocal()
        try:
            average = db.query(func.avg(BasuraORM.pesoKilos)).scalar()
            return float(average) if average is not None else 0.0
        finally:
            db.close()

    def group_by_tipo(self):
        db = SessionLocal()
        try:
            rows = db.query(BasuraORM.tipoResiduo, func.sum(BasuraORM.pesoKilos)).group_by(BasuraORM.tipoResiduo).all()
            result = {}
            for tipo, peso in rows:
                result[tipo] = float(peso) if peso is not None else 0.0
            return result
        finally:
            db.close()

    def count_by_tipo(self):
        db = SessionLocal()
        try:
            rows = db.query(BasuraORM.tipoResiduo, func.count(BasuraORM.idBasura)).group_by(BasuraORM.tipoResiduo).all()
            return {tipo: int(cantidad) for tipo, cantidad in rows}
        finally:
            db.close()