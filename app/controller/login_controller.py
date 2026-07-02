from fastapi import APIRouter, HTTPException
from app.services.usuario_service import UsuarioService
from app.schemas.schema_usuario import UsuarioLoginSchema

router = APIRouter(tags=["Auth"])
service = UsuarioService()

@router.post("/login")
def login(datos: UsuarioLoginSchema):
    usuario = service.autenticar(datos.email, datos.password)
    if not usuario:
        raise HTTPException(status_code=401, detail="Correo o contraseña incorrectos")
    return {
        "success": True,
        "message": "Login exitoso",
        "usuario": {
            "id": usuario.id,
            "nombre": usuario.nombre,
            "email": usuario.email,
            "rol": usuario.rol
        }
    }