-- Modulo 25 - Proteccion admin, validacion backend y RLS
-- Objetivos:
-- 1) Endurecer el acceso a datos habilitando RLS en todas las tablas del dominio.
-- 2) Restringir funciones RPC criticas para que solo se ejecuten desde backend (service_role).
-- 3) Definir politicas explicitas de acceso para service_role (el resto queda denegado por ausencia de politicas).
--
-- Nota: Esta migracion asume que la aplicacion accede a Supabase desde el servidor con SUPABASE_SERVICE_ROLE_KEY
-- y que los flujos publicos (checkout/cotizaciones) se ejecutan via API Routes + RPC con service_role.

begin;

-- ---------------------------------------------------------------------------
-- 1) Restriccion de ejecucion de RPC criticas (no confiar en el frontend)
-- ---------------------------------------------------------------------------
revoke execute on function public.crear_pedido_desde_checkout(jsonb) from public;
grant execute on function public.crear_pedido_desde_checkout(jsonb) to service_role;

revoke execute on function public.crear_cotizacion_desde_formulario(jsonb) from public;
grant execute on function public.crear_cotizacion_desde_formulario(jsonb) to service_role;

-- ---------------------------------------------------------------------------
-- 2) Habilitar Row Level Security (RLS) en tablas del dominio
-- ---------------------------------------------------------------------------
alter table if exists public.estado_entidad enable row level security;
alter table if exists public.marca_producto enable row level security;
alter table if exists public.nivel_comercial_producto enable row level security;
alter table if exists public.tecnologia_impresion enable row level security;
alter table if exists public.material enable row level security;
alter table if exists public.categoria_producto enable row level security;
alter table if exists public.producto enable row level security;
alter table if exists public.variante_producto enable row level security;
alter table if exists public.asignacion_categoria_producto enable row level security;
alter table if exists public.definicion_atributo_producto enable row level security;
alter table if exists public.opcion_atributo_producto enable row level security;
alter table if exists public.valor_atributo_producto enable row level security;
alter table if exists public.imagen_producto enable row level security;
alter table if exists public.compatibilidad_producto_material enable row level security;
alter table if exists public.cliente enable row level security;
alter table if exists public.direccion_cliente enable row level security;
alter table if exists public.configuracion_comercial enable row level security;
alter table if exists public.pedido enable row level security;
alter table if exists public.direccion_pedido enable row level security;
alter table if exists public.item_pedido enable row level security;
alter table if exists public.cotizacion enable row level security;
alter table if exists public.item_cotizacion enable row level security;
alter table if exists public.pago enable row level security;

-- ---------------------------------------------------------------------------
-- 3) Politicas RLS: permitir service_role (backend) en cada tabla
-- ---------------------------------------------------------------------------
drop policy if exists politica_service_role_estado_entidad on public.estado_entidad;
create policy politica_service_role_estado_entidad
  on public.estado_entidad
  for all
  to service_role
  using (true)
  with check (true);

drop policy if exists politica_service_role_marca_producto on public.marca_producto;
create policy politica_service_role_marca_producto
  on public.marca_producto
  for all
  to service_role
  using (true)
  with check (true);

drop policy if exists politica_service_role_nivel_comercial_producto on public.nivel_comercial_producto;
create policy politica_service_role_nivel_comercial_producto
  on public.nivel_comercial_producto
  for all
  to service_role
  using (true)
  with check (true);

drop policy if exists politica_service_role_tecnologia_impresion on public.tecnologia_impresion;
create policy politica_service_role_tecnologia_impresion
  on public.tecnologia_impresion
  for all
  to service_role
  using (true)
  with check (true);

drop policy if exists politica_service_role_material on public.material;
create policy politica_service_role_material
  on public.material
  for all
  to service_role
  using (true)
  with check (true);

drop policy if exists politica_service_role_categoria_producto on public.categoria_producto;
create policy politica_service_role_categoria_producto
  on public.categoria_producto
  for all
  to service_role
  using (true)
  with check (true);

drop policy if exists politica_service_role_producto on public.producto;
create policy politica_service_role_producto
  on public.producto
  for all
  to service_role
  using (true)
  with check (true);

drop policy if exists politica_service_role_variante_producto on public.variante_producto;
create policy politica_service_role_variante_producto
  on public.variante_producto
  for all
  to service_role
  using (true)
  with check (true);

drop policy if exists politica_service_role_asignacion_categoria_producto on public.asignacion_categoria_producto;
create policy politica_service_role_asignacion_categoria_producto
  on public.asignacion_categoria_producto
  for all
  to service_role
  using (true)
  with check (true);

drop policy if exists politica_service_role_definicion_atributo_producto on public.definicion_atributo_producto;
create policy politica_service_role_definicion_atributo_producto
  on public.definicion_atributo_producto
  for all
  to service_role
  using (true)
  with check (true);

drop policy if exists politica_service_role_opcion_atributo_producto on public.opcion_atributo_producto;
create policy politica_service_role_opcion_atributo_producto
  on public.opcion_atributo_producto
  for all
  to service_role
  using (true)
  with check (true);

drop policy if exists politica_service_role_valor_atributo_producto on public.valor_atributo_producto;
create policy politica_service_role_valor_atributo_producto
  on public.valor_atributo_producto
  for all
  to service_role
  using (true)
  with check (true);

drop policy if exists politica_service_role_imagen_producto on public.imagen_producto;
create policy politica_service_role_imagen_producto
  on public.imagen_producto
  for all
  to service_role
  using (true)
  with check (true);

drop policy if exists politica_service_role_compatibilidad_producto_material on public.compatibilidad_producto_material;
create policy politica_service_role_compatibilidad_producto_material
  on public.compatibilidad_producto_material
  for all
  to service_role
  using (true)
  with check (true);

drop policy if exists politica_service_role_cliente on public.cliente;
create policy politica_service_role_cliente
  on public.cliente
  for all
  to service_role
  using (true)
  with check (true);

drop policy if exists politica_service_role_direccion_cliente on public.direccion_cliente;
create policy politica_service_role_direccion_cliente
  on public.direccion_cliente
  for all
  to service_role
  using (true)
  with check (true);

drop policy if exists politica_service_role_configuracion_comercial on public.configuracion_comercial;
create policy politica_service_role_configuracion_comercial
  on public.configuracion_comercial
  for all
  to service_role
  using (true)
  with check (true);

drop policy if exists politica_service_role_pedido on public.pedido;
create policy politica_service_role_pedido
  on public.pedido
  for all
  to service_role
  using (true)
  with check (true);

drop policy if exists politica_service_role_direccion_pedido on public.direccion_pedido;
create policy politica_service_role_direccion_pedido
  on public.direccion_pedido
  for all
  to service_role
  using (true)
  with check (true);

drop policy if exists politica_service_role_item_pedido on public.item_pedido;
create policy politica_service_role_item_pedido
  on public.item_pedido
  for all
  to service_role
  using (true)
  with check (true);

drop policy if exists politica_service_role_cotizacion on public.cotizacion;
create policy politica_service_role_cotizacion
  on public.cotizacion
  for all
  to service_role
  using (true)
  with check (true);

drop policy if exists politica_service_role_item_cotizacion on public.item_cotizacion;
create policy politica_service_role_item_cotizacion
  on public.item_cotizacion
  for all
  to service_role
  using (true)
  with check (true);

drop policy if exists politica_service_role_pago on public.pago;
create policy politica_service_role_pago
  on public.pago
  for all
  to service_role
  using (true)
  with check (true);

-- ---------------------------------------------------------------------------
-- 4) Permisos: asegurar privilegios minimos para service_role
-- ---------------------------------------------------------------------------
grant usage on schema public to service_role;

grant select, insert, update, delete on table
  public.estado_entidad,
  public.marca_producto,
  public.nivel_comercial_producto,
  public.tecnologia_impresion,
  public.material,
  public.categoria_producto,
  public.producto,
  public.variante_producto,
  public.asignacion_categoria_producto,
  public.definicion_atributo_producto,
  public.opcion_atributo_producto,
  public.valor_atributo_producto,
  public.imagen_producto,
  public.compatibilidad_producto_material,
  public.cliente,
  public.direccion_cliente,
  public.configuracion_comercial,
  public.pedido,
  public.direccion_pedido,
  public.item_pedido,
  public.cotizacion,
  public.item_cotizacion,
  public.pago
to service_role;

commit;

