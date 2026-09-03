# 📗 Manual Técnico y Guía de Mantenimiento — Versión 2.0 (Modelo Híbrido)
## TitanDevDataDynamics — Platform Engineering & Maintenance Guide

---

## 📌 1. Arquitectura del Sistema (Modelo Híbrido Astro + FastAPI)

El sistema de la **Versión 2.0** utiliza una arquitectura de **Acoplamiento Débil (Decoupled Hybrid Architecture)**:

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                                NGINX WEBSERVER                                   │
│                                                                                  │
│   ┌────────────────────────────────────────┐   ┌─────────────────────────────┐   │
│   │       ASTRO 5.0 FRONTEND (SSG)         │   │   BACKEND PYTHON (FastAPI)  │   │
│   │                                        │   │  (IA / Computer Vision/RAG) │   │
│   │  • Landing Page, Blog MDX, SEO (<30ms) │   │                             │   │
│   │  • Componentes React/Vanilla (Islas)   │   │  • Calculadora ROI, PyTorch │   │
│   │    ej: <Calculator client:visible />   │   │  • Demos YOLO11, RAG Engine │   │
│   └───────────────────┬────────────────────┘   └──────────────▲──────────────┘   │
│                       │                                       │                  │
│                       │ Petición API                          │                  │
│                       └─────────────▶ fetch('/api/v1/...') ───┘                  │
│                                       (Nginx Reverse Proxy)                      │
└──────────────────────────────────────────────────────────────────────────────────┘
```

---

## 📂 2. Estructura de Directorios del Proyecto

```
WebTitandev/
├── frontend/                     # Aplicación Frontend en Astro 5.0
│   ├── src/
│   │   ├── components/           # Componentes UI reutilizables e Islas (React)
│   │   ├── content/              # Colecciones de contenido (Blog en MDX)
│   │   │   ├── config.ts         # Validación de esquemas Zod para posts
│   │   │   └── blog/             # Artículos del blog (.md / .mdx)
│   │   ├── layouts/              # Plantillas maestras (Layout.astro, PostLayout.astro)
│   │   └── pages/                # Enrutador basado en archivos (/, /blog, /servicios)
│   ├── public/                   # Archivos estáticos públicos (llms.txt, ai.json, imágenes)
│   └── astro.config.mjs          # Configuración global de Astro
│
├── backend/                      # Microservicio Backend en Python (FastAPI)
│   ├── venv/                     # Entorno virtual aislado de Python
│   ├── app/
│   │   ├── api/                  # Controladores de rutas HTTP (Endpoints)
│   │   │   ├── roi.py            # Route: POST /api/v1/roi/calculate
│   │   │   └── demos.py          # Route: POST /api/v1/demos/vision, /rag
│   │   ├── core/                 # Configuración central (CORS, variables de entorno)
│   │   │   └── config.py
│   │   └── services/             # Lógica de negocio pura (Fórmulas ROI, Algoritmos)
│   │       ├── roi_calculator.py
│   │       └── demo_service.py
│   ├── main.py                   # Punto de entrada FastAPI & middleware CORS
│   └── requirements.txt          # Dependencias de Python
│
├── MANUAL_NGINX.md               # Manual paso a paso de Nginx para principiantes
├── MANUAL_TECNICO_V2.md          # Este documento técnico de mantenimiento
└── README.md
```

---

## 🐍 3. Guía de Mantenimiento del Backend (FastAPI)

### 3.1 Cómo iniciar el Backend en modo Desarrollo
```bash
cd /home/victor/dev/WebTitandev/backend
./venv/bin/python3 main.py
```
*El servidor iniciará en `http://127.0.0.1:8000`. Puedes ver la documentación interactiva Swagger en `http://127.0.0.1:8000/docs`.*

---

### 3.2 Cómo agregar un Nuevo Endpoint API
1. Crea o edita un archivo en `backend/app/api/` (ejemplo `backend/app/api/mi_modulo.py`):
```python
from fastapi import APIRouter

router = APIRouter(prefix="/mi-modulo", tags=["Mi Modulo"])

@router.get("/ejemplo")
async def obtener_ejemplo():
    return {"status": "ok", "mensaje": "Respuesta desde el backend"}
```
2. Registra el router en `backend/main.py`:
```python
from app.api.mi_modulo import router as mi_modulo_router
app.include_router(mi_modulo_router, prefix=settings.API_V1_STR)
```

---

### 3.3 Cómo modificar las Fórmulas de Cálculo de ROI
Edita el archivo `backend/app/services/roi_calculator.py`. 
Para ajustar la tasa de eficiencia de un nuevo tipo de proyecto, modifica el diccionario `efficiency_factors`:
```python
efficiency_factors = {
    "rag_enterprise": 0.65,      # 65% de ahorro de tiempo
    "computer_vision": 0.80,     # 80% de aceleración
    "onpremise_llm": 0.70,       # 70% de ahorro
    "mi_nuevo_servicio": 0.75,   # Ajusta el porcentaje aquí
}
```

---

## 🚀 4. Guía de Mantenimiento del Frontend (Astro 5 & Blog)

### 4.1 Cómo publicar un nuevo Artículo en el Blog
Crea un archivo `.mdx` en `frontend/src/content/blog/titulo-de-tu-articulo.mdx`:

```markdown
---
title: "Título de tu Nuevo Artículo Técnico"
pubDate: 2026-09-03
description: "Breve resumen ejecutivo del artículo para SEO y redes sociales."
author: "Equipo TitanDev"
tags: ["IA", "LangGraph", "Tokenomics"]
min_read: "5 min"
---

# Introducción al tema...
Aquí redactas el contenido en Markdown. Puedes incluir bloques de código:

```python
def mi_funcion():
    print("Código documentado")
```
```

---

### 4.2 Cómo agregar una nueva Isla Interactiva (Componente React)
1. Crea el componente en `frontend/src/components/MiComponente.jsx`.
2. Consume la API del backend mediante `fetch`:
```javascript
const response = await fetch('/api/v1/roi/calculate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ num_employees: 10, hours_lost_per_week: 5, hourly_cost_usd: 35 })
});
const data = await response.json();
```
3. Importa el componente en tu página Astro e indícale la directiva de hidratación:
```astro
---
import MiComponente from '../components/MiComponente.jsx';
---
<!-- client:visible solo carga el JS cuando el usuario desplaza la pantalla hasta la calculadora -->
<MiComponente client:visible />
```

---

## 🌐 5. Configuración de Nginx para Producción

Para poner en marcha la Versión 2.0 en Nginx con el backend FastAPI, edita `/etc/nginx/sites-available/titandevdatadynamics.com`:

```nginx
server {
    listen 80;
    server_name titandevdatadynamics.com www.titandevdatadynamics.com;

    # 1. Frontend Estático de Astro
    root /var/www/titandevdatadynamics;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # 2. Reverse Proxy para API FastAPI (Backend Python)
    location /api/v1/ {
        proxy_pass http://127.0.0.1:8000/api/v1/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # 3. Healthcheck Endpoint
    location /health {
        proxy_pass http://127.0.0.1:8000/health;
    }
}
```

Para validar y recargar Nginx:
```bash
sudo nginx -t && sudo systemctl reload nginx
```

---

## 🛠️ 6. Creación del Servicio de Sistema (`systemd`) para el Backend

Para que el backend en Python inicie automáticamente al encender el servidor Linux:

Crea el archivo `/etc/systemd/system/titandev-backend.service`:
```ini
[Unit]
Description=TitanDevDataDynamics FastAPI Backend Service
After=network.target

[Service]
User=victor
WorkingDirectory=/home/victor/dev/WebTitandev/backend
ExecStart=/home/victor/dev/WebTitandev/backend/venv/bin/uvicorn main:app --host 127.0.0.1 --port 8000 --workers 4
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

Habilita e inicia el servicio:
```bash
sudo systemctl daemon-reload
sudo systemctl enable titandev-backend
sudo systemctl start titandev-backend
```

---

## 🔍 7. Verificación & Troubleshooting

| Problema | Causa Posible | Solución |
|---|---|---|
| **Error 502 Bad Gateway en `/api/v1/`** | El servicio FastAPI no está ejecutándose en puerto 8000. | Ejecuta `sudo systemctl status titandev-backend` o inicia el servidor manualmente. |
| **Error CORS en el navegador** | La URL del frontend no está registrada en `CORS_ORIGINS`. | Agrega el dominio o puerto a `CORS_ORIGINS` en `backend/app/core/config.py`. |
| **El Blog no muestra posts** | Falta la cabecera YAML en el archivo `.mdx`. | Revisa `frontend/src/content/config.ts` y asegúrate de que el post tenga `title`, `pubDate` y `description`. |

---
*Manual técnico elaborado para la arquitectura V2.0 de TitanDevDataDynamics.*
