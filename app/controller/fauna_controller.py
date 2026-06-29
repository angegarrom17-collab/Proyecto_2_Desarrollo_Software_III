from fastapi import APIRouter, HTTPException
from app.services.fauna_service import FaunaService
from app.schemas.schema_fauna import AnimalAfectadoSchema, AnimalAfectadoCrearSchema

router = APIRouter( tags=["Fauna"])
service = FaunaService()



@router.get("/", response_model=list[AnimalAfectadoSchema])
def listar_animales():
    """Devuelve la lista completa de animales registrados."""
    return service.listar_animales()



@router.get("/{animal_id}", response_model=AnimalAfectadoSchema)
def obtener_animal(animal_id: int):
    """Devuelve un animal específico por su ID."""
    animal = service.obtener_animal(animal_id)
    if not animal:
        raise HTTPException(status_code=404, detail="Animal no encontrado")
    return animal



@router.post("/", response_model=AnimalAfectadoSchema)
def crear_animal(data: AnimalAfectadoCrearSchema):
    """Registra un nuevo animal afectado en el sistema."""
    try:
        return service.crear_animal(
            especie=data.especie,
            estado=data.estado,
            descripcion=data.descripcion
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))



@router.put("/{animal_id}", response_model=AnimalAfectadoSchema)
def actualizar_animal(animal_id: int, data: AnimalAfectadoCrearSchema):
    """Actualiza los datos de un animal existente."""
    try:
        return service.actualizar_animal(
            animal_id=animal_id,
            especie=data.especie,
            estado=data.estado,
            descripcion=data.descripcion
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))



@router.delete("/{animal_id}")
def eliminar_animal(animal_id: int):
    """Elimina un animal del sistema por su ID."""
    animal = service.eliminar_animal(animal_id)
    if not animal:
        raise HTTPException(status_code=404, detail="Animal no encontrado")
    return {"message": "Animal eliminado correctamente"}



@router.get("/buscar/estado", response_model=list[AnimalAfectadoSchema])
def buscar_por_estado(estado: str):
    """Filtra animales por estado (vivo/herido/muerto)."""
    try:
        return service.buscar_por_estado(estado)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))



@router.get("/reporte/fauna")
def reporte_fauna():
    """Devuelve estadísticas: total, heridos, muertos y vivos."""
    return service.reporte_fauna()