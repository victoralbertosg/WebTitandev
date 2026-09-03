"""
===============================================================================
 TitanDevDataDynamics — API Endpoints: Calculadora de ROI
===============================================================================
 Expone los puntos de entrada HTTP POST para la evaluación financiera de IA.
 Endpoint: POST /api/v1/roi/calculate
===============================================================================
"""

from fastapi import APIRouter, HTTPException, status
from app.services.roi_calculator import RoiInputModel, RoiResultModel, calculate_enterprise_ai_roi

router = APIRouter(prefix="/roi", tags=["ROI Calculator"])

@router.post(
    "/calculate",
    response_model=RoiResultModel,
    status_code=status.HTTP_200_OK,
    summary="Calcular ROI de Solución de IA Enterprise",
    description="Recibe parámetros de empleados, horas perdidas y costos para calcular el ahorro anual en USD y ROI %."
)
async def calculate_roi(data: RoiInputModel):
    """
    Endpoint principal para la calculadora interactiva del frontend.
    """
    try:
        results = calculate_enterprise_ai_roi(data)
        return results
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error procesando el cálculo de ROI: {str(e)}"
        )
