from fastapi import APIRouter, HTTPException
from app.services.material_service import MaterialService
from app.schemas.schema_material import MaterialSchema, MaterialCrearSchema

router = APIRouter(prefix="/materiales", tags=["Materiales"])
service = MaterialService()


# GET materiales
@router.get("/", response_model=list[MaterialSchema])
def listar_materiales():
    """Devuelve la lista completa de materiales."""
    return service.listar_materiales()


# GET materiales material_id
@router.get("/{material_id}", response_model=MaterialSchema)
def obtener_material(material_id: int):
    """Devuelve un material específico por su ID."""
    material = service.obtener_material(material_id)
    if not material:
        raise HTTPException(status_code=404, detail="Material no encontrado")
    return material


# POST materiales
@router.post("/", response_model=MaterialSchema)
def crear_material(data: MaterialCrearSchema):
    """Registra un nuevo material en el inventario."""
    try:
        return service.crear_material(
            nombre=data.nombre,
            unidad_medida=data.unidad_medida,
            cantidad_disponible=data.cantidad_disponible
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


# PUT /materiales/{material_id}
@router.put("/{material_id}", response_model=MaterialSchema)
def actualizar_material(material_id: int, data: MaterialCrearSchema):
    """Actualiza los datos de un material existente."""
    try:
        return service.actualizar_material(
            material_id=material_id,
            nombre=data.nombre,
            unidad_medida=data.unidad_medida,
            cantidad_disponible=data.cantidad_disponible
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


# DELETE /materiales/{material_id}
@router.delete("/{material_id}")
def eliminar_material(material_id: int):
    """Elimina un material del sistema por su ID."""
    material = service.eliminar_material(material_id)
    if not material:
        raise HTTPException(status_code=404, detail="Material no encontrado")
    return {"message": "Material eliminado correctamente"}


# POST /materiales/usar/{material_id}
@router.post("/usar/{material_id}", response_model=MaterialSchema)
def usar_material(material_id: int, cantidad: int):
    """Descuenta stock de un material. Bloquea si no hay suficiente cantidad."""
    try:
        return service.usar_material(material_id, cantidad)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


# GET /materiales/reporte/stock-bajo?umbral=10
@router.get("/reporte/stock-bajo", response_model=list[MaterialSchema])
def reporte_stock_bajo(umbral: int = 10):
    """Devuelve materiales con stock menor al umbral definido."""
    return service.reporte_stock_bajo(umbral)