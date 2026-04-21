# Modulo 17 - Correos de confirmacion de pedido

## Objetivo

Enviar correos transaccionales reales al cliente y al equipo interno cada vez que se crea un pedido, usando informacion persistida del pedido en Supabase.

## Proveedor implementado

- `Resend`

## Flujo implementado

1. El checkout crea el `pedido` en Supabase con el flujo del modulo 16.
2. `registrarPedidoDesdeCheckout()` dispara `notificarPedidoCreado()`.
3. El modulo 17 intenta reconstruir el pedido desde Supabase con:
   - `pedido`
   - `direccion_pedido`
   - `item_pedido`
4. Con esos datos arma dos correos:
   - confirmacion para cliente
   - respaldo interno para operacion
5. Ambos correos se envian con `Resend`.
6. Si la lectura consolidada del pedido falla de forma inesperada, el modulo usa el payload validado del checkout como respaldo operativo para no bloquear el envio.

## Datos reales usados

Por cada item se usan snapshots reales del pedido:

- `nombreProducto`
- `nombreCompleto`
- `marca`
- `tipoProducto`
- `precioUnitarioCLP`
- `cantidad`
- `subtotalCLP`

Ademas se envian:

- `numeroPedido`
- `fechaISO`
- `correoCliente`
- `telefonoCliente`
- `direccionDespacho`
- `subtotalCLP`
- `totalCLP`

## Plantillas

Plantillas HTML implementadas:

- `src/modulos/correos-transaccionales/plantillas/correo-confirmacion-pedido-cliente.ts`
- `src/modulos/correos-transaccionales/plantillas/correo-respaldo-pedido-interno.ts`

Criterios aplicados:

- HTML limpio y transaccional
- sin marketing
- tabla de items con monto real
- resumen total con IVA incluido
- estructura compatible con clientes de correo tradicionales

## Variables de entorno

- `RESEND_API_KEY`
- `CORREO_ORIGEN_TRANSACCIONAL`
- `CORREO_RESPALDO_PEDIDOS`

Notas:

- `CORREO_ORIGEN_TRANSACCIONAL` debe ser un remitente valido del dominio configurado en Resend.
- `CORREO_RESPALDO_PEDIDOS` es opcional. Si no existe, igual se envia el correo al cliente.

## Estructura

```text
src/modulos/correos-transaccionales/
  index.ts
  plantillas/
    correo-confirmacion-pedido-cliente.ts
    correo-respaldo-pedido-interno.ts
  proveedores/
    proveedor-correos-transaccionales.ts
    proveedor-resend.ts
  repositorios/
    pedidos-correos-supabase.ts
  servicios/
    notificar-pedido-creado.ts
  tipos/
    correos-transaccionales.ts
  utilidades/
    construir-pedido-correo-transaccional.ts
    correos-html.ts
```

## Verificacion minima

- `npm run lint`
- `npm run typecheck`
- `npm run build`
