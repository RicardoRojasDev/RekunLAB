# Modulo 17 - Correos transaccionales

## Objetivo

Enviar correos de confirmacion del pedido al cliente y un respaldo interno al negocio usando datos reales del pedido ya registrado.

## Estructura

```text
src/modulos/correos-transaccionales/
  index.ts
  tipos/
    correos-transaccionales.ts
  utilidades/
    correos-html.ts
  plantillas/
    correo-confirmacion-pedido-cliente.ts
    correo-respaldo-pedido-interno.ts
  proveedores/
    proveedor-correos-transaccionales.ts
    proveedor-resend.ts
  servicios/
    notificar-pedido-creado.ts
```

## Flujo

1. `registrarPedidoDesdeCheckout()` valida y crea el pedido en Supabase.
2. Si la creacion fue exitosa, llama a `notificarPedidoCreado()`.
3. `notificarPedidoCreado()` construye un objeto de pedido transaccional con:
   - identificador del pedido
   - fecha
   - cliente
   - direccion
   - items
   - subtotal
   - total
4. Se renderizan dos plantillas:
   - confirmacion al cliente
   - respaldo interno
5. El proveedor Resend envia los correos.
6. Si el envio falla, el pedido no se revierte. El error queda logueado.

## Variables de entorno

```env
RESEND_API_KEY=
CORREO_ORIGEN_TRANSACCIONAL=
CORREO_RESPALDO_PEDIDOS=
```

## Consideraciones

- Los correos usan HTML inline para evitar dependencias visuales del frontend.
- Si faltan `RESEND_API_KEY` o `CORREO_ORIGEN_TRANSACCIONAL`, el envio se omite.
- Si falta `CORREO_RESPALDO_PEDIDOS`, igual se puede enviar la confirmacion al cliente.
