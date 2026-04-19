# Modulo 6 - Catalogo de productos

## Objetivo

Construir la experiencia visual inicial del catalogo de Rekun LAB con datos mock profesionales, grilla responsive y una arquitectura preparada para cambiar la fuente de datos sin rehacer la capa visual.

## Estructura del modulo

```text
src/
  app/
    catalogo/
      loading.tsx
      page.tsx
  modulos/
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
  compartido/
    utilidades/
      formatear-precio-clp.ts
public/
  imagenes/
    mock/
      productos/
```

## Criterios aplicados

- `app/catalogo/page.tsx` solo compone la ruta y delega el dominio al modulo.
- `datos/` contiene mocks puros, sin logica de presentacion.
- `servicios/` encapsula la obtencion del catalogo y la espera simulada.
- `componentes/` concentra la UI del dominio sin contaminar `compartido/`.
- `compartido/utilidades/formatear-precio-clp.ts` resuelve un formato transversal reusable.

## Modelo de datos mock

Cada producto mock expone:

- `id`
- `slug`
- `nombre`
- `resumen`
- `categoria`
- `coleccion` opcional
- `precioIvaIncluido`
- `imagen`
- `etiquetasComerciales`

## Preparacion para integracion futura

Cuando toque reemplazar mocks por datos reales, el cambio natural debe ocurrir en `obtener-productos-catalogo.ts` o en un repositorio posterior del dominio, manteniendo intactos `page.tsx`, la grilla y la tarjeta de producto.
