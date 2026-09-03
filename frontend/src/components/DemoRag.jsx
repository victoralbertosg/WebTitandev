/*
===============================================================================
 TitanDevDataDynamics — Componente Isla React: Demo RAG Sandbox
===============================================================================
 Simula una búsqueda semántica RAG con citas exactas de documentos corporativos.
 Peticiones al backend FastAPI: POST /api/v1/demos/rag
===============================================================================
*/

import React, { useState } from 'react';

export default function DemoRag() {
  const [query, setQuery] = useState('¿Cómo se garantiza la soberanía de los datos en modelos On-Premise?');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleRagSearch = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/v1/demos/rag', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error('Error en RAG Search:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      background: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(16px)',
      border: '1px solid rgba(0, 212, 255, 0.3)',
      borderRadius: '20px',
      padding: '32px',
      color: '#fff',
      maxWidth: '850px',
      margin: '40px auto'
    }}>
      <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.8rem', color: '#00d2ff', textAlign: 'center' }}>
        🧠 Sandbox RAG Híbrido & Conocimiento Corporativo
      </h2>
      <p style={{ textAlign: 'center', color: '#94a3b8', marginBottom: '24px' }}>
        Realice consultas semánticas y observe cómo la IA cita las fuentes exactas de sus documentos.
      </p>

      <form onSubmit={handleRagSearch} style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Escriba una pregunta corporativa..."
          style={{
            flex: 1,
            padding: '12px 16px',
            borderRadius: '8px',
            border: '1px solid rgba(255,255,255,0.15)',
            background: '#090d16',
            color: '#fff'
          }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '12px 24px',
            borderRadius: '8px',
            border: 'none',
            background: 'linear-gradient(135deg, #00d2ff 0%, #3b82f6 100%)',
            color: '#fff',
            fontWeight: '700',
            cursor: 'pointer'
          }}
        >
          {loading ? 'Consultando RAG...' : '🔍 Buscar'}
        </button>
      </form>

      {result && (
        <div style={{ background: '#090d16', padding: '20px', borderRadius: '12px', border: '1px solid rgba(0, 212, 255, 0.2)' }}>
          <h4 style={{ color: '#00d2ff', marginBottom: '8px' }}>🤖 Respuesta Sintetizada:</h4>
          <p style={{ color: '#e2e8f0', lineHeight: '1.6', marginBottom: '20px' }}>{result.synthesized_response}</p>

          <h5 style={{ color: '#94a3b8', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px', marginBottom: '10px' }}>
            📚 Citas de Documentos Fuentes:
          </h5>

          {result.citations.map((cite, idx) => (
            <div key={idx} style={{ background: 'rgba(255,255,255,0.03)', borderLeft: '3px solid #00d2ff', padding: '12px', marginBottom: '10px', borderRadius: '0 6px 6px 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#64748b', marginBottom: '4px' }}>
                <strong>📄 {cite.document} (Pág. {cite.page})</strong>
                <span>Score: {(cite.relevance_score * 100).toFixed(0)}%</span>
              </div>
              <p style={{ fontStyle: 'italic', fontSize: '0.9rem', color: '#cbd5e1', margin: 0 }}>"{cite.snippet}"</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
