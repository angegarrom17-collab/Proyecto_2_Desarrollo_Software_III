from app.repository.basura_repository import BasuraRepository

class BasuraService:
    def __init__(self):
        self.repo = BasuraRepository()

    def _validate_common_data(self, tipo_residuo, peso_kilos, fecha):
        if not tipo_residuo or tipo_residuo.strip() == "":
            raise ValueError("El tipo de residuo no puede estar vacio")
        if peso_kilos < 0:
            raise ValueError("El peso no puede ser negativo")
        if not fecha or fecha.strip() == "":
            raise ValueError("La fecha no puede estar vacia")

    def create_basura(self, id_basura, tipo_residuo, peso_kilos, fecha):
        if not id_basura or id_basura.strip() == "":
            raise ValueError("El id no puede estar vacio")
        if self.repo.get(id_basura):
            raise ValueError("El id ya esta registrado")

        self._validate_common_data(tipo_residuo, peso_kilos, fecha)

        return self.repo.create(
            id_basura.strip(),
            tipo_residuo.strip(),
            peso_kilos,
            fecha.strip()
        )

    def get_basura(self, id_basura):
        return self.repo.get(id_basura)

    def list_basura(self):
        return self.repo.get_all()

    def update_basura(self, id_basura, tipo_residuo, peso_kilos, fecha):
        basura = self.repo.get(id_basura)
        if not basura:
            return None

        self._validate_common_data(tipo_residuo, peso_kilos, fecha)

        return self.repo.update(
            id_basura,
            tipo_residuo.strip(),
            peso_kilos,
            fecha.strip()
        )

    def delete_basura(self, id_basura):
        return self.repo.delete(id_basura)

    def total_basura(self):
        return self.repo.total_peso()

    def average_basura(self):
        return self.repo.average_peso()

    def residuos_por_tipo(self):
        return self.repo.group_by_tipo()