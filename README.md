# Rekun LAB Ecommerce

Base tecnica inicial del ecommerce de Rekun LAB construida con Next.js App Router, TypeScript, Tailwind CSS y preparacion para Supabase.

La guia formal de arquitectura y convenciones del proyecto esta en `docs/modulo-2-arquitectura-y-convenciones.md`.
La guia del sistema de diseno esta en `docs/modulo-4-sistema-de-diseno.md`.
La guia de componentes UI base esta en `docs/modulo-5-componentes-ui-base.md`.
La guia del catalogo de productos esta en `docs/modulo-6-catalogo-de-productos.md`.

## Objetivo de esta base

- Partir con una estructura limpia y mantenible.
- Separar claramente la capa de aplicacion, modulos, servicios compartidos y configuracion.
- Facilitar el crecimiento del proyecto sin acoplar desde el inicio la logica de negocio.

## Estructura propuesta

```text
src/
  app/
    catalogo/
      loading.tsx
      page.tsx
    globals.css
    layout.tsx
    page.tsx
  compartido/
    componentes/
      base/
        contenedor-principal.tsx
      layout/
        estructura-layout-global.tsx
        footer-global.tsx
        header-global.tsx
        marca-principal.tsx
        navegacion-principal.tsx
      ui/
        area-texto.tsx
        boton.tsx
        campo-texto.tsx
        cargador.tsx
        contenedor.tsx
        estado-vacio.tsx
        etiqueta.tsx
        index.ts
        mensaje-error.tsx
        modal-base.tsx
        selector.tsx
        tarjeta.tsx
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
      formatear-precio-clp.ts
      unir-clases.ts
  modulos/
    base-proyecto/
      componentes/
        resumen-base-proyecto.tsx
      index.ts
    catalogo/
      componentes/
        catalogo-cargando.tsx
        encabezado-catalogo-productos.tsx
        estado-vacio-catalogo.tsx
        grilla-productos-catalogo.tsx
        pagina-catalogo-productos.tsx
        tarjeta-producto-catalogo.tsx
      datos/
        productos-catalogo-mock.ts
      servicios/
        obtener-productos-catalogo.ts
      tipos/
        producto-catalogo.ts
      index.ts
public/
  imagenes/
    mock/
      productos/
```

## Criterios de escalabilidad

- `app/` queda como punto de entrada y composicion de rutas, no como lugar para mezclar logica de negocio.
- `compartido/` concentra el codigo transversal del proyecto.
- `compartido/componentes/ui/` concentra la biblioteca visual reusable.
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

La base actual ya incluye un catalogo visual con datos mock profesionales y loading simulado, pero aun no incorpora filtros avanzados, detalle completo de producto, carrito funcional, checkout, autenticacion funcional ni panel administrativo.
