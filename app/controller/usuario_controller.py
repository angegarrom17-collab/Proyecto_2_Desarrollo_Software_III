from fastapi import APIRouter, HTTPException
from app.services.usuario_service import UsuarioService
from app.schemas.schema_usuario import (
    UsuarioRegistroSchema,
    UsuarioActualizarSchema,
    UsuarioSchema
)

router = APIRouter()
service = UsuarioService()


@router.get("/", response_model=list[UsuarioSchema])
def listar_usuarios():
    """Devuelve la lista completa de usuarios registrados."""
    return service.listar_usuarios()



@router.get("/{usuario_id}", response_model=UsuarioSchema)
def obtener_usuario(usuario_id: str):
    """Devuelve un usuario específico por su ID."""
    usuario = service.obtener_usuario(usuario_id)
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return usuario



@router.post("/", response_model=UsuarioSchema)
def crear_usuario(data: UsuarioRegistroSchema):
    """Registra un nuevo usuario en el sistema."""
    try:
        return service.crear_usuario(
            id=data.id,
            nombre=data.nombre,
            email=data.email,
            password=data.password,
            rol=data.rol
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))



@router.put("/{usuario_id}", response_model=UsuarioSchema)
def actualizar_usuario(usuario_id: str, data: UsuarioActualizarSchema):
    """Actualiza los datos de un usuario existente."""
    try:
        return service.actualizar_usuario(
            usuario_id=usuario_id,
            nombre=data.nombre,
            email=data.email,
            password=data.password or "",
            rol=data.rol
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))



@router.delete("/{usuario_id}")
def eliminar_usuario(usuario_id: str):
    """Elimina un usuario del sistema por su ID."""
    usuario = service.eliminar_usuario(usuario_id)
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return {"message": "Usuario eliminado correctamente"}