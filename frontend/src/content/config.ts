/*
===============================================================================
 TitanDevDataDynamics — Configuración de Colecciones de Contenido (Astro Content)
===============================================================================
 Este archivo define la estructura y validación de esquemas (usando Zod)
 para las colecciones de contenido del Blog Técnico de la V2.

 Mantenimiento:
 - Si desea agregar un nuevo campo a las entradas del blog (ej. 'updatedDate'),
   agregue la regla de validación en el objeto z.object() a continuación.
===============================================================================
*/

import { defineCollection, z } from 'astro:content';

// Definición del Esquema Zod para los artículos del Blog (.md / .mdx)
const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    // Título del artículo (Obligatorio)
    title: z.string(),
    // Fecha de publicación (Formato YYYY-MM-DD)
    pubDate: z.date(),
    // Breve descripción o resumen ejecutivo para tarjetas y SEO
    description: z.string(),
    // Autor del artículo
    author: z.string().default('Equipo TitanDev'),
    // Lista de etiquetas / tecnologías asociadas
    tags: z.array(z.string()),
    // Tiempo estimado de lectura (ej. '5 min')
    min_read: z.string().default('5 min'),
    // Marca si el artículo es destacado en la portada del blog
    featured: z.boolean().default(false),
  }),
});

// Exportación de las colecciones activas para Astro
export const collections = {
  'blog': blogCollection,
};
