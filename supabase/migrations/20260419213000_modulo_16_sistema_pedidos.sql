-- Modulo 16 - Sistema de pedidos
-- Incluye semillas minimas y una funcion RPC transaccional para crear pedidos desde checkout.

begin;

-- Semillas minimas: configuracion comercial y estado inicial de pedidos.
insert into public.configuracion_comercial (
  codigo,
  version,
  pais_operacion,
  moneda_base,
  precios_incluyen_iva,
  venta_solo_chile,
  despacho_habilitado,
  retiro_fisico_habilitado,
  login_google_habilitado,
  compra_invitado_habilitada,
  stock_visible_publico,
  respaldo_correo_pedidos,
  catalogo_administrable_desde_panel,
  cotizacion_mediante_formulario
)
values (
  'principal',
  '1',
  'CL',
  'CLP',
  true,
  true,
  true,
  false,
  true,
  true,
  false,
  true,
  true,
  true
)
on conflict (codigo, version) do nothing;

insert into public.estado_entidad (
  codigo,
  nombre,
  descripcion,
  esta_activo,
  orden_visual,
  entidad_objetivo,
  es_final
)
values (
  'creado',
  'Creado',
  'Pedido creado y registrado. Pendiente de pago y de confirmacion operativa.',
  true,
  0,
  'pedido',
  false
)
on conflict (entidad_objetivo, codigo) do nothing;

-- Funcion RPC: crea pedido + direccion + items de forma atomica (una transaccion).
-- Recalcula subtotal/total en base a cantidad y precios resueltos (variante -> producto -> snapshot).
create or replace function public.crear_pedido_desde_checkout(
  p_solicitud jsonb
)
returns table (
  pedido_id uuid,
  numero_pedido text,
  subtotal_iva_incluido integer,
  total_iva_incluido integer
)
language plpgsql
as $$
declare
  v_pedido_id uuid;
  v_numero_pedido text;
  v_configuracion_comercial_id uuid;
  v_estado_pedido_id uuid;
  v_datos_cliente jsonb;
  v_direccion_despacho jsonb;
  v_items jsonb;
  v_item jsonb;
  v_nombre_cliente text;
  v_apellido_cliente text;
  v_correo_cliente text;
  v_telefono_cliente text;
  v_region text;
  v_comuna text;
  v_calle text;
  v_numero_direccion text;
  v_departamento text;
  v_referencias text;
  v_codigo_postal text;
  v_slug text;
  v_codigo_referencia_variante text;
  v_sku_snapshot text;
  v_nombre_producto_snapshot text;
  v_descripcion_producto_snapshot text;
  v_atributos_snapshot jsonb;
  v_cantidad integer;
  v_precio_snapshot integer;
  v_precio_unitario integer;
  v_subtotal_linea integer;
  v_subtotal integer := 0;
  v_producto record;
  v_variante record;
begin
  if p_solicitud is null or jsonb_typeof(p_solicitud) <> 'object' then
    raise exception 'Solicitud invalida.';
  end if;

  v_datos_cliente := p_solicitud -> 'datosCliente';
  v_direccion_despacho := p_solicitud -> 'direccionDespacho';
  v_items := p_solicitud -> 'items';

  if v_datos_cliente is null or jsonb_typeof(v_datos_cliente) <> 'object' then
    raise exception 'Faltan datos del cliente.';
  end if;

  if v_direccion_despacho is null or jsonb_typeof(v_direccion_despacho) <> 'object' then
    raise exception 'Falta direccion de despacho.';
  end if;

  if v_items is null or jsonb_typeof(v_items) <> 'array' or jsonb_array_length(v_items) = 0 then
    raise exception 'El pedido debe incluir al menos un item.';
  end if;

  v_nombre_cliente := nullif(trim(v_datos_cliente->>'nombre'), '');
  v_apellido_cliente := nullif(trim(v_datos_cliente->>'apellido'), '');
  v_correo_cliente := nullif(trim(v_datos_cliente->>'correo'), '');
  v_telefono_cliente := nullif(trim(v_datos_cliente->>'telefono'), '');

  if v_nombre_cliente is null then
    raise exception 'Falta nombre del cliente.';
  end if;

  if v_apellido_cliente is null then
    raise exception 'Falta apellido del cliente.';
  end if;

  if v_correo_cliente is null then
    raise exception 'Falta correo del cliente.';
  end if;

  v_region := nullif(trim(v_direccion_despacho->>'region'), '');
  v_comuna := nullif(trim(v_direccion_despacho->>'comuna'), '');
  v_calle := nullif(trim(v_direccion_despacho->>'calle'), '');
  v_numero_direccion := nullif(trim(v_direccion_despacho->>'numero'), '');
  v_departamento := nullif(trim(v_direccion_despacho->>'departamento'), '');
  v_referencias := nullif(trim(v_direccion_despacho->>'referencias'), '');
  v_codigo_postal := nullif(trim(v_direccion_despacho->>'codigoPostal'), '');

  if v_region is null then
    raise exception 'Falta region de despacho.';
  end if;

  if v_comuna is null then
    raise exception 'Falta comuna de despacho.';
  end if;

  if v_calle is null then
    raise exception 'Falta calle de despacho.';
  end if;

  if v_numero_direccion is null then
    raise exception 'Falta numero de despacho.';
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
    into v_estado_pedido_id
  from public.estado_entidad
  where entidad_objetivo = 'pedido'
    and codigo = 'creado'
    and esta_activo = true
  order by creado_en desc
  limit 1;

  if v_estado_pedido_id is null then
    raise exception 'Falta estado inicial del pedido.';
  end if;

  v_numero_pedido :=
    'RKL-' ||
    to_char(now(), 'YYYYMMDD') ||
    '-' ||
    upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 6));

  insert into public.pedido (
    numero_pedido,
    cliente_id,
    estado_id,
    configuracion_comercial_id,
    moneda_codigo,
    nombre_cliente_snapshot,
    apellido_cliente_snapshot,
    correo_cliente_snapshot,
    telefono_cliente_snapshot,
    subtotal_iva_incluido,
    descuento_iva_incluido,
    costo_envio_iva_incluido,
    total_iva_incluido,
    observaciones_cliente
  )
  values (
    v_numero_pedido,
    null,
    v_estado_pedido_id,
    v_configuracion_comercial_id,
    'CLP',
    v_nombre_cliente,
    v_apellido_cliente,
    v_correo_cliente,
    v_telefono_cliente,
    0,
    null,
    null,
    0,
    null
  )
  returning id into v_pedido_id;

  insert into public.direccion_pedido (
    pedido_id,
    nombre_destinatario,
    apellido_destinatario,
    telefono_destinatario,
    region,
    comuna,
    calle,
    numero,
    departamento,
    referencias,
    codigo_postal
  )
  values (
    v_pedido_id,
    v_nombre_cliente,
    v_apellido_cliente,
    v_telefono_cliente,
    v_region,
    v_comuna,
    v_calle,
    v_numero_direccion,
    v_departamento,
    v_referencias,
    v_codigo_postal
  );

  for v_item in
    select value
    from jsonb_array_elements(v_items)
  loop
    v_slug := trim(v_item->>'slug');
    v_cantidad := nullif(v_item->>'cantidad', '')::integer;
    v_precio_snapshot := nullif(v_item->>'precioUnitarioIvaIncluidoSnapshot', '')::integer;
    v_codigo_referencia_variante := nullif(trim(v_item->>'codigoReferenciaVariante'), '');
    v_sku_snapshot := nullif(trim(v_item->>'skuSnapshot'), '');
    v_nombre_producto_snapshot := nullif(trim(v_item->>'nombre'), '');
    v_descripcion_producto_snapshot := nullif(trim(v_item->>'resumen'), '');
    v_atributos_snapshot := coalesce(v_item->'atributosSnapshot', '{}'::jsonb);

    if v_slug is null or length(v_slug) = 0 then
      raise exception 'Falta slug en item.';
    end if;

    if v_cantidad is null or v_cantidad < 1 then
      raise exception 'Cantidad invalida en item.';
    end if;

    if v_precio_snapshot is null or v_precio_snapshot < 0 then
      raise exception 'Precio snapshot invalido en item.';
    end if;

    if jsonb_typeof(v_atributos_snapshot) <> 'object' then
      v_atributos_snapshot := '{}'::jsonb;
    end if;

    select id, nombre, descripcion, sku_base, precio_base_iva_incluido
      into v_producto
    from public.producto
    where slug = v_slug
    limit 1;

    if v_codigo_referencia_variante is not null then
      if v_producto.id is not null then
        select id, precio_iva_incluido, codigo_referencia
          into v_variante
        from public.variante_producto
        where codigo_referencia = v_codigo_referencia_variante
          and producto_id = v_producto.id
        limit 1;
      else
        select id, precio_iva_incluido, codigo_referencia
          into v_variante
        from public.variante_producto
        where codigo_referencia = v_codigo_referencia_variante
        limit 1;
      end if;
    else
      v_variante := null;
    end if;

    v_precio_unitario := coalesce(
      v_variante.precio_iva_incluido,
      v_producto.precio_base_iva_incluido,
      v_precio_snapshot
    );

    if v_precio_unitario is null then
      raise exception 'No se pudo resolver precio para item.';
    end if;

    v_subtotal_linea := v_precio_unitario * v_cantidad;
    v_subtotal := v_subtotal + v_subtotal_linea;

    insert into public.item_pedido (
      pedido_id,
      producto_id,
      variante_id,
      sku_snapshot,
      nombre_producto_snapshot,
      descripcion_producto_snapshot,
      atributos_snapshot,
      precio_unitario_iva_incluido,
      cantidad,
      subtotal_linea_iva_incluido
    )
    values (
      v_pedido_id,
      v_producto.id,
      v_variante.id,
      coalesce(v_sku_snapshot, v_variante.codigo_referencia, v_producto.sku_base),
      coalesce(v_nombre_producto_snapshot, v_producto.nombre, 'Producto'),
      coalesce(v_producto.descripcion, v_descripcion_producto_snapshot),
      v_atributos_snapshot,
      v_precio_unitario,
      v_cantidad,
      v_subtotal_linea
    );
  end loop;

  update public.pedido
    set subtotal_iva_incluido = v_subtotal,
        total_iva_incluido = v_subtotal,
        descuento_iva_incluido = null,
        costo_envio_iva_incluido = null
  where id = v_pedido_id;

  pedido_id := v_pedido_id;
  numero_pedido := v_numero_pedido;
  subtotal_iva_incluido := v_subtotal;
  total_iva_incluido := v_subtotal;
  return next;
end;
$$;

commit;
