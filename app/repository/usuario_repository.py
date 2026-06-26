from sqlalchemy import func
from app.config.database import SessionLocal
from app.models.usuario import UsuarioORM


class UsuarioRepository:
    def __init__(self):
        self.db = SessionLocal()

    def create(self, email, hashed_password, rol="encargado"):
        usuario = UsuarioORM(
            email=email,
            hashed_password=hashed_password,
            rol=rol
        )
        self.db.add(usuario)
        self.db.commit()
        self.db.refresh(usuario)
        return usuario

    def get(self, usuario_id):
        return self.db.query(UsuarioORM).filter_by(id=usuario_id).first()

    def get_all(self):
        return self.db.query(UsuarioORM).all()

    def update(self, usuario_id, email, hashed_password, rol):
        usuario = self.get(usuario_id)
        if usuario:
            usuario.email = email
            usuario.hashed_password = hashed_password
            usuario.rol = rol
            self.db.commit()
        return usuario

    def delete(self, usuario_id):
        usuario = self.get(usuario_id)
        if usuario:
            self.db.delete(usuario)
            self.db.commit()
        return usuario

    def get_by_email(self, email):
        return self.db.query(UsuarioORM).filter(func.lower(UsuarioORM.email) == email.lower()).first()