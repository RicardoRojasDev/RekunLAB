# Modulo 10 - Carrito de compras

## Objetivo

Construir una experiencia de carrito solida, reusable y preparada para conectarse despues al checkout sin mezclar aun pedidos ni pagos.

## Estructura del modulo

```text
src/
  app/
    carrito/
      page.tsx
  modulos/
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
```

## Criterios de arquitectura

- El carrito vive en su propio dominio, separado del catalogo y del futuro checkout.
- La persistencia local queda encapsulada en un servicio, no mezclada dentro de los componentes.
- La logica de merge, cantidades y subtotal vive en utilidades puras.
- El layout global solo consume la API publica del carrito para mostrar accion de cabecera y drawer.
- El detalle de producto solo agrega una linea al carrito; no asume pedidos ni pagos.

## Base preparada para crecimiento

- La clave de linea ya soporta producto base y producto con variante.
- La estructura de item guarda precio unitario final, imagen y seleccion de variante.
- El resumen se puede extender luego con envio, descuentos o checkout sin rehacer la UI actual.
