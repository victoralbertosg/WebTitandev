"""
===============================================================================
 TitanDevDataDynamics — API Endpoints: Demos Interactivas
===============================================================================
 Expone endpoints para probar en vivo las capacidades de Visión y RAG.
 Endpoints:
 - POST /api/v1/demos/vision
 - POST /api/v1/demos/rag
===============================================================================
"""

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field
from app.services.demo_service import DemoService

router = APIRouter(prefix="/demos", tags=["Interactive Demos"])

class VisionRequestModel(BaseModel):
    demo_type: str = Field(default="quality_control", description="Tipo de demo: 'quality_control' o 'inventory'")

class RagRequestModel(BaseModel):
    query: str = Field(..., min_length=3, description="Pregunta del usuario para el simulador RAG")

@router.post(
    "/vision",
    status_code=status.HTTP_200_OK,
    summary="Simulación de Visión Artificial (YOLO11/SAM2)",
    description="Procesa peticiones de inspección visual y retorna objetos detectados con bounding boxes."
)
async def vision_demo(payload: VisionRequestModel):
    return DemoService.process_vision_demo(payload.demo_type)

@router.post(
    "/rag",
    status_code=status.HTTP_200_OK,
    summary="Simulación de Búsqueda Semántica RAG Híbrida",
    description="Procesa una consulta sobre documentos corporativos y retorna respuesta sintetizada con citas."
)
async def rag_demo(payload: RagRequestModel):
    return DemoService.process_rag_demo(payload.query)
