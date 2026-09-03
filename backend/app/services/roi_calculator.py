"""
===============================================================================
 TitanDevDataDynamics — Servicio Lógico: Calculadora de ROI de IA & RAG
===============================================================================
 Este servicio calcula de forma automatizada el Retorno de Inversión (ROI)
 para proyectos de Inteligencia Artificial Enterprise, RAG Corporativo y
 Automatización de Procesos.

 Fórmulas aplicadas:
 1. Ahorro por reducción de horas hombre:
    Horas Ahorradas Semanales = (Empleados * Horas Perdidas Semanales) * Tasa Eficiencia
 2. Ahorro Anual ($) = Horas Ahorradas Anuales * Costo Hora Promedio ($)
 3. Reducción de Tasa de Error: Mitigación de costos de re-procesamiento de datos.
 4. ROI Estimado (%) = ((Ahorro Anual Net - Costo Inversión) / Costo Inversión) * 100
===============================================================================
"""

from pydantic import BaseModel, Field
from typing import Dict, Any

class RoiInputModel(BaseModel):
    """
    Modelo de entrada validado con Pydantic.
    Representa las respuestas del cliente en el formulario web interactivo.
    """
    num_employees: int = Field(..., ge=1, description="Número de empleados involucrados en el proceso")
    hours_lost_per_week: float = Field(..., ge=0.5, description="Horas semanales promedio perdidas por empleado en búsqueda/procesamiento de datos")
    hourly_cost_usd: float = Field(..., ge=5.0, description="Costo laboral promedio en USD por hora por empleado")
    project_type: str = Field(default="rag_enterprise", description="Tipo de solución: 'rag_enterprise', 'computer_vision', 'onpremise_llm'")

class RoiResultModel(BaseModel):
    """
    Modelo de salida con los resultados financieros y métricas de ROI.
    """
    weekly_hours_saved: float
    annual_hours_saved: float
    annual_cost_savings_usd: float
    error_reduction_percentage: float
    estimated_roi_percentage: float
    payback_period_months: float
    executive_summary: str

def calculate_enterprise_ai_roi(inputs: RoiInputModel) -> Dict[str, Any]:
    """
    Calcula el impacto económico estimado de implementar soluciones de IA.
    
    :param inputs: Objeto RoiInputModel con los datos del cliente.
    :return: Diccionario estructurado con las métricas calculadas.
    """
    # Factores de eficiencia según el tipo de proyecto (basados en benchmarks de industria 2025-2026)
    efficiency_factors = {
        "rag_enterprise": 0.65,      # 65% de reducción de tiempo en búsqueda de conocimientos
        "computer_vision": 0.80,     # 80% de aceleración en inspección de calidad
        "onpremise_llm": 0.70,       # 70% de ahorro de tiempo + soberanía de datos (cero costo token por API externa)
    }
    
    factor = efficiency_factors.get(inputs.project_type, 0.65)
    
    # 1. Cálculo de horas semanales y anuales recuperadas
    total_weekly_hours_lost = inputs.num_employees * inputs.hours_lost_per_week
    weekly_hours_saved = round(total_weekly_hours_lost * factor, 1)
    annual_hours_saved = round(weekly_hours_saved * 52, 1)
    
    # 2. Ahorro económico bruto anual
    annual_cost_savings_usd = round(annual_hours_saved * inputs.hourly_cost_usd, 2)
    
    # 3. Estimación de inversión según escala
    # Inversión estimada base para desarrollo e integración enterprise
    estimated_investment = max(8000.0, inputs.num_employees * 450.0)
    
    # 4. Cálculo de ROI % y período de retorno (Payback in months)
    net_savings = annual_cost_savings_usd - estimated_investment
    estimated_roi_percentage = round((net_savings / estimated_investment) * 100, 1)
    payback_period_months = round((estimated_investment / (annual_cost_savings_usd / 12)), 1) if annual_cost_savings_usd > 0 else 12.0
    
    # Reducción de tasa de error típica de RAG/Vision frente a procesos manuales
    error_reduction_percentage = 85.0 if inputs.project_type == "computer_vision" else 75.0

    summary_text = (
        f"Al implementar una solución de {inputs.project_type.replace('_', ' ').title()}, "
        f"su organización recuperará aproximadamente {annual_hours_saved:,} horas hombre al año, "
        f"generando un ahorro neto estimado de ${annual_cost_savings_usd:,.2f} USD con un retorno "
        f"de inversión del {estimated_roi_percentage}% en {payback_period_months} meses."
    )

    return {
        "weekly_hours_saved": weekly_hours_saved,
        "annual_hours_saved": annual_hours_saved,
        "annual_cost_savings_usd": annual_cost_savings_usd,
        "error_reduction_percentage": error_reduction_percentage,
        "estimated_roi_percentage": max(0.0, estimated_roi_percentage),
        "payback_period_months": max(0.5, payback_period_months),
        "executive_summary": summary_text
    }
