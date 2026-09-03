/*
===============================================================================
 TitanDevDataDynamics — Componente Isla React: Demo Visión Artificial Sandbox
===============================================================================
 Permite probar en vivo simulaciones de inferencia de modelos YOLO11/SAM 2.
 Peticiones al backend FastAPI: POST /api/v1/demos/vision
===============================================================================
*/

import React, { useState } from 'react';

export default function DemoVision() {
  const [demoType, setDemoType] = useState('quality_control');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const runVisionDemo = async (type) => {
    setDemoType(type);
    setLoading(true);

    try {
      const res = await fetch('/api/v1/demos/vision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ demo_type: type })
      });
      const data = await res.json();
      setResult(data);
    } catch (e) {
      console.error('Error en Demo Visión:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      background: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(16px)',
      border: '1px solid rgba(16, 185, 129, 0.3)',
      borderRadius: '20px',
      padding: '32px',
      color: '#fff',
      maxWidth: '850px',
      margin: '40px auto'
    }}>
      <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.8rem', color: '#10b981', textAlign: 'center' }}>
        👁️ Sandbox de Visión Artificial (YOLO11 / SAM 2)
      </h2>
      <p style={{ textAlign: 'center', color: '#94a3b8', marginBottom: '24px' }}>
        Pruebe el rendimiento de inspección visual en tiempo real e inferencia de baja latencia.
      </p>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginBottom: '24px' }}>
        <button
          onClick={() => runVisionDemo('quality_control')}
          style={{
            padding: '12px 20px',
            borderRadius: '8px',
            border: 'none',
            background: demoType === 'quality_control' ? '#10b981' : '#1e293b',
            color: '#fff',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          🔍 Control de Calidad Industrial
        </button>

        <button
          onClick={() => runVisionDemo('inventory')}
          style={{
            padding: '12px 20px',
            borderRadius: '8px',
            border: 'none',
            background: demoType === 'inventory' ? '#10b981' : '#1e293b',
            color: '#fff',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          📦 Conteo de Inventario Automático
        </button>
      </div>

      {loading && <p style={{ textAlign: 'center', color: '#00d2ff' }}>⚡ Inferencia en proceso con FastAPI...</p>}

      {result && !loading && (
        <div style={{ background: '#090d16', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', color: '#10b981', fontWeight: '700' }}>
            <span>Modelo: {result.model_used}</span>
            <span>⚡ Latencia: {result.inference_time_ms} ms</span>
          </div>

          <p style={{ color: '#cbd5e1', marginBottom: '16px' }}>{result.summary}</p>

          <h4 style={{ color: '#fff', marginBottom: '8px' }}>Detecciones:</h4>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {result.objects_detected.map((obj, i) => (
              <li key={i} style={{ background: 'rgba(255,255,255,0.05)', padding: '10px 14px', borderRadius: '6px', marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
                <span>📌 {obj.label}</span>
                <span style={{ color: obj.status === 'RECHAZADO' || obj.status === 'ALERTA_INVENTARIO' ? '#ef4444' : '#10b981', fontWeight: '700' }}>
                  {obj.status} (Confianza: {(obj.confidence * 100).toFixed(0)}%)
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
