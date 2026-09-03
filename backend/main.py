"""
===============================================================================
 TitanDevDataDynamics — Servidor Backend Principal (FastAPI)
===============================================================================
 Este es el punto de entrada ejecutable del servidor FastAPI.
 Administra:
 1. Inicialización de la aplicación FastAPI.
 2. Configuración del Middleware de CORS para permitir peticiones desde Nginx.
 3. Registro de routers (/api/v1/roi, /api/v1/demos).
 4. Endpoint de comprobación de salud (Healthcheck) `/health`.

 Modo de Ejecución (Desarrollo):
 uvicorn main:app --reload --port 8000

 Modo de Ejecución (Producción con Systemd/Gunicorn):
 uvicorn main:app --host 127.0.0.1 --port 8000 --workers 4
===============================================================================
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.roi import router as roi_router
from app.api.demos import router as demos_router

# Inicialización de la aplicación FastAPI con metadatos OpenAPI
app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Motor de Servicios Backend para TitanDevDataDynamics (V2.0 Híbrido)",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configuración de CORS para permitir peticiones desde el frontend en Nginx
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inclusión de Routers de API v1
app.include_router(roi_router, prefix=settings.API_V1_STR)
app.include_router(demos_router, prefix=settings.API_V1_STR)

@app.get("/health", tags=["System"])
async def health_check():
    """
    Endpoint de monitoreo y verificación de salud del servidor.
    Usado por Nginx y herramientas de monitoreo (Prometheus/Uptime).
    """
    return {
        "status": "online",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "environment": settings.ENVIRONMENT
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
