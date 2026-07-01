from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.config.database import engine, Base


from app.models.usuario import UsuarioORM
from app.models.voluntario import VoluntarioORM
from app.models.zona import ZonaORM
from app.models.animal_afectado import AnimalAfectadoORM
from app.models.basura_recolectada import BasuraORM
from app.models.jornada_limpieza import JornadaORM
from app.models.material import MaterialORM
from app.models.reporte_generado import ReporteGeneradoORM

from app.controller.basura_controller import router as basura_router
from app.controller.jornada_controller import router as jornada_router
from app.controller.reporte_controller import router as reporte_router
from app.controller.usuario_controller import router as usuario_router
from app.controller.voluntario_controller import router as voluntario_router
from app.controller.zona_controller import router as zona_router
from app.controller.material_controller import router as material_router
from app.controller.fauna_controller import router as fauna_router

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Proyecto Oceano API",
    description="API para gestión de voluntariado ambiental",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(basura_router,     prefix="/basura")
app.include_router(jornada_router,    prefix="/jornadas")
app.include_router(reporte_router,    prefix="/reportes")
app.include_router(usuario_router,    prefix="/usuarios")
app.include_router(voluntario_router, prefix="/voluntarios")
app.include_router(zona_router, prefix="/zonas")
app.include_router(material_router, prefix="/materiales")
app.include_router(fauna_router, prefix="/fauna")

app.mount("/web", StaticFiles(directory="web_voluntariado"), name="web")

@app.get("/")
def root():
    return {
        "message": "API Proyecto Oceano funcionando",
        "docs": "http://localhost:8000/docs"
    }

import uvicorn

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)