
from fastapi import APIRouter, HTTPException, Request, Form
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates

from app.services.usuario_service import UsuarioService

router = APIRouter(prefix="/usuarios", tags=["Usuarios"])
usuario_service = UsuarioService()

templates = Jinja2Templates(directory="app/templates")


@router.get("/registro", response_class=HTMLResponse)
def mostrar_formulario_registro(request: Request):
    return templates.TemplateResponse("registro_usuario.html", {"request": request})


@router.post("/registrar")
def registrar_usuario(email: str = Form(...), password: str = Form(...), rol: str = Form(...)):

    try:
        usuario_creado = usuario_service.crear_usuario(
            email=email,
            password=password,
            rol=rol
        )
        return {"status": "success", "message": "Usuario registrado con éxito"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/", response_class=HTMLResponse)
def listar_usuarios(request: Request):
    usuarios = usuario_service.listar_usuarios()
    return templates.TemplateResponse("lista_usuarios.html", {"request": request, "usuarios": usuarios})


@router.post("/eliminar/{usuario_id}")
def eliminar_usuario(usuario_id: int):
    try:
        usuario_service.eliminar_usuario(usuario_id)
        return {"status": "success", "message": "Usuario eliminado"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))