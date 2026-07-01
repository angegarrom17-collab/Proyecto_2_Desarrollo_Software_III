from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
import os

# Usa variable de entorno si existe, sino usa el default local
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "mysql+pymysql://root:root@localhost:3306/oceano"
)

engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,      # Verifica conexión antes de usarla
    pool_recycle=3600,       # Recicla conexiones cada 1 hora
    echo=False               # Cambia a True solo para debug
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()
