# Rekun LAB Ecommerce

Base tecnica inicial del ecommerce de Rekun LAB construida con Next.js App Router, TypeScript, Tailwind CSS y preparacion para Supabase.

## Objetivo de esta base

- Partir con una estructura limpia y mantenible.
- Separar claramente la capa de aplicacion, modulos, servicios compartidos y configuracion.
- Facilitar el crecimiento del proyecto sin acoplar desde el inicio la logica de negocio.

## Estructura propuesta

```text
src/
  app/
    globals.css
    layout.tsx
    page.tsx
  componentes/
    base/
      contenedor-pagina.tsx
  configuracion/
    entorno.ts
    sitio.ts
  modulos/
    base-proyecto/
      componentes/
        resumen-base-proyecto.tsx
      index.ts
  servicios/
    supabase/
      cliente-publico.ts
      index.ts
  tipos/
    comunes.ts
    entorno.ts
  utilidades/
    unir-clases.ts
```

## Criterios de escalabilidad

- `app/` queda como punto de entrada y composicion de rutas, no como lugar para mezclar logica de negocio.
- `modulos/` permite encapsular cada dominio futuro del ecommerce, por ejemplo catalogo, carrito, checkout o administracion.
- `componentes/` concentra piezas reutilizables compartidas entre modulos.
- `servicios/` reune integraciones externas y acceso a infraestructura.
- `configuracion/` mantiene centralizadas las constantes del proyecto y la lectura de variables de entorno.
- `tipos/` evita repetir contratos comunes a medida que crece el codigo.
- `utilidades/` agrupa funciones puras y transversales.

## Variables de entorno

La base incluye un archivo `.env.example` con estas variables:

- `NEXT_PUBLIC_URL_BASE`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

## Comandos principales

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run typecheck
```

## Alcance de esta base

Esta etapa solo prepara la fundacion tecnica. No incluye catalogo, carrito, checkout, autenticacion funcional, panel administrativo ni reglas de negocio especificas.
