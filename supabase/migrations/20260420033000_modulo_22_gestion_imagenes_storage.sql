-- Modulo 22 - Gestion de imagenes y storage
-- Objetivos:
-- 1. Crear bucket dedicado para imagenes de productos.
-- 2. Habilitar permisos server-side para storage e imagen_producto.

begin;

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'catalogo-productos',
  'catalogo-productos',
  true,
  5242880,
  array[
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/avif'
  ]::text[]
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create index if not exists imagen_producto_producto_orden_visual_idx
  on public.imagen_producto (producto_id, orden_visual asc, creado_en asc);

grant usage on schema storage to service_role;

grant select, insert, update on table storage.buckets to service_role;
grant select, insert, update, delete on table storage.objects to service_role;
grant select, insert, update, delete on table public.imagen_producto to service_role;

commit;
