from fastapi import APIRouter, HTTPException
from app.services.usuario_service import UsuarioService
from app.schemas.schema_usuario import UsuarioSchema, UsuarioRegistroSchema

router = APIRouter(prefix="/usuarios", tags=["Usuarios"])
usuario_service = UsuarioService()


@router.post("/", response_model=UsuarioSchema)
def crear_usuario(usuario: UsuarioRegistroSchema):
    try:
        return usuario_service.crear_usuario(
            id=usuario.id,
            email=usuario.email,
            password=usuario.password,
            rol=usuario.rol
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/", response_model=list[UsuarioSchema])
def listar_usuarios():
    return usuario_service.listar_usuarios()


@router.get("/{usuario_id}", response_model=UsuarioSchema)
def obtener_usuario(usuario_id: str):
    usuario = usuario_service.obtener_usuario(usuario_id)
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return usuario


@router.put("/{usuario_id}", response_model=UsuarioSchema)
def actualizar_usuario(usuario_id: str, usuario: UsuarioRegistroSchema):
    try:
        return usuario_service.actualizar_usuario(
            usuario_id=usuario_id,
            email=usuario.email,
            password=usuario.password,
            rol=usuario.rol
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/{usuario_id}")
def eliminar_usuario(usuario_id: str):
    try:
        usuario_service.eliminar_usuario(usuario_id)
        return {"status": "success", "message": "Usuario eliminado"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/login")
def login(usuario: UsuarioRegistroSchema):
    try:
        return usuario_service.iniciar_sesion(
            email=usuario.email,
            password=usuario.password
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))