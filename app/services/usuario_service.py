from app.repository.usuario_repository import UsuarioRepository

class UsuarioService:
    def __init__(self):
        self.repo = UsuarioRepository()

    def validar_reglas_negocio(self, email, rol):
        if "@" not in email:
            raise ValueError("El correo no tiene formato válido")

        if rol.strip().lower() not in ["encargado"]:
            raise ValueError("Tipo de usuario no válido. Solo se acepta: encargado")

    def crear_usuario(self, id, email, password, rol):
        if self.repo.get_by_email(email.strip()):
            raise ValueError("El correo electrónico ya se encuentra registrado.")

        if len(password) < 6:
            raise ValueError("La contraseña debe tener al menos 6 caracteres")

        self.validar_reglas_negocio(email, rol)

        return self.repo.create(
            id=str(id).strip(),
            email=email.strip(),
            hashed_password=password,
            rol=rol.strip().lower()
        )

    def obtener_usuario(self, usuario_id):
        return self.repo.get(usuario_id)

    def listar_usuarios(self):
        return self.repo.get_all()

    def actualizar_usuario(self, usuario_id, email, password, rol):
        usuario = self.repo.get(usuario_id)
        if not usuario:
            raise ValueError(f"No existe usuario con ID {usuario_id}")

        self.validar_reglas_negocio(email, rol)

        if password.strip() == "":
            nueva_contrasena = usuario.hashed_password
        else:
            if len(password) < 6:
                raise ValueError("La contraseña debe tener al menos 6 caracteres")
            nueva_contrasena = password

        return self.repo.update(
            usuario_id=usuario_id,
            email=email.strip(),
            hashed_password=nueva_contrasena,
            rol=rol.strip().lower()
        )

    def eliminar_usuario(self, usuario_id):
        return self.repo.delete(usuario_id)

    def iniciar_sesion(self, email, password):
        usuario = self.repo.get_by_email(email.strip())
        if usuario is None:
            raise ValueError("Usuario no encontrado")

        if usuario.hashed_password != password:
            raise ValueError("Contraseña incorrecta")

        return usuario

    def es_encargado(self, usuario_objeto) -> bool:
        return usuario_objeto.rol == "encargado"