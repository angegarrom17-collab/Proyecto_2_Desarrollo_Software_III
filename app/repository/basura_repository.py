from sqlalchemy import func
from app.config.database import SessionLocal
from app.models.basura_recolectada import BasuraORM


class BasuraRepository:
    def __init__(self):
        self.db = SessionLocal()

    def _close(self):
        self.db.close()

    def create(self, id_basura, tipo_residuo, peso_kilos, fecha):
        basura = BasuraORM(
            idBasura=id_basura,
            tipoResiduo=tipo_residuo,
            pesoKilos=peso_kilos,
            fecha=fecha
        )
        self.db.add(basura)
        self.db.commit()
        self.db.refresh(basura)
        self._close()
        return basura

    def get(self, id_basura):
        result = self.db.query(BasuraORM).filter_by(idBasura=id_basura).first()
        self._close()
        return result

    def get_all(self):
        result = self.db.query(BasuraORM).all()
        self._close()
        return result

    def update(self, id_basura, tipo_residuo, peso_kilos, fecha):
        basura = self.get(id_basura)
        if basura:
            basura.tipoResiduo = tipo_residuo
            basura.pesoKilos = peso_kilos
            basura.fecha = fecha
            self.db.commit()
            self.db.refresh(basura)
            self._close()
        return basura

    def delete(self, id_basura):
        basura = self.get(id_basura)
        if basura:
            self.db.delete(basura)
            self.db.commit()
            self._close()
        return basura

    def total_peso(self):
        total = self.db.query(func.sum(BasuraORM.pesoKilos)).scalar()
        self._close()
        return float(total) if total is not None else 0.0

    def average_peso(self):
        average = self.db.query(func.avg(BasuraORM.pesoKilos)).scalar()
        self._close()
        return float(average) if average is not None else 0.0

    def group_by_tipo(self):
        rows = self.db.query(BasuraORM.tipoResiduo, func.sum(BasuraORM.pesoKilos)).group_by(BasuraORM.tipoResiduo).all()
        self._close()
        result = {}
        for tipo, peso in rows:
            result[tipo] = float(peso) if peso is not None else 0.0
        return result

    def count_by_tipo(self):
        rows = self.db.query(BasuraORM.tipoResiduo, func.count(BasuraORM.idBasura)).group_by(BasuraORM.tipoResiduo).all()
        self._close()
        return {tipo: int(cantidad) for tipo, cantidad in rows}