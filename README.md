# Rekun LAB Ecommerce

Base tecnica inicial del ecommerce de Rekun LAB construida con Next.js App Router, TypeScript, Tailwind CSS y preparacion para Supabase.

La guia formal de arquitectura y convenciones del proyecto esta en `docs/modulo-2-arquitectura-y-convenciones.md`.
La guia del sistema de diseno esta en `docs/modulo-4-sistema-de-diseno.md`.

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
  compartido/
    componentes/
      base/
        boton-base.tsx
        contenedor-principal.tsx
      layout/
        estructura-layout-global.tsx
        footer-global.tsx
        header-global.tsx
        marca-principal.tsx
        navegacion-principal.tsx
    configuracion/
      entorno.ts
      layout-global.ts
      sistema-diseno.ts
      sitio.ts
    servicios/
      supabase/
        cliente-publico.ts
        index.ts
    tipos/
      comunes.ts
      entorno.ts
    utilidades/
      unir-clases.ts
  modulos/
    base-proyecto/
      componentes/
        resumen-base-proyecto.tsx
      index.ts
```

## Criterios de escalabilidad

- `app/` queda como punto de entrada y composicion de rutas, no como lugar para mezclar logica de negocio.
- `compartido/` concentra el codigo transversal del proyecto.
- `modulos/` encapsula cada dominio funcional y expone su API publica.
- `compartido/servicios/` reune integraciones externas y acceso a infraestructura.
- `compartido/configuracion/`, `compartido/tipos/` y `compartido/utilidades/` evitan dispersion del codigo comun.

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
