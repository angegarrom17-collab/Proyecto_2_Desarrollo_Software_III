from sqlalchemy import func
from app.config.database import SessionLocal
from app.models.usuario import UsuarioORM

class UsuarioRepository:
    def create(self, id, email, hashed_password, rol="encargado"):
        db = SessionLocal()
        try:
            usuario = UsuarioORM(
                id=str(id),
                email=email,
                hashed_password=hashed_password,
                rol=rol
            )
            db.add(usuario)
            db.commit()
            db.refresh(usuario)
            return usuario
        finally:
            db.close()

    def get(self, usuario_id):
        db = SessionLocal()
        try:
            return db.query(UsuarioORM).filter_by(id=str(usuario_id)).first()
        finally:
            db.close()

    def get_all(self):
        db = SessionLocal()
        try:
            return db.query(UsuarioORM).all()
        finally:
            db.close()

    def update(self, usuario_id, email, hashed_password, rol):
        db = SessionLocal()
        try:
            usuario = db.query(UsuarioORM).filter_by(id=str(usuario_id)).first()
            if usuario:
                usuario.email = email
                usuario.hashed_password = hashed_password
                usuario.rol = rol
                db.commit()
                db.refresh(usuario)
            return usuario
        finally:
            db.close()

    def delete(self, usuario_id):
        db = SessionLocal()
        try:
            usuario = db.query(UsuarioORM).filter_by(id=str(usuario_id)).first()
            if usuario:
                db.delete(usuario)
                db.commit()
            return usuario
        finally:
            db.close()

    def get_by_email(self, email):
        db = SessionLocal()
        try:
            return db.query(UsuarioORM).filter(func.lower(UsuarioORM.email) == email.lower()).first()
        finally:
            db.close()