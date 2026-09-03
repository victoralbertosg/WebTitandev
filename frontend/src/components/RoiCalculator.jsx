/*
===============================================================================
 TitanDevDataDynamics — Componente Isla React: Calculadora de ROI de IA
===============================================================================
 Este componente interactivo permite a los clientes C-Level estimar el Retorno
 de Inversión (ROI) de implementar RAG o Visión Artificial en su empresa.

 Comunicación:
 Realiza peticiones HTTP POST al endpoint /api/v1/roi/calculate del backend FastAPI.
===============================================================================
*/

import React, { useState } from 'react';

export default function RoiCalculator() {
  // Estados del formulario interactivo
  const [formData, setFormData] = useState({
    num_employees: 15,
    hours_lost_per_week: 6.0,
    hourly_cost_usd: 35.0,
    project_type: 'rag_enterprise'
  });

  // Estados de respuesta de la API y carga
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Manejador de cambio de inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'project_type' ? value : parseFloat(value) || 0
    }));
  };

  // Petición al backend FastAPI
  const handleCalculate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/v1/roi/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Error al calcular el ROI desde el servidor backend.');
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err.message || 'No se pudo conectar con el microservicio de cálculo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      background: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(16px)',
      border: '1px solid rgba(124, 58, 237, 0.3)',
      borderRadius: '20px',
      padding: '32px',
      color: '#fff',
      maxWidth: '850px',
      margin: '0 auto',
      boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
    }}>
      <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '2rem', textAlign: 'center', marginBottom: '8px' }}>
        📊 Calculadora de ROI para Soluciones de IA
      </h2>
      <p style={{ textAlign: 'center', color: '#94a3b8', marginBottom: '32px' }}>
        Estime el ahorro financiero ($) y las horas hombre recuperadas al automatizar sus procesos corporativos.
      </p>

      <form onSubmit={handleCalculate} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem', color: '#cbd5e1' }}>
            👥 Número de Empleados en el Proceso:
          </label>
          <input
            type="number"
            name="num_employees"
            min="1"
            max="10000"
            value={formData.num_employees}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.15)',
              background: '#090d16',
              color: '#fff'
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem', color: '#cbd5e1' }}>
            ⏱️ Horas Perdidas Semanales por Empleado:
          </label>
          <input
            type="number"
            step="0.5"
            name="hours_lost_per_week"
            min="0.5"
            max="40"
            value={formData.hours_lost_per_week}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.15)',
              background: '#090d16',
              color: '#fff'
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem', color: '#cbd5e1' }}>
            💵 Costo Promedio Hora Hombre ($ USD):
          </label>
          <input
            type="number"
            step="1"
            name="hourly_cost_usd"
            min="5"
            max="500"
            value={formData.hourly_cost_usd}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.15)',
              background: '#090d16',
              color: '#fff'
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem', color: '#cbd5e1' }}>
            🚀 Tipo de Solución Tecnológica:
          </label>
          <select
            name="project_type"
            value={formData.project_type}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.15)',
              background: '#090d16',
              color: '#fff'
            }}
          >
            <option value="rag_enterprise">RAG Enterprise & Conocimiento Privado</option>
            <option value="computer_vision">Visión Artificial & Control de Calidad</option>
            <option value="onpremise_llm">Soberanía de Datos & LLM On-Premise</option>
          </select>
        </div>

        <div style={{ gridColumn: '1 / -1', marginTop: '12px' }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '10px',
              border: 'none',
              background: 'linear-gradient(135deg, #7c3aed 0%, #00d2ff 100%)',
              color: '#fff',
              fontSize: '1.1rem',
              fontWeight: '700',
              cursor: 'pointer',
              boxShadow: '0 8px 20px rgba(124, 58, 237, 0.4)'
            }}
          >
            {loading ? 'Procesando Cálculo en FastAPI...' : '⚡ Calcular Impacto Económico'}
          </button>
        </div>
      </form>

      {error && (
        <div style={{ marginTop: '20px', padding: '12px', background: 'rgba(239, 68, 68, 0.2)', border: '1px solid #ef4444', borderRadius: '8px', color: '#fca5a5' }}>
          ⚠️ {error}
        </div>
      )}

      {results && (
        <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <h3 style={{ fontFamily: 'Outfit, sans-serif', color: '#00d2ff', fontSize: '1.5rem', marginBottom: '16px' }}>
            🎯 Resultados del Diagnóstico Financiero
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
              <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Ahorro Neto Anual</span>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#10b981' }}>
                ${results.annual_cost_savings_usd.toLocaleString()} USD
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
              <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Horas Recuperadas / Año</span>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#6366f1' }}>
                {results.annual_hours_saved.toLocaleString()} hrs
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
              <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Retorno de Inversión (ROI)</span>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#f59e0b' }}>
                {results.estimated_roi_percentage}%
              </div>
            </div>
          </div>

          <p style={{ background: 'rgba(124, 58, 237, 0.15)', padding: '16px', borderRadius: '10px', fontSize: '0.95rem', lineHeight: '1.6' }}>
            {results.executive_summary}
          </p>
        </div>
      )}
    </div>
  );
}
