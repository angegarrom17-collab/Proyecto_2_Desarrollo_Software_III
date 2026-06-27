from sqlalchemy import func

from app.config.database import SessionLocal
from app.entity.basura_recolectada import BasuraORM

class BasuraRepository:
    def __init__(self):
        self.db = SessionLocal()

    def create(self, id_basura, tipo_residuo, peso_kilos, fecha):
        basura = BasuraORM(
            idBasura=id_basura,
            tipoResiduo=tipo_residuo,
            pesoKilos=peso_kilos,
            fecha=fecha
        )
        self.db.add(basura)
        self.db.commit()
        return basura

    def get(self, id_basura):
        return self.db.query(BasuraORM).filter_by(idBasura=id_basura).first()

    def get_all(self):
        return self.db.query(BasuraORM).all()

    def update(self, id_basura, tipo_residuo, peso_kilos, fecha):
        basura = self.get(id_basura)
        if basura:
            basura.tipoResiduo = tipo_residuo
            basura.pesoKilos = peso_kilos
            basura.fecha = fecha
            self.db.commit()
        return basura

    def delete(self, id_basura):
        basura = self.get(id_basura)
        if basura:
            self.db.delete(basura)
            self.db.commit()
        return basura

    def total_peso(self):
        total = self.db.query(func.sum(BasuraORM.pesoKilos)).scalar()
        return float(total) if total is not None else 0.0

    def average_peso(self):
        average = self.db.query(func.avg(BasuraORM.pesoKilos)).scalar()
        return float(average) if average is not None else 0.0

    def group_by_tipo(self):
        rows = self.db.query(BasuraORM.tipoResiduo, func.sum(BasuraORM.pesoKilos)).group_by(BasuraORM.tipoResiduo).all()
        result = {}
        for tipo, peso in rows:
            result[tipo] = float(peso) if peso is not None else 0.0
        return result