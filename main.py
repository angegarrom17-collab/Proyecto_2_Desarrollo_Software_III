from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.config.database import engine, Base

# IMPORTAR TODOS LOS MODELOS para que SQLAlchemy los registre
from app.models.usuario import UsuarioORM
from app.models.voluntario import VoluntarioORM
from app.models.zona import ZonaORM
from app.models.animal_afectado import AnimalORM
from app.models.basura_recolectada import BasuraORM
from app.models.jornada_limpieza import JornadaORM
from app.models.material import MaterialORM

# IMPORTAR CONTROLLERS
from app.controller.basura_controller import router as basura_router
from app.controller.jornada_controller import router as jornada_router
from app.controller.reporte_controller import router as reporte_router
from app.controller.usuario_controller import router as usuario_router
from app.controller.voluntario_controller import router as voluntario_router

# Crear tablas automáticamente (solo desarrollo)
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

# Registrar routers
app.include_router(basura_router)
app.include_router(jornada_router)
app.include_router(reporte_router)
app.include_router(usuario_router)
app.include_router(voluntario_router)

app.mount("/web", StaticFiles(directory="web_voluntariado"), name="web")

@app.get("/")
def root():
    return {
        "message": "API Proyecto Oceano funcionando",
        "docs": "http://localhost:8000/docs"
    }