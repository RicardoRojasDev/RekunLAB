# Modulo 14 - Base de datos en Supabase (PostgreSQL)

## Objetivo

Implementar un esquema PostgreSQL solido, escalable y flexible en Supabase, alineado al dominio definido, sin amarrar el catalogo a una sola categoria y preparado para administracion desde panel.

## Alcance

- Tablas relacionales para catalogo dinamico, clientes, direcciones, pedidos y cotizaciones.
- Catalogos auxiliares para vocabularios controlados (marca, nivel, tecnologia, material, estados).
- Restricciones, claves foraneas, indices iniciales, slugs y timestamps.
- SQL de migracion recomendado para Supabase CLI.

## Convenciones

- Tablas y columnas en `snake_case` y en espanol.
- PK `uuid` con `gen_random_uuid()`.
- `creado_en`, `actualizado_en` y `metadatos jsonb` en todas las entidades.
- Montos en CLP como `integer` (IVA incluido, sin decimales).
- Slugs con formato `kebab-case` (regex) y `unique`.

## Tablas principales

### Estados y catalogos auxiliares

- `estado_entidad` (con `entidad_objetivo`): estados reutilizables por entidad sin hardcodear flujos.
- `marca_producto`
- `nivel_comercial_producto`
- `tecnologia_impresion`
- `material`

### Catalogo

- `categoria_producto` (jerarquia via `categoria_padre_id`).
- `producto` (precio base opcional, venta directa/cotizacion).
- `variante_producto` (precio opcional, orden visual).
- `asignacion_categoria_producto` (soporta multiples categorias y una principal).
- `definicion_atributo_producto`, `opcion_atributo_producto`, `valor_atributo_producto` (atributos dinamicos).
- `imagen_producto` (galeria por producto/variante, con principalidad).
- `compatibilidad_producto_material` (n:n).

### Clientes y direcciones

- `cliente` (cuenta o invitado, listo para integrar `auth.users`).
- `direccion_cliente` (libreta, con predeterminada unica).

### Operacion comercial

- `configuracion_comercial` (versiona reglas comerciales vigentes).
- `pedido`, `direccion_pedido`, `item_pedido` (snapshots para historicos).
- `cotizacion`, `item_cotizacion` (cotizaciones por formulario).

## Indices y restricciones clave

- Unicos: `producto.slug`, `producto.sku_base`, `categoria_producto.slug`, `variante_producto.sku_variante`, `pedido.numero_pedido`, `cotizacion.numero_cotizacion`.
- Unico parcial: una categoria principal por producto, una imagen principal por producto/variante, una direccion predeterminada por cliente.
- Checks: slugs, montos no negativos, cantidad >= 1, JSONB como objeto donde corresponde.
- Triggers:
  - `actualizado_en` automatico.
  - validacion de `estado_id` para que coincida con `estado_entidad.entidad_objetivo` por tabla.

## Migracion recomendada

Archivo:

- `supabase/migrations/20260419183000_modulo_14_base_datos.sql`

Aplicacion (via Supabase CLI):

```bash
supabase db reset
supabase migration up
```

## Decisiones justificadas (resumen)

- El catalogo no se rigidiza a impresoras: se modelan categorias, atributos y compatibilidades como relaciones.
- Los pedidos y cotizaciones guardan snapshots para tolerar cambios o eliminaciones posteriores del catalogo.
- Los estados se centralizan en `estado_entidad` para permitir activar/desactivar productos y categorias sin columnas hardcodeadas.

