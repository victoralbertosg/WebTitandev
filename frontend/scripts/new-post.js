import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const title = process.argv[2];

if (!title) {
  console.error('❌ Error: Por favor especifica el título del artículo.');
  console.log('Ejemplo: npm run new-post "Microservicios Cloud-Native con Istio"');
  process.exit(1);
}

// Convertir título a slug apto para URL
const slug = title
  .toLowerCase()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/(^-|-$)+/g, '');

const today = new Date().toISOString().split('T')[0];
const targetDir = path.join(__dirname, '../src/content/blog');
const targetFile = path.join(targetDir, `${slug}.mdx`);

if (fs.existsSync(targetFile)) {
  console.error(`⚠️ Error: El archivo ${slug}.mdx ya existe en src/content/blog/`);
  process.exit(1);
}

const template = `---
title: "${title}"
pubDate: ${today}
description: "Escribe aquí una breve descripción relevante para el SEO y las tarjetas de presentación en el blog."
author: "Equipo TitanDev"
tags: ["Tecnología", "IA", "Arquitectura"]
min_read: "5 min"
featured: false
---

## 📌 Introducción

Escribe aquí la introducción de tu artículo sobre **${title}**...

---

### 💡 Conceptos Clave

1. **Punto 1:** Explicación técnica detallada.
2. **Punto 2:** Explicación técnica detallada.

---

### 🛠️ Ejemplo de Código / Arquitectura

\`\`\`python
# Ejemplo de implementación en Python
def hello_titan():
    print("TitanDevDataDynamics — Contenido Técnico")
\`\`\`

---

### 🚀 Conclusión

Resumen de beneficios e impacto para tu negocio.
`;

fs.writeFileSync(targetFile, template, 'utf8');
console.log(`✅ ¡Artículo creado exitosamente!`);
console.log(`📄 Archivo: frontend/src/content/blog/${slug}.mdx`);
console.log(`🌐 URL preview: http://localhost:4321/blog/${slug}`);
