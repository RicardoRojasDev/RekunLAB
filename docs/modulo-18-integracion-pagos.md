# Modulo 18 - Integracion de pagos

## Objetivo

Conectar pagos reales con los pedidos existentes sin confiar en el frontend, manteniendo consistencia entre el total del pedido y la confirmacion de la pasarela.

## Proveedor implementado

- `Webpay Plus` de Transbank
- Flujo `redirect` con confirmacion server-side

Fuentes oficiales usadas:

- Referencia Webpay Plus: https://www.transbankdevelopers.cl/referencia/webpay
- Documentacion Webpay Plus: https://transbankdevelopers.cl/documentacion/webpay-plus

## Flujo implementado

1. El checkout crea el `pedido` en Supabase usando el flujo ya existente.
2. Luego solicita `POST /api/pagos/intencion` con `pedidoId`.
3. El backend:
   - busca el pedido real en Supabase
   - valida total y moneda
   - evita pagos duplicados
   - crea un registro local en `public.pago`
   - crea la transaccion en Webpay Plus
4. El frontend solo redirige con el `token_ws` devuelto por backend.
5. Webpay retorna al backend en `/api/pagos/webpay-plus/retorno`.
6. El backend confirma el pago con `commit()` y, si hace falta, recupera estado con `status()`.
7. Segun el resultado:
   - actualiza `pago.estado` a `pagado` o `fallido`
   - actualiza el estado del `pedido`
   - redirige a `/checkout/resultado`

## Estados cubiertos

### Pago

- `pendiente`
- `pagado`
- `fallido`

### Pedido

- `creado` como estado inicial ya existente
- `pagado`
- `pago-fallido`

## Persistencia nueva

Migracion:

- `supabase/migrations/20260420003000_modulo_18_integracion_pagos.sql`

Tabla nueva:

- `public.pago`

Campos clave:

- `pedido_id`
- `proveedor`
- `estado`
- `intento`
- `referencia_externa`
- `session_id_pasarela`
- `token_pasarela`
- `monto`
- `moneda_codigo`
- `payload_creacion`
- `payload_confirmacion`

## Variables de entorno

- `NEXT_PUBLIC_URL_BASE`
- `TRANSBANK_WEBPAY_AMBIENTE`
- `TRANSBANK_WEBPAY_COMMERCE_CODE`
- `TRANSBANK_WEBPAY_API_KEY`

Notas:

- En desarrollo, si no se informan credenciales y el ambiente queda en `integracion`, el modulo usa las credenciales oficiales de prueba de Transbank.
- En produccion, `TRANSBANK_WEBPAY_COMMERCE_CODE` y `TRANSBANK_WEBPAY_API_KEY` son obligatorias.

## Seguridad aplicada

- La confirmacion del pago ocurre solo en backend.
- El monto se toma del `pedido` persistido, no del frontend.
- El retorno de pasarela valida:
  - `buy_order`
  - `session_id`
  - `amount`
- `public.pago` se crea con RLS habilitado y sin exponer acceso publico.
- Solo `service_role` recibe permisos explicitos sobre la tabla.

## Verificacion minima

- `npm run lint`
- `npm run typecheck`
- `npm run build`

Adicionalmente se valido la creacion real de una transaccion en ambiente de integracion de Transbank desde este entorno.
