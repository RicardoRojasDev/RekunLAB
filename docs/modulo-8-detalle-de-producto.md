# Modulo 8 - Detalle de producto

## Objetivo

Construir una ficha de producto profesional, clara y orientada a conversion para Rekun LAB, preparada para recibir datos reales sin rehacer la interfaz.

## Estructura del modulo

```text
src/
  app/
    catalogo/
      [slug]/
        loading.tsx
        not-found.tsx
        page.tsx
  modulos/
    catalogo/
      componentes/
        pagina-detalle-producto.tsx
        detalle-producto/
          bloque-confianza-comercial-producto.tsx
          detalle-producto-cargando.tsx
          galeria-producto-detalle.tsx
          panel-compra-producto-detalle.tsx
          productos-relacionados-detalle.tsx
          selector-cantidad-producto.tsx
      servicios/
        obtener-detalle-producto-catalogo.ts
      tipos/
        producto-catalogo.ts
```

## Decisiones de arquitectura

- La ruta dinamica vive en `app/catalogo/[slug]` y delega el dominio al modulo.
- El detalle de producto usa un modelo mock mas rico que el listado: descripcion, galeria y especificaciones.
- La accion de `Agregar al carrito` es local y no persiste fuera de la vista en esta etapa.
- Los productos relacionados se calculan con una regla simple por coleccion, categoria y tipo para poder reemplazarla despues por datos reales.

## Criterio de escalabilidad

Cuando el proyecto migre a datos reales, el reemplazo natural deberia ocurrir en `obtener-detalle-producto-catalogo.ts` y en la fuente de `productos-catalogo-mock.ts`, manteniendo estable la pagina, la galeria y el panel comercial.
