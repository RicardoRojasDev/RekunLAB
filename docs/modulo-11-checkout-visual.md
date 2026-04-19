# Modulo 11 - Checkout visual

## Objetivo

Construir la interfaz del checkout con foco en conversion, claridad y confianza, integrada al carrito existente y preparada para conectar despues pedidos y pagos sin rehacer la UI.

## Alcance

- Formulario de datos del cliente (compra como invitado).
- Formulario de direccion de envio (solo Chile).
- Validaciones base y enfoque al primer error.
- Resumen del carrito con subtotal e indicador de IVA incluido.
- Bloque de confianza comercial.
- Sin persistencia en backend, sin pedidos y sin pagos.

## Estructura del modulo

```text
src/
  app/
    checkout/
      loading.tsx
      page.tsx
  modulos/
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
```

## Criterios de arquitectura

- `modulos/checkout` no contiene logica de carrito: consume `useCarrito()` y `resumen` desde el dominio `carrito`.
- La validacion queda en utilidades puras (`validaciones-checkout.ts`) y el estado del formulario en un hook (`use-formulario-checkout.ts`).
- La pagina de checkout es un componente cliente porque depende de la hidratacion del carrito persistido en `localStorage`.
- La accion final solo valida y muestra un modal de continuidad; no crea pedidos ni integra pagos en este modulo.

