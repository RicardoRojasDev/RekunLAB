-- Modulo 20 - Administracion de productos
-- Objetivos:
-- 1. Habilitar estados operativos reales para producto y categoria.
-- 2. Entregar permisos minimos server-side para CRUD de productos desde admin.

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
values
  (
    'activo',
    'Activo',
    'Producto disponible para catalogo y venta.',
    'producto',
    0,
    true,
    false
  ),
  (
    'inactivo',
    'Inactivo',
    'Producto temporalmente fuera del catalogo publico.',
    'producto',
    10,
    true,
    false
  ),
  (
    'eliminado',
    'Eliminado',
    'Producto ocultado logicamente del catalogo operativo.',
    'producto',
    20,
    true,
    false
  ),
  (
    'activo',
    'Activa',
    'Categoria disponible para asignacion comercial.',
    'categoria-producto',
    0,
    true,
    false
  ),
  (
    'inactivo',
    'Inactiva',
    'Categoria temporalmente fuera de uso.',
    'categoria-producto',
    10,
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

grant select on table
  public.estado_entidad,
  public.marca_producto,
  public.nivel_comercial_producto,
  public.categoria_producto
to service_role;

grant select, insert, update on table
  public.producto,
  public.asignacion_categoria_producto
to service_role;

commit;
