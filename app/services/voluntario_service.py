from app.repository.voluntario_repository import VoluntarioRepository

class VoluntarioService:
    def __init__(self):
        self.repo = VoluntarioRepository()

    def create_voluntario(self, id, nombre, email, edad, organizacion, telefono):
        return self.repo.create(id, nombre, email, edad, organizacion, telefono)

    def get_voluntario(self, id):
        return self.repo.get(id)

    def list_voluntarios(self):
        return self.repo.get_all()

    def update_voluntario(self, id, nombre, email, edad, organizacion, telefono):
        return self.repo.update(id, nombre, email, edad, organizacion, telefono)

    def delete_voluntario(self, id):
        return self.repo.delete(id)