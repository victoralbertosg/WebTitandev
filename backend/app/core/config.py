"""
===============================================================================
 TitanDevDataDynamics — Módulo de Configuración Backend (FastAPI Core)
===============================================================================
 Este módulo centraliza las variables de entorno, configuraciones de CORS,
 metadatos de la API y parámetros de seguridad.

 Mantenimiento:
 - Para agregar una nueva variable de entorno, añádala como atributo en la
   clase Settings.
 - Para permitir nuevos orígenes CORS (ej. un nuevo subdominio), agréguelos a
   CORS_ORIGINS.
===============================================================================
"""

import os
from typing import List

class Settings:
    """
    Clase de configuración central del servidor FastAPI.
    """
    # Nombre y descripción pública de la API
    PROJECT_NAME: str = "TitanDevDataDynamics API Engine"
    VERSION: str = "2.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Entorno de ejecución: 'development' | 'production'
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "production")
    
    # Orígenes permitidos para CORS (Cross-Origin Resource Sharing)
    # Permite que el frontend en Astro o Nginx realice peticiones al backend
    CORS_ORIGINS: List[str] = [
        "http://localhost",
        "http://localhost:4321",         # Astro Dev Server
        "http://127.0.0.1",
        "http://127.0.0.1:4321",
        "http://192.168.1.69",
        "http://192.168.1.69:4321",
        "http://192.168.1.69:8000",
        "http://0.0.0.0:4321",
        "https://titandevdatadynamics.com",
        "https://www.titandevdatadynamics.com",
    ]

# Instancia global reutilizable de configuración
settings = Settings()
