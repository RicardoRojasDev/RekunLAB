-- Modulo 23 - Formulario de cotizacion
-- Objetivos:
-- 1. Habilitar un estado inicial para cotizaciones.
-- 2. Crear una funcion RPC transaccional para registrar cotizaciones publicas.

begin;

insert into public.estado_entidad (
  codigo,
  nombre,
  descripcion,
  entidad_objetivo,
  orden_visual,
  esta_activo,
  es_final
)
values (
  'recibida',
  'Recibida',
  'Cotizacion recibida y registrada. Pendiente de respuesta operativa.',
  'cotizacion',
  0,
  true,
  false
)
on conflict (entidad_objetivo, codigo) do update
set
  nombre = excluded.nombre,
  descripcion = excluded.descripcion,
  orden_visual = excluded.orden_visual,
  esta_activo = excluded.esta_activo,
  es_final = excluded.es_final;

-- Funcion RPC: crea cotizacion de forma atomica.
create or replace function public.crear_cotizacion_desde_formulario(
  p_solicitud jsonb
)
returns table (
  cotizacion_id uuid,
  numero_cotizacion text
)
language plpgsql
as $$
declare
  v_cotizacion_id uuid;
  v_numero_cotizacion text;
  v_configuracion_comercial_id uuid;
  v_estado_cotizacion_id uuid;
  v_solicitante jsonb;
  v_nombre text;
  v_apellido text;
  v_correo text;
  v_telefono text;
  v_mensaje text;
begin
  if p_solicitud is null or jsonb_typeof(p_solicitud) <> 'object' then
    raise exception 'Solicitud invalida.';
  end if;

  v_solicitante := p_solicitud -> 'solicitante';

  if v_solicitante is null or jsonb_typeof(v_solicitante) <> 'object' then
    raise exception 'Faltan datos del solicitante.';
  end if;

  v_nombre := nullif(trim(v_solicitante->>'nombre'), '');
  v_apellido := nullif(trim(v_solicitante->>'apellido'), '');
  v_correo := nullif(trim(v_solicitante->>'correo'), '');
  v_telefono := nullif(trim(v_solicitante->>'telefono'), '');
  v_mensaje := nullif(trim(p_solicitud->>'mensaje'), '');

  if v_nombre is null then
    raise exception 'Falta nombre del solicitante.';
  end if;

  if v_apellido is null then
    raise exception 'Falta apellido del solicitante.';
  end if;

  if v_correo is null then
    raise exception 'Falta correo del solicitante.';
  end if;

  select id
    into v_configuracion_comercial_id
  from public.configuracion_comercial
  where codigo = 'principal'
  order by creado_en desc
  limit 1;

  if v_configuracion_comercial_id is null then
    raise exception 'Falta configuracion comercial.';
  end if;

  select id
    into v_estado_cotizacion_id
  from public.estado_entidad
  where entidad_objetivo = 'cotizacion'
    and codigo = 'recibida'
    and esta_activo = true
  order by creado_en desc
  limit 1;

  if v_estado_cotizacion_id is null then
    raise exception 'Falta estado inicial de cotizacion.';
  end if;

  v_numero_cotizacion :=
    'RKLQ-' ||
    to_char(now(), 'YYYYMMDD') ||
    '-' ||
    upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 6));

  insert into public.cotizacion (
    numero_cotizacion,
    cliente_id,
    estado_id,
    configuracion_comercial_id,
    nombre_solicitante,
    apellido_solicitante,
    correo_solicitante,
    telefono_solicitante,
    mensaje_solicitud
  )
  values (
    v_numero_cotizacion,
    null,
    v_estado_cotizacion_id,
    v_configuracion_comercial_id,
    v_nombre,
    v_apellido,
    v_correo,
    v_telefono,
    v_mensaje
  )
  returning id into v_cotizacion_id;

  cotizacion_id := v_cotizacion_id;
  numero_cotizacion := v_numero_cotizacion;
  return next;
end;
$$;

revoke execute on function public.crear_cotizacion_desde_formulario(jsonb) from public;
grant execute on function public.crear_cotizacion_desde_formulario(jsonb) to service_role;

commit;

