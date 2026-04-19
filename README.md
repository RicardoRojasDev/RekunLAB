# Rekun LAB Ecommerce

Base tecnica inicial del ecommerce de Rekun LAB construida con Next.js App Router, TypeScript, Tailwind CSS y preparacion para Supabase.

La guia formal de arquitectura y convenciones del proyecto esta en `docs/modulo-2-arquitectura-y-convenciones.md`.
La guia del sistema de diseno esta en `docs/modulo-4-sistema-de-diseno.md`.
La guia de componentes UI base esta en `docs/modulo-5-componentes-ui-base.md`.
La guia del catalogo de productos esta en `docs/modulo-6-catalogo-de-productos.md`.
La guia del sistema de filtros del catalogo esta en `docs/modulo-7-sistema-de-filtros-catalogo.md`.
La guia del detalle de producto esta en `docs/modulo-8-detalle-de-producto.md`.
La guia de variantes de producto esta en `docs/modulo-9-logica-de-variantes-producto.md`.
La guia del carrito de compras esta en `docs/modulo-10-carrito-de-compras.md`.
La guia del checkout visual esta en `docs/modulo-11-checkout-visual.md`.

## Objetivo de esta base

- Partir con una estructura limpia y mantenible.
- Separar claramente la capa de aplicacion, modulos, servicios compartidos y configuracion.
- Facilitar el crecimiento del proyecto sin acoplar desde el inicio la logica de negocio.

## Estructura propuesta

```text
src/
  app/
    carrito/
      page.tsx
    checkout/
      loading.tsx
      page.tsx
    catalogo/
      [slug]/
        loading.tsx
        not-found.tsx
        page.tsx
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
    carrito/
      componentes/
        acciones-carrito-cabecera.tsx
        capa-carrito-global.tsx
        control-cantidad-linea-carrito.tsx
        drawer-carrito.tsx
        estado-vacio-carrito.tsx
        linea-item-carrito.tsx
        lista-items-carrito.tsx
        pagina-carrito-compras.tsx
        resumen-carrito.tsx
      contexto/
        proveedor-carrito.tsx
      hooks/
        use-carrito.ts
      servicios/
        persistencia-carrito-local.ts
      tipos/
        carrito.ts
      utilidades/
        operaciones-carrito.ts
      index.ts
    checkout/
      componentes/
        bloque-confianza-checkout.tsx
        checkout-cargando.tsx
        estado-vacio-checkout.tsx
        pagina-checkout-visual.tsx
        resumen-checkout.tsx
        seccion-datos-cliente-checkout.tsx
        seccion-direccion-envio-checkout.tsx
        seccion-identificacion-checkout.tsx
      hooks/
        use-formulario-checkout.ts
      tipos/
        checkout.ts
      utilidades/
        validaciones-checkout.ts
      index.ts
    catalogo/
      componentes/
        catalogo-cargando.tsx
        pagina-detalle-producto.tsx
        encabezado-catalogo-productos.tsx
        experiencia-catalogo-productos.tsx
        estado-vacio-catalogo.tsx
        grilla-productos-catalogo.tsx
        panel-filtros-catalogo.tsx
        pagina-catalogo-productos.tsx
        resumen-filtros-activos-catalogo.tsx
        tarjeta-producto-catalogo.tsx
        detalle-producto/
          bloque-confianza-comercial-producto.tsx
          detalle-producto-cargando.tsx
          experiencia-detalle-producto.tsx
          galeria-producto-detalle.tsx
          panel-compra-producto-detalle.tsx
          productos-relacionados-detalle.tsx
          selector-cantidad-producto.tsx
          selector-variantes-producto.tsx
      datos/
        productos-catalogo-mock.ts
      hooks/
        use-filtros-catalogo.ts
        use-variantes-producto.ts
      servicios/
        obtener-detalle-producto-catalogo.ts
        obtener-productos-catalogo.ts
      tipos/
        filtros-catalogo.ts
        producto-catalogo.ts
      utilidades/
        aplicar-filtros-catalogo.ts
        extraer-opciones-filtros-catalogo.ts
        query-params-catalogo.ts
        variantes-producto-catalogo.ts
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

La base actual ya incluye catalogo visual, filtros por query params, ficha de producto, logica de variantes escalable para color, peso y formato, carrito de compras con persistencia local y un checkout visual con formularios validados y resumen del carrito. Aun no incorpora creacion de pedidos definitiva, pagos, autenticacion funcional ni panel administrativo.
