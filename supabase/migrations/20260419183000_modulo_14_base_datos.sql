-- Modulo 14 - Base de datos en Supabase (PostgreSQL)
-- Enfoque: esquema relacional flexible, no amarrado a una sola categoria, alineado al dominio.
-- Notas:
-- - Montos monetarios en CLP se almacenan como entero (IVA incluido) para evitar decimales.
-- - Se incluyen metadatos jsonb por entidad para extensibilidad controlada.

begin;

create extension if not exists pgcrypto;

-- Tipos enumerados (vocabularios controlados)
do $$
begin
  create type public.tipo_registro_cliente as enum ('invitado', 'cuenta');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.tipo_dato_atributo_producto as enum (
    'texto-corto',
    'texto-largo',
    'numero',
    'decimal',
    'booleano',
    'fecha',
    'seleccion-simple',
    'seleccion-multiple',
    'color',
    'json'
  );
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.naturaleza_atributo_producto as enum (
    'informativo',
    'comercial',
    'tecnico',
    'variante',
    'compatibilidad'
  );
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.entidad_objetivo_estado as enum (
    'categoria-producto',
    'producto',
    'variante-producto',
    'cliente',
    'pedido',
    'cotizacion'
  );
exception
  when duplicate_object then null;
end $$;

-- Funciones base
create or replace function public.establecer_actualizado_en()
returns trigger
language plpgsql
as $$
begin
  new.actualizado_en = now();
  return new;
end;
$$;

create or replace function public.validar_estado_entidad_objetivo_trigger()
returns trigger
language plpgsql
as $$
declare
  entidad_objetivo_esperado public.entidad_objetivo_estado;
begin
  if tg_nargs < 1 then
    raise exception 'Trigger de validacion de estado requiere entidad objetivo como argumento.';
  end if;

  entidad_objetivo_esperado := tg_argv[0]::public.entidad_objetivo_estado;

  if new.estado_id is null then
    return new;
  end if;

  if not exists (
    select 1
    from public.estado_entidad ee
    where ee.id = new.estado_id
      and ee.entidad_objetivo = entidad_objetivo_esperado
  ) then
    raise exception 'estado_id % no es valido para entidad_objetivo %', new.estado_id, entidad_objetivo_esperado;
  end if;

  return new;
end;
$$;

-- Catalogos auxiliares y estados
create table public.estado_entidad (
  id uuid primary key default gen_random_uuid(),
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now(),
  metadatos jsonb not null default '{}'::jsonb,
  codigo text not null,
  nombre text not null,
  descripcion text null,
  esta_activo boolean not null default true,
  orden_visual integer not null default 0,
  entidad_objetivo public.entidad_objetivo_estado not null,
  es_final boolean not null default false,
  constraint estado_entidad_metadatos_objeto check (jsonb_typeof(metadatos) = 'object'),
  constraint estado_entidad_orden_visual_no_negativo check (orden_visual >= 0),
  constraint estado_entidad_codigo_unico unique (entidad_objetivo, codigo)
);

create index estado_entidad_entidad_objetivo_idx
  on public.estado_entidad (entidad_objetivo);

create index estado_entidad_esta_activo_idx
  on public.estado_entidad (entidad_objetivo, esta_activo);

create trigger estado_entidad_actualizado_en_trg
  before update on public.estado_entidad
  for each row execute function public.establecer_actualizado_en();

create table public.marca_producto (
  id uuid primary key default gen_random_uuid(),
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now(),
  metadatos jsonb not null default '{}'::jsonb,
  codigo text not null,
  nombre text not null,
  descripcion text null,
  esta_activo boolean not null default true,
  orden_visual integer not null default 0,
  slug text not null,
  sitio_web text null,
  constraint marca_producto_metadatos_objeto check (jsonb_typeof(metadatos) = 'object'),
  constraint marca_producto_orden_visual_no_negativo check (orden_visual >= 0),
  constraint marca_producto_slug_formato check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  constraint marca_producto_codigo_unico unique (codigo),
  constraint marca_producto_slug_unico unique (slug)
);

create index marca_producto_esta_activo_idx
  on public.marca_producto (esta_activo);

create trigger marca_producto_actualizado_en_trg
  before update on public.marca_producto
  for each row execute function public.establecer_actualizado_en();

create table public.nivel_comercial_producto (
  id uuid primary key default gen_random_uuid(),
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now(),
  metadatos jsonb not null default '{}'::jsonb,
  codigo text not null,
  nombre text not null,
  descripcion text null,
  esta_activo boolean not null default true,
  orden_visual integer not null default 0,
  constraint nivel_comercial_producto_metadatos_objeto check (jsonb_typeof(metadatos) = 'object'),
  constraint nivel_comercial_producto_orden_visual_no_negativo check (orden_visual >= 0),
  constraint nivel_comercial_producto_codigo_unico unique (codigo)
);

create index nivel_comercial_producto_esta_activo_idx
  on public.nivel_comercial_producto (esta_activo);

create trigger nivel_comercial_producto_actualizado_en_trg
  before update on public.nivel_comercial_producto
  for each row execute function public.establecer_actualizado_en();

create table public.tecnologia_impresion (
  id uuid primary key default gen_random_uuid(),
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now(),
  metadatos jsonb not null default '{}'::jsonb,
  codigo text not null,
  nombre text not null,
  descripcion text null,
  esta_activo boolean not null default true,
  orden_visual integer not null default 0,
  constraint tecnologia_impresion_metadatos_objeto check (jsonb_typeof(metadatos) = 'object'),
  constraint tecnologia_impresion_orden_visual_no_negativo check (orden_visual >= 0),
  constraint tecnologia_impresion_codigo_unico unique (codigo)
);

create index tecnologia_impresion_esta_activo_idx
  on public.tecnologia_impresion (esta_activo);

create trigger tecnologia_impresion_actualizado_en_trg
  before update on public.tecnologia_impresion
  for each row execute function public.establecer_actualizado_en();

create table public.material (
  id uuid primary key default gen_random_uuid(),
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now(),
  metadatos jsonb not null default '{}'::jsonb,
  codigo text not null,
  nombre text not null,
  descripcion text null,
  esta_activo boolean not null default true,
  orden_visual integer not null default 0,
  codigo_tecnico text null,
  constraint material_metadatos_objeto check (jsonb_typeof(metadatos) = 'object'),
  constraint material_orden_visual_no_negativo check (orden_visual >= 0),
  constraint material_codigo_unico unique (codigo)
);

create index material_esta_activo_idx
  on public.material (esta_activo);

create trigger material_actualizado_en_trg
  before update on public.material
  for each row execute function public.establecer_actualizado_en();

-- Catalogo: categorias, productos, variantes, atributos, imagenes, compatibilidades
create table public.categoria_producto (
  id uuid primary key default gen_random_uuid(),
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now(),
  metadatos jsonb not null default '{}'::jsonb,
  slug text not null,
  nombre text not null,
  descripcion text null,
  categoria_padre_id uuid null references public.categoria_producto(id) on delete set null,
  estado_id uuid not null references public.estado_entidad(id) on delete restrict,
  orden_visual integer not null default 0,
  constraint categoria_producto_metadatos_objeto check (jsonb_typeof(metadatos) = 'object'),
  constraint categoria_producto_slug_formato check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  constraint categoria_producto_slug_unico unique (slug),
  constraint categoria_producto_orden_visual_no_negativo check (orden_visual >= 0)
);

create index categoria_producto_estado_id_idx
  on public.categoria_producto (estado_id);

create index categoria_producto_categoria_padre_id_idx
  on public.categoria_producto (categoria_padre_id);

create trigger categoria_producto_actualizado_en_trg
  before update on public.categoria_producto
  for each row execute function public.establecer_actualizado_en();

create trigger categoria_producto_validar_estado_trg
  before insert or update of estado_id on public.categoria_producto
  for each row execute function public.validar_estado_entidad_objetivo_trigger('categoria-producto');

create table public.producto (
  id uuid primary key default gen_random_uuid(),
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now(),
  metadatos jsonb not null default '{}'::jsonb,
  slug text not null,
  sku_base text not null,
  nombre text not null,
  modelo_comercial text null,
  resumen text not null,
  descripcion text not null,
  precio_base_iva_incluido integer null,
  marca_id uuid null references public.marca_producto(id) on delete restrict,
  nivel_comercial_id uuid null references public.nivel_comercial_producto(id) on delete restrict,
  tecnologia_impresion_id uuid null references public.tecnologia_impresion(id) on delete restrict,
  estado_id uuid not null references public.estado_entidad(id) on delete restrict,
  vende_directo boolean not null default true,
  permite_cotizacion boolean not null default false,
  constraint producto_metadatos_objeto check (jsonb_typeof(metadatos) = 'object'),
  constraint producto_slug_formato check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  constraint producto_slug_unico unique (slug),
  constraint producto_sku_base_unico unique (sku_base),
  constraint producto_precio_no_negativo check (precio_base_iva_incluido is null or precio_base_iva_incluido >= 0)
);

create index producto_estado_id_idx
  on public.producto (estado_id);

create index producto_marca_id_idx
  on public.producto (marca_id);

create index producto_nivel_comercial_id_idx
  on public.producto (nivel_comercial_id);

create index producto_tecnologia_impresion_id_idx
  on public.producto (tecnologia_impresion_id);

create trigger producto_actualizado_en_trg
  before update on public.producto
  for each row execute function public.establecer_actualizado_en();

create trigger producto_validar_estado_trg
  before insert or update of estado_id on public.producto
  for each row execute function public.validar_estado_entidad_objetivo_trigger('producto');

create table public.variante_producto (
  id uuid primary key default gen_random_uuid(),
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now(),
  metadatos jsonb not null default '{}'::jsonb,
  producto_id uuid not null references public.producto(id) on delete cascade,
  sku_variante text not null,
  codigo_referencia text null,
  nombre_comercial text null,
  precio_iva_incluido integer null,
  estado_id uuid not null references public.estado_entidad(id) on delete restrict,
  orden_visual integer not null default 0,
  constraint variante_producto_metadatos_objeto check (jsonb_typeof(metadatos) = 'object'),
  constraint variante_producto_sku_variante_unico unique (sku_variante),
  constraint variante_producto_precio_no_negativo check (precio_iva_incluido is null or precio_iva_incluido >= 0),
  constraint variante_producto_orden_visual_no_negativo check (orden_visual >= 0)
);

create index variante_producto_producto_id_idx
  on public.variante_producto (producto_id);

create index variante_producto_estado_id_idx
  on public.variante_producto (estado_id);

create trigger variante_producto_actualizado_en_trg
  before update on public.variante_producto
  for each row execute function public.establecer_actualizado_en();

create trigger variante_producto_validar_estado_trg
  before insert or update of estado_id on public.variante_producto
  for each row execute function public.validar_estado_entidad_objetivo_trigger('variante-producto');

create table public.asignacion_categoria_producto (
  id uuid primary key default gen_random_uuid(),
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now(),
  metadatos jsonb not null default '{}'::jsonb,
  producto_id uuid not null references public.producto(id) on delete cascade,
  categoria_id uuid not null references public.categoria_producto(id) on delete cascade,
  es_principal boolean not null default false,
  orden_visual integer not null default 0,
  constraint asignacion_categoria_producto_metadatos_objeto check (jsonb_typeof(metadatos) = 'object'),
  constraint asignacion_categoria_producto_orden_visual_no_negativo check (orden_visual >= 0),
  constraint asignacion_categoria_producto_unica unique (producto_id, categoria_id)
);

create unique index asignacion_categoria_producto_principal_unica
  on public.asignacion_categoria_producto (producto_id)
  where es_principal = true;

create index asignacion_categoria_producto_producto_id_idx
  on public.asignacion_categoria_producto (producto_id);

create index asignacion_categoria_producto_categoria_id_idx
  on public.asignacion_categoria_producto (categoria_id);

create trigger asignacion_categoria_producto_actualizado_en_trg
  before update on public.asignacion_categoria_producto
  for each row execute function public.establecer_actualizado_en();

create table public.definicion_atributo_producto (
  id uuid primary key default gen_random_uuid(),
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now(),
  metadatos jsonb not null default '{}'::jsonb,
  codigo text not null,
  nombre text not null,
  descripcion text null,
  tipo_dato public.tipo_dato_atributo_producto not null,
  naturaleza public.naturaleza_atributo_producto not null,
  unidad_base text null,
  usa_opciones_predefinidas boolean not null default false,
  es_filtrable boolean not null default false,
  es_visible_en_ficha boolean not null default true,
  permite_variantes boolean not null default false,
  orden_visual integer not null default 0,
  constraint definicion_atributo_producto_metadatos_objeto check (jsonb_typeof(metadatos) = 'object'),
  constraint definicion_atributo_producto_codigo_unico unique (codigo),
  constraint definicion_atributo_producto_orden_visual_no_negativo check (orden_visual >= 0)
);

create index definicion_atributo_producto_filtrable_idx
  on public.definicion_atributo_producto (es_filtrable)
  where es_filtrable = true;

create trigger definicion_atributo_producto_actualizado_en_trg
  before update on public.definicion_atributo_producto
  for each row execute function public.establecer_actualizado_en();

create table public.opcion_atributo_producto (
  id uuid primary key default gen_random_uuid(),
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now(),
  metadatos jsonb not null default '{}'::jsonb,
  atributo_id uuid not null references public.definicion_atributo_producto(id) on delete cascade,
  codigo text not null,
  etiqueta text not null,
  valor text not null,
  color_hex text null,
  esta_activo boolean not null default true,
  orden_visual integer not null default 0,
  constraint opcion_atributo_producto_metadatos_objeto check (jsonb_typeof(metadatos) = 'object'),
  constraint opcion_atributo_producto_orden_visual_no_negativo check (orden_visual >= 0),
  constraint opcion_atributo_producto_codigo_unico unique (atributo_id, codigo)
);

create index opcion_atributo_producto_atributo_id_idx
  on public.opcion_atributo_producto (atributo_id);

create index opcion_atributo_producto_esta_activo_idx
  on public.opcion_atributo_producto (atributo_id, esta_activo);

create trigger opcion_atributo_producto_actualizado_en_trg
  before update on public.opcion_atributo_producto
  for each row execute function public.establecer_actualizado_en();

create table public.valor_atributo_producto (
  id uuid primary key default gen_random_uuid(),
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now(),
  metadatos jsonb not null default '{}'::jsonb,
  producto_id uuid not null references public.producto(id) on delete cascade,
  variante_id uuid null references public.variante_producto(id) on delete cascade,
  atributo_id uuid not null references public.definicion_atributo_producto(id) on delete restrict,
  opcion_id uuid null references public.opcion_atributo_producto(id) on delete restrict,
  valor_texto text null,
  valor_numero numeric null,
  valor_booleano boolean null,
  valor_json jsonb null,
  constraint valor_atributo_producto_metadatos_objeto check (jsonb_typeof(metadatos) = 'object'),
  constraint valor_atributo_producto_valor_json_objeto check (valor_json is null or jsonb_typeof(valor_json) = 'object')
);

create unique index valor_atributo_producto_producto_unico
  on public.valor_atributo_producto (producto_id, atributo_id)
  where variante_id is null;

create unique index valor_atributo_producto_variante_unico
  on public.valor_atributo_producto (variante_id, atributo_id)
  where variante_id is not null;

create index valor_atributo_producto_producto_id_idx
  on public.valor_atributo_producto (producto_id);

create index valor_atributo_producto_variante_id_idx
  on public.valor_atributo_producto (variante_id);

create index valor_atributo_producto_atributo_id_idx
  on public.valor_atributo_producto (atributo_id);

create trigger valor_atributo_producto_actualizado_en_trg
  before update on public.valor_atributo_producto
  for each row execute function public.establecer_actualizado_en();

create table public.imagen_producto (
  id uuid primary key default gen_random_uuid(),
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now(),
  metadatos jsonb not null default '{}'::jsonb,
  producto_id uuid not null references public.producto(id) on delete cascade,
  variante_id uuid null references public.variante_producto(id) on delete cascade,
  url text not null,
  alt text not null,
  etiqueta text null,
  orden_visual integer not null default 0,
  es_principal boolean not null default false,
  constraint imagen_producto_metadatos_objeto check (jsonb_typeof(metadatos) = 'object'),
  constraint imagen_producto_orden_visual_no_negativo check (orden_visual >= 0)
);

create unique index imagen_producto_principal_producto_unica
  on public.imagen_producto (producto_id)
  where variante_id is null and es_principal = true;

create unique index imagen_producto_principal_variante_unica
  on public.imagen_producto (variante_id)
  where variante_id is not null and es_principal = true;

create index imagen_producto_producto_id_idx
  on public.imagen_producto (producto_id);

create index imagen_producto_variante_id_idx
  on public.imagen_producto (variante_id);

create trigger imagen_producto_actualizado_en_trg
  before update on public.imagen_producto
  for each row execute function public.establecer_actualizado_en();

create table public.compatibilidad_producto_material (
  id uuid primary key default gen_random_uuid(),
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now(),
  metadatos jsonb not null default '{}'::jsonb,
  producto_id uuid not null references public.producto(id) on delete cascade,
  material_id uuid not null references public.material(id) on delete restrict,
  observacion text null,
  constraint compatibilidad_producto_material_metadatos_objeto check (jsonb_typeof(metadatos) = 'object'),
  constraint compatibilidad_producto_material_unica unique (producto_id, material_id)
);

create index compatibilidad_producto_material_producto_id_idx
  on public.compatibilidad_producto_material (producto_id);

create index compatibilidad_producto_material_material_id_idx
  on public.compatibilidad_producto_material (material_id);

create trigger compatibilidad_producto_material_actualizado_en_trg
  before update on public.compatibilidad_producto_material
  for each row execute function public.establecer_actualizado_en();

-- Clientes y direcciones
create table public.cliente (
  id uuid primary key default gen_random_uuid(),
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now(),
  metadatos jsonb not null default '{}'::jsonb,
  tipo_registro public.tipo_registro_cliente not null,
  auth_usuario_id uuid null references auth.users(id) on delete set null,
  correo_principal text not null,
  nombre text not null,
  apellido text not null,
  telefono text null,
  estado_id uuid null references public.estado_entidad(id) on delete restrict,
  constraint cliente_metadatos_objeto check (jsonb_typeof(metadatos) = 'object'),
  constraint cliente_correo_principal_unico unique (correo_principal),
  constraint cliente_auth_usuario_id_unico unique (auth_usuario_id)
);

create index cliente_estado_id_idx
  on public.cliente (estado_id);

create trigger cliente_actualizado_en_trg
  before update on public.cliente
  for each row execute function public.establecer_actualizado_en();

create trigger cliente_validar_estado_trg
  before insert or update of estado_id on public.cliente
  for each row execute function public.validar_estado_entidad_objetivo_trigger('cliente');

create table public.direccion_cliente (
  id uuid primary key default gen_random_uuid(),
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now(),
  metadatos jsonb not null default '{}'::jsonb,
  cliente_id uuid not null references public.cliente(id) on delete cascade,
  alias text null,
  es_predeterminada boolean not null default false,
  nombre_destinatario text not null,
  apellido_destinatario text not null,
  telefono_destinatario text null,
  region text not null,
  comuna text not null,
  calle text not null,
  numero text not null,
  departamento text null,
  referencias text null,
  codigo_postal text null,
  constraint direccion_cliente_metadatos_objeto check (jsonb_typeof(metadatos) = 'object')
);

create unique index direccion_cliente_predeterminada_unica
  on public.direccion_cliente (cliente_id)
  where es_predeterminada = true;

create index direccion_cliente_cliente_id_idx
  on public.direccion_cliente (cliente_id);

create trigger direccion_cliente_actualizado_en_trg
  before update on public.direccion_cliente
  for each row execute function public.establecer_actualizado_en();

-- Configuracion comercial
create table public.configuracion_comercial (
  id uuid primary key default gen_random_uuid(),
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now(),
  metadatos jsonb not null default '{}'::jsonb,
  codigo text not null,
  version text not null,
  pais_operacion text not null,
  moneda_base text not null,
  precios_incluyen_iva boolean not null default true,
  venta_solo_chile boolean not null default true,
  despacho_habilitado boolean not null default true,
  retiro_fisico_habilitado boolean not null default false,
  login_google_habilitado boolean not null default true,
  compra_invitado_habilitada boolean not null default true,
  stock_visible_publico boolean not null default false,
  respaldo_correo_pedidos boolean not null default true,
  catalogo_administrable_desde_panel boolean not null default true,
  cotizacion_mediante_formulario boolean not null default true,
  constraint configuracion_comercial_metadatos_objeto check (jsonb_typeof(metadatos) = 'object'),
  constraint configuracion_comercial_codigo_version_unica unique (codigo, version),
  constraint configuracion_comercial_pais_formato check (pais_operacion ~ '^[A-Z]{2}$'),
  constraint configuracion_comercial_moneda_formato check (moneda_base ~ '^[A-Z]{3}$')
);

create index configuracion_comercial_codigo_idx
  on public.configuracion_comercial (codigo);

create trigger configuracion_comercial_actualizado_en_trg
  before update on public.configuracion_comercial
  for each row execute function public.establecer_actualizado_en();

-- Pedidos y cotizaciones (sin pagos en este modulo)
create table public.pedido (
  id uuid primary key default gen_random_uuid(),
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now(),
  metadatos jsonb not null default '{}'::jsonb,
  numero_pedido text not null,
  cliente_id uuid null references public.cliente(id) on delete set null,
  estado_id uuid not null references public.estado_entidad(id) on delete restrict,
  configuracion_comercial_id uuid not null references public.configuracion_comercial(id) on delete restrict,
  moneda_codigo text not null default 'CLP',
  nombre_cliente_snapshot text not null,
  apellido_cliente_snapshot text not null,
  correo_cliente_snapshot text not null,
  telefono_cliente_snapshot text null,
  subtotal_iva_incluido integer not null,
  descuento_iva_incluido integer null,
  costo_envio_iva_incluido integer null,
  total_iva_incluido integer not null,
  observaciones_cliente text null,
  constraint pedido_metadatos_objeto check (jsonb_typeof(metadatos) = 'object'),
  constraint pedido_numero_pedido_unico unique (numero_pedido),
  constraint pedido_totales_no_negativos check (
    subtotal_iva_incluido >= 0
    and (descuento_iva_incluido is null or descuento_iva_incluido >= 0)
    and (costo_envio_iva_incluido is null or costo_envio_iva_incluido >= 0)
    and total_iva_incluido >= 0
  ),
  constraint pedido_total_consistente check (
    total_iva_incluido = subtotal_iva_incluido
      - coalesce(descuento_iva_incluido, 0)
      + coalesce(costo_envio_iva_incluido, 0)
  )
);

create index pedido_cliente_id_idx
  on public.pedido (cliente_id);

create index pedido_estado_id_idx
  on public.pedido (estado_id);

create index pedido_creado_en_idx
  on public.pedido (creado_en desc);

create trigger pedido_actualizado_en_trg
  before update on public.pedido
  for each row execute function public.establecer_actualizado_en();

create trigger pedido_validar_estado_trg
  before insert or update of estado_id on public.pedido
  for each row execute function public.validar_estado_entidad_objetivo_trigger('pedido');

create table public.direccion_pedido (
  id uuid primary key default gen_random_uuid(),
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now(),
  metadatos jsonb not null default '{}'::jsonb,
  pedido_id uuid not null references public.pedido(id) on delete cascade,
  nombre_destinatario text not null,
  apellido_destinatario text not null,
  telefono_destinatario text null,
  region text not null,
  comuna text not null,
  calle text not null,
  numero text not null,
  departamento text null,
  referencias text null,
  codigo_postal text null,
  constraint direccion_pedido_metadatos_objeto check (jsonb_typeof(metadatos) = 'object'),
  constraint direccion_pedido_pedido_unico unique (pedido_id)
);

create index direccion_pedido_pedido_id_idx
  on public.direccion_pedido (pedido_id);

create trigger direccion_pedido_actualizado_en_trg
  before update on public.direccion_pedido
  for each row execute function public.establecer_actualizado_en();

create table public.item_pedido (
  id uuid primary key default gen_random_uuid(),
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now(),
  metadatos jsonb not null default '{}'::jsonb,
  pedido_id uuid not null references public.pedido(id) on delete cascade,
  producto_id uuid null references public.producto(id) on delete set null,
  variante_id uuid null references public.variante_producto(id) on delete set null,
  sku_snapshot text null,
  nombre_producto_snapshot text not null,
  descripcion_producto_snapshot text null,
  atributos_snapshot jsonb not null default '{}'::jsonb,
  precio_unitario_iva_incluido integer not null,
  cantidad integer not null,
  subtotal_linea_iva_incluido integer not null,
  constraint item_pedido_metadatos_objeto check (jsonb_typeof(metadatos) = 'object'),
  constraint item_pedido_atributos_snapshot_objeto check (jsonb_typeof(atributos_snapshot) = 'object'),
  constraint item_pedido_cantidad_valida check (cantidad >= 1),
  constraint item_pedido_precios_no_negativos check (
    precio_unitario_iva_incluido >= 0 and subtotal_linea_iva_incluido >= 0
  ),
  constraint item_pedido_subtotal_consistente check (
    subtotal_linea_iva_incluido = precio_unitario_iva_incluido * cantidad
  )
);

create index item_pedido_pedido_id_idx
  on public.item_pedido (pedido_id);

create index item_pedido_producto_id_idx
  on public.item_pedido (producto_id);

create index item_pedido_variante_id_idx
  on public.item_pedido (variante_id);

create trigger item_pedido_actualizado_en_trg
  before update on public.item_pedido
  for each row execute function public.establecer_actualizado_en();

create table public.cotizacion (
  id uuid primary key default gen_random_uuid(),
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now(),
  metadatos jsonb not null default '{}'::jsonb,
  numero_cotizacion text not null,
  cliente_id uuid null references public.cliente(id) on delete set null,
  estado_id uuid not null references public.estado_entidad(id) on delete restrict,
  configuracion_comercial_id uuid not null references public.configuracion_comercial(id) on delete restrict,
  nombre_solicitante text not null,
  apellido_solicitante text not null,
  correo_solicitante text not null,
  telefono_solicitante text null,
  mensaje_solicitud text null,
  constraint cotizacion_metadatos_objeto check (jsonb_typeof(metadatos) = 'object'),
  constraint cotizacion_numero_cotizacion_unico unique (numero_cotizacion)
);

create index cotizacion_cliente_id_idx
  on public.cotizacion (cliente_id);

create index cotizacion_estado_id_idx
  on public.cotizacion (estado_id);

create index cotizacion_creado_en_idx
  on public.cotizacion (creado_en desc);

create trigger cotizacion_actualizado_en_trg
  before update on public.cotizacion
  for each row execute function public.establecer_actualizado_en();

create trigger cotizacion_validar_estado_trg
  before insert or update of estado_id on public.cotizacion
  for each row execute function public.validar_estado_entidad_objetivo_trigger('cotizacion');

create table public.item_cotizacion (
  id uuid primary key default gen_random_uuid(),
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now(),
  metadatos jsonb not null default '{}'::jsonb,
  cotizacion_id uuid not null references public.cotizacion(id) on delete cascade,
  producto_id uuid null references public.producto(id) on delete set null,
  variante_id uuid null references public.variante_producto(id) on delete set null,
  nombre_producto_snapshot text null,
  atributos_solicitados_snapshot jsonb not null default '{}'::jsonb,
  cantidad_solicitada integer not null,
  observacion_solicitante text null,
  constraint item_cotizacion_metadatos_objeto check (jsonb_typeof(metadatos) = 'object'),
  constraint item_cotizacion_atributos_snapshot_objeto check (jsonb_typeof(atributos_solicitados_snapshot) = 'object'),
  constraint item_cotizacion_cantidad_valida check (cantidad_solicitada >= 1)
);

create index item_cotizacion_cotizacion_id_idx
  on public.item_cotizacion (cotizacion_id);

create index item_cotizacion_producto_id_idx
  on public.item_cotizacion (producto_id);

create index item_cotizacion_variante_id_idx
  on public.item_cotizacion (variante_id);

create trigger item_cotizacion_actualizado_en_trg
  before update on public.item_cotizacion
  for each row execute function public.establecer_actualizado_en();

commit;
