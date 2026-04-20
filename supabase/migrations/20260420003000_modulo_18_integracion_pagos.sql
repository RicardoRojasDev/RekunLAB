-- Modulo 18 - Integracion de pagos
-- Objetivo:
-- 1. Registrar intenciones de pago ligadas a pedidos.
-- 2. Confirmar pagos sin confiar en el frontend.
-- 3. Mantener consistencia entre pedido y pago.

begin;

do $$
begin
  create type public.estado_pago as enum ('pendiente', 'pagado', 'fallido');
exception
  when duplicate_object then null;
end $$;

insert into public.estado_entidad (
  codigo,
  nombre,
  descripcion,
  esta_activo,
  orden_visual,
  entidad_objetivo,
  es_final
)
values
  (
    'pagado',
    'Pedido pagado',
    'Pago confirmado exitosamente por la pasarela configurada.',
    true,
    20,
    'pedido',
    false
  ),
  (
    'pago-fallido',
    'Pago fallido',
    'El intento de pago fue rechazado, abortado o no pudo confirmarse correctamente.',
    true,
    30,
    'pedido',
    false
  )
on conflict (entidad_objetivo, codigo) do update
set
  nombre = excluded.nombre,
  descripcion = excluded.descripcion,
  esta_activo = excluded.esta_activo,
  orden_visual = excluded.orden_visual,
  es_final = excluded.es_final;

create table if not exists public.pago (
  id uuid primary key default gen_random_uuid(),
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now(),
  metadatos jsonb not null default '{}'::jsonb,
  pedido_id uuid not null references public.pedido(id) on delete restrict,
  proveedor text not null,
  estado public.estado_pago not null default 'pendiente',
  intento integer not null,
  referencia_externa text not null,
  session_id_pasarela text not null,
  token_pasarela text null,
  url_redireccion text null,
  monto integer not null,
  moneda_codigo text not null default 'CLP',
  codigo_autorizacion text null,
  codigo_respuesta text null,
  tipo_pago text null,
  cuotas integer null,
  tarjeta_ultimos_digitos text null,
  payload_creacion jsonb not null default '{}'::jsonb,
  payload_confirmacion jsonb null,
  ultimo_error text null,
  pagado_en timestamptz null,
  fallido_en timestamptz null,
  constraint pago_metadatos_objeto check (jsonb_typeof(metadatos) = 'object'),
  constraint pago_payload_creacion_objeto check (jsonb_typeof(payload_creacion) = 'object'),
  constraint pago_payload_confirmacion_objeto check (
    payload_confirmacion is null or jsonb_typeof(payload_confirmacion) = 'object'
  ),
  constraint pago_proveedor_no_vacio check (length(trim(proveedor)) > 0),
  constraint pago_intento_valido check (intento >= 1),
  constraint pago_referencia_externa_no_vacia check (length(trim(referencia_externa)) > 0),
  constraint pago_session_id_pasarela_no_vacio check (length(trim(session_id_pasarela)) > 0),
  constraint pago_monto_no_negativo check (monto >= 0),
  constraint pago_moneda_formato check (moneda_codigo ~ '^[A-Z]{3}$'),
  constraint pago_cuotas_no_negativas check (cuotas is null or cuotas >= 0)
);

create unique index if not exists pago_pedido_intento_unico_idx
  on public.pago (pedido_id, intento);

create unique index if not exists pago_referencia_externa_unica_idx
  on public.pago (referencia_externa);

create unique index if not exists pago_token_pasarela_unico_idx
  on public.pago (token_pasarela)
  where token_pasarela is not null;

create unique index if not exists pago_pendiente_unico_por_pedido_idx
  on public.pago (pedido_id)
  where estado = 'pendiente';

create unique index if not exists pago_pagado_unico_por_pedido_idx
  on public.pago (pedido_id)
  where estado = 'pagado';

create index if not exists pago_pedido_creado_en_idx
  on public.pago (pedido_id, creado_en desc);

create index if not exists pago_estado_idx
  on public.pago (estado, creado_en desc);

drop trigger if exists pago_actualizado_en_trg on public.pago;

create trigger pago_actualizado_en_trg
  before update on public.pago
  for each row execute function public.establecer_actualizado_en();

alter table public.pago enable row level security;

grant select, insert, update on table public.pago to service_role;

commit;
