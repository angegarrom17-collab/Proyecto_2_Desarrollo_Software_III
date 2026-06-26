
from fastapi import APIRouter, HTTPException, Request, Form
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates

from app.services.voluntario_service import VoluntarioService

router = APIRouter(prefix="/voluntarios", tags=["Voluntarios"])
voluntario_service = VoluntarioService()

templates = Jinja2Templates(directory="app/templates")


@router.get("/nuevo", response_class=HTMLResponse)
def mostrar_formulario_registro(request: Request):
    return templates.TemplateResponse("registrar_voluntario.html", {"request": request})

@router.post("/registrar")
def registrar_voluntario(
    cedula: str = Form(...),
    nombre: str = Form(...),
    email: str = Form(...),
    edad: int = Form(...),
    organizacion: str = Form(...)):
    try:
        voluntario_creado = voluntario_service.crear_voluntario(
            cedula=cedula,
            nombre=nombre,
            email=email,
            edad=edad,
            organizacion=organizacion
        )
        return {"status": "success", "message": "Voluntario registrado con éxito"}
    except ValueError as e:
        # Si ocurren errores de validación (ej. menor de 18 años), se reportan al cliente
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/", response_class=HTMLResponse)
def listar_voluntarios(request: Request):
    """Solicita la lista de todos los voluntarios y la renderiza en la plantilla HTML."""
    voluntarios = voluntario_service.listar_voluntarios()
    return templates.TemplateResponse(
        request=request,
        name="lista_voluntarios.html",
        context={"voluntarios": voluntarios}
    )


@router.post("/actualizar/{voluntario_id}")
def actualizar_voluntario(
    voluntario_id: int,
    cedula: str = Form(...),
    nombre: str = Form(...),
    email: str = Form(...),
    edad: int = Form(...),
    organizacion: str = Form(...)):

    try:
        voluntario_actualizado = voluntario_service.actualizar_voluntario(
            voluntario_id=voluntario_id,
            cedula=cedula,
            nombre=nombre,
            email=email,
            edad=edad,
            organizacion=organizacion
        )
        return {"status": "success", "message": "Datos del voluntario actualizados"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/eliminar/{voluntario_id}")
def eliminar_voluntario(voluntario_id: int):
    try:
        voluntario_service.eliminar_voluntario(voluntario_id)
        return {"status": "success", "message": "Voluntario eliminado correctamente"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/buscar", response_class=HTMLResponse)
def buscar_por_organizacion(request: Request, organizacion: str):
    try:
        resultados = voluntario_service.buscar_por_organizacion(organizacion)
        return templates.TemplateResponse(
            "lista_voluntarios.html",
            {"request": request, "voluntarios": resultados, "busqueda": organizacion}
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))