# Modulo 16 - Sistema de pedidos

## Objetivo

Registrar compras de forma confiable y estructurada, dejando trazabilidad minima viable y lista para integrar pagos y correos en modulos posteriores.

## Alcance

- Flujo de creacion de pedido desde checkout.
- Persistencia de pedido, direccion y items con snapshots (precios y atributos al momento de compra).
- Estado inicial del pedido y numero visible de pedido.
- Integracion con carrito y checkout existentes sin duplicar logica.
- Validacion en frontend (UX) y validacion en servidor (no confiar solo en el navegador).

## Lo que NO incluye

- Integracion de pagos.
- Correos transaccionales.
- Panel admin.
- Seguridad final (RLS/policies); la persistencia se ejecuta server-side con service role.

## Arquitectura

### Entrada

- `src/app/api/pedidos/route.ts` expone `POST /api/pedidos`.
- El checkout construye una `SolicitudCrearPedido` y la envia a la API.

### Validacion

- Parseo robusto desde JSON: `src/modulos/pedidos/validaciones/parsear-solicitud-crear-pedido.ts`.
- Validacion de reglas minimas (requeridos, correo, cantidades, montos): `src/modulos/pedidos/validaciones/crear-pedido.ts`.

### Persistencia (transaccional)

- La base de datos crea el pedido en una sola transaccion via RPC:
  - `supabase/migrations/20260419213000_modulo_16_sistema_pedidos.sql`
  - Funcion: `public.crear_pedido_desde_checkout(jsonb)`
  - Inserta: `pedido`, `direccion_pedido`, `item_pedido`
  - Recalcula subtotal y total en servidor/BD (variante -> producto -> snapshot).

### Servicio y repositorio

- Servicio (orquestacion): `src/modulos/pedidos/servicios/registrar-pedido-desde-checkout.ts`
- Repositorio Supabase server-only: `src/modulos/pedidos/repositorios/crear-pedido-supabase.ts`

## Notas de confiabilidad

- No se acepta subtotal/total desde el frontend: la funcion RPC calcula totales en base a items y precios resueltos.
- Si existe catalogo real en Supabase, se prioriza precio de variante/producto. Si no existe, se usa el snapshot del carrito.
- Se guardan snapshots en `item_pedido` para mantener historicos aunque cambien productos o precios.

