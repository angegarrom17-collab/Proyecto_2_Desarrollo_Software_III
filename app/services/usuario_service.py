from app.repository.usuario_repository import UsuarioRepository
import bcrypt

class UsuarioService:
    def __init__(self):
        self.repo = UsuarioRepository()

    def crear_usuario(self, id, nombre, email, password, rol="encargado"):
        return self.repo.create(id, nombre, email, password, rol)

    def obtener_usuario(self, id):
        return self.repo.get(id)

    def listar_usuarios(self):
        return self.repo.get_all()

    def actualizar_usuario(self, usuario_id, nombre, email, password, rol):
        hashed = bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()
        return self.repo.update(usuario_id, nombre, email, hashed, rol)

    def eliminar_usuario(self, id):
        return self.repo.delete(id)

    def iniciar_sesion(self, email, password):
        usuario = self.repo.get_by_email(email)
        if not usuario:
            raise ValueError("Correo o contraseña incorrectos")
        if usuario.hashed_password == password:
            return usuario
        raise ValueError("Correo o contraseña incorrectos")

    def autenticar(self, email, password):
        try:
            return self.iniciar_sesion(email, password)
        except ValueError:
            return None