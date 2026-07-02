from fastapi import APIRouter, HTTPException
from app.services.material_service import MaterialService
from app.schemas.schema_material import MaterialSchema, MaterialCrearSchema

router = APIRouter(tags=["Materiales"])
service = MaterialService()


@router.get("/", response_model=list[MaterialSchema])
def listar_materiales():
    return service.listar_materiales()


@router.get("/{material_id}", response_model=MaterialSchema)
def obtener_material(material_id: int):
    material = service.obtener_material(material_id)
    if not material:
        raise HTTPException(status_code=404, detail="Material no encontrado")
    return material


@router.post("/", response_model=MaterialSchema)
def crear_material(data: MaterialCrearSchema):
    try:
        return service.crear_material(
            id=data.id,
            nombre=data.nombre,
            descripcion=data.descripcion,
            cantidad=data.cantidad
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.put("/{material_id}", response_model=MaterialSchema)
def actualizar_material(material_id: int, data: MaterialCrearSchema):
    try:
        return service.actualizar_material(
            material_id=material_id,
            nombre=data.nombre,
            descripcion=data.descripcion,
            cantidad=data.cantidad
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/{material_id}")
def eliminar_material(material_id: int):
    material = service.eliminar_material(material_id)
    if not material:
        raise HTTPException(status_code=404, detail="Material no encontrado")
    return {"message": "Material eliminado correctamente"}


@router.post("/usar/{material_id}", response_model=MaterialSchema)
def usar_material(material_id: int, cantidad: int):
    try:
        return service.usar_material(material_id, cantidad)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/reporte/stock-bajo", response_model=list[MaterialSchema])
def reporte_stock_bajo(umbral: int = 10):
    return service.reporte_stock_bajo(umbral)