import "server-only";

import { obtenerResumenPagoPedido } from "@/modulos/pagos";
import { crearClienteSupabaseServidorServicio } from "@/compartido/servicios/supabase/index-servidor";
import type {
  DetallePedidoAdmin,
  DireccionPedidoAdmin,
  EstadoPagoAdminPedido,
  EstadoPedidoAdmin,
  EventoHistorialPedidoAdmin,
  ItemPedidoAdmin,
  PagoPedidoAdmin,
  ResumenPedidoAdmin,
  VistaAdminPedidos,
} from "../tipos/admin-pedidos";

type RelacionSimple<T> = T | readonly T[] | null;

type FilaPagoSupabase = Readonly<{
  id: string;
  estado: "pendiente" | "pagado" | "fallido";
  proveedor: string | null;
  intento: number | null;
  referencia_externa: string | null;
  creado_en: string;
  pagado_en: string | null;
  fallido_en: string | null;
  ultimo_error: string | null;
}>;

type FilaDireccionPedidoSupabase = Readonly<{
  nombre_destinatario: string;
  apellido_destinatario: string;
  telefono_destinatario: string | null;
  region: string;
  comuna: string;
  calle: string;
  numero: string;
  departamento: string | null;
  referencias: string | null;
  codigo_postal: string | null;
}>;

type FilaItemPedidoSupabase = Readonly<{
  id: string;
  sku_snapshot: string | null;
  nombre_producto_snapshot: string;
  descripcion_producto_snapshot: string | null;
  atributos_snapshot: Record<string, unknown> | null;
  precio_unitario_iva_incluido: number;
  cantidad: number;
  subtotal_linea_iva_incluido: number;
}>;

type FilaPedidoListadoSupabase = Readonly<{
  id: string;
  numero_pedido: string;
  creado_en: string;
  actualizado_en: string;
  total_iva_incluido: number;
  moneda_codigo: string;
  nombre_cliente_snapshot: string;
  apellido_cliente_snapshot: string;
  correo_cliente_snapshot: string;
  telefono_cliente_snapshot: string | null;
  estado: RelacionSimple<Readonly<{ id: string; codigo: string | null; nombre: string | null }>>;
  direccion: RelacionSimple<
    Readonly<{
      region: string | null;
      comuna: string | null;
    }>
  >;
  items: readonly Readonly<{ id: string }>[] | null;
  pagos: readonly FilaPagoSupabase[] | null;
}>;

type FilaPedidoDetalleSupabase = Readonly<
  Omit<FilaPedidoListadoSupabase, "direccion" | "items"> & {
    subtotal_iva_incluido: number;
    descuento_iva_incluido: number | null;
    costo_envio_iva_incluido: number | null;
    observaciones_cliente: string | null;
    direccion: RelacionSimple<FilaDireccionPedidoSupabase>;
    items: readonly FilaItemPedidoSupabase[] | null;
  }
>;

const seleccionListadoPedidosAdmin = `
  id,
  numero_pedido,
  creado_en,
  actualizado_en,
  total_iva_incluido,
  moneda_codigo,
  nombre_cliente_snapshot,
  apellido_cliente_snapshot,
  correo_cliente_snapshot,
  telefono_cliente_snapshot,
  estado:estado_entidad(id, codigo, nombre),
  direccion:direccion_pedido(region, comuna),
  items:item_pedido(id),
  pagos:pago(
    id,
    estado,
    proveedor,
    intento,
    referencia_externa,
    creado_en,
    pagado_en,
    fallido_en,
    ultimo_error
  )
`;

const seleccionDetallePedidoAdmin = `
  id,
  numero_pedido,
  creado_en,
  actualizado_en,
  subtotal_iva_incluido,
  descuento_iva_incluido,
  costo_envio_iva_incluido,
  total_iva_incluido,
  moneda_codigo,
  nombre_cliente_snapshot,
  apellido_cliente_snapshot,
  correo_cliente_snapshot,
  telefono_cliente_snapshot,
  observaciones_cliente,
  estado:estado_entidad(id, codigo, nombre),
  direccion:direccion_pedido(
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
  ),
  items:item_pedido(
    id,
    sku_snapshot,
    nombre_producto_snapshot,
    descripcion_producto_snapshot,
    atributos_snapshot,
    precio_unitario_iva_incluido,
    cantidad,
    subtotal_linea_iva_incluido
  ),
  pagos:pago(
    id,
    estado,
    proveedor,
    intento,
    referencia_externa,
    creado_en,
    pagado_en,
    fallido_en,
    ultimo_error
  )
`;

function extraerRelacionSimple<T>(valor: RelacionSimple<T>) {
  if (Array.isArray(valor)) {
    return valor[0] ?? null;
  }

  return valor ?? null;
}

function esRegistro(valor: unknown): valor is Record<string, unknown> {
  return typeof valor === "object" && valor !== null && !Array.isArray(valor);
}

function limpiarTextoOpcional(valor: string | null | undefined) {
  if (!valor) {
    return null;
  }

  const texto = valor.trim();
  return texto.length ? texto : null;
}

function obtenerTextoAtributo(
  atributos: Record<string, unknown> | null,
  clave: string,
) {
  const valor = atributos?.[clave];
  return typeof valor === "string" && valor.trim().length ? valor.trim() : null;
}

function obtenerNumeroAtributo(
  atributos: Record<string, unknown> | null,
  clave: string,
) {
  const valor = atributos?.[clave];

  if (typeof valor === "number" && Number.isFinite(valor)) {
    return valor;
  }

  if (typeof valor === "string" && valor.trim().length) {
    const numero = Number(valor);
    return Number.isFinite(numero) ? numero : null;
  }

  return null;
}

function obtenerBooleanoAtributo(
  atributos: Record<string, unknown> | null,
  clave: string,
) {
  const valor = atributos?.[clave];

  if (typeof valor === "boolean") {
    return valor;
  }

  if (typeof valor === "string") {
    const texto = valor.trim().toLowerCase();

    if (texto === "true") {
      return true;
    }

    if (texto === "false") {
      return false;
    }
  }

  return null;
}

function ordenarPagosMasRecientes(
  pagos: readonly FilaPagoSupabase[],
) {
  return [...pagos].sort(
    (pagoA, pagoB) =>
      new Date(pagoB.creado_en).getTime() - new Date(pagoA.creado_en).getTime(),
  );
}

function mapearPagoPedidoAdmin(
  pago: FilaPagoSupabase | null,
): PagoPedidoAdmin {
  if (!pago) {
    return {
      id: "",
      estado: "sin-pago",
      proveedor: null,
      intento: null,
      referenciaExterna: null,
      creadoEnISO: null,
      pagadoEnISO: null,
      fallidoEnISO: null,
      ultimoError: null,
    };
  }

  const estado = pago.estado as EstadoPagoAdminPedido;

  return {
    id: pago.id,
    estado,
    proveedor: limpiarTextoOpcional(pago.proveedor),
    intento: pago.intento ?? null,
    referenciaExterna: limpiarTextoOpcional(pago.referencia_externa),
    creadoEnISO: pago.creado_en,
    pagadoEnISO: pago.pagado_en,
    fallidoEnISO: pago.fallido_en,
    ultimoError: limpiarTextoOpcional(pago.ultimo_error),
  };
}

function mapearDireccionPedidoAdmin(
  fila: FilaDireccionPedidoSupabase | null,
): DireccionPedidoAdmin | null {
  if (!fila) {
    return null;
  }

  return {
    nombreDestinatario: fila.nombre_destinatario,
    apellidoDestinatario: fila.apellido_destinatario,
    telefonoDestinatario: limpiarTextoOpcional(fila.telefono_destinatario),
    region: fila.region,
    comuna: fila.comuna,
    calle: fila.calle,
    numero: fila.numero,
    departamento: limpiarTextoOpcional(fila.departamento),
    referencias: limpiarTextoOpcional(fila.referencias),
    codigoPostal: limpiarTextoOpcional(fila.codigo_postal),
  };
}

function mapearItemPedidoAdmin(
  fila: FilaItemPedidoSupabase,
): ItemPedidoAdmin {
  const atributos = esRegistro(fila.atributos_snapshot) ? fila.atributos_snapshot : null;
  const nombreCompletoProducto =
    obtenerTextoAtributo(atributos, "nombreCompletoProducto") ??
    obtenerTextoAtributo(atributos, "nombreCompleto") ??
    fila.nombre_producto_snapshot;
  const nombreProducto =
    obtenerTextoAtributo(atributos, "nombreProducto") ??
    fila.nombre_producto_snapshot;

  return {
    id: fila.id,
    skuSnapshot: limpiarTextoOpcional(fila.sku_snapshot),
    nombreProducto,
    nombreCompletoProducto,
    descripcionProducto: limpiarTextoOpcional(fila.descripcion_producto_snapshot),
    marcaProducto:
      obtenerTextoAtributo(atributos, "marcaProducto") ??
      obtenerTextoAtributo(atributos, "marca"),
    tipoProducto:
      obtenerTextoAtributo(atributos, "tipoProducto") ??
      obtenerTextoAtributo(atributos, "tipoProductoLegacy"),
    categoriaProducto:
      obtenerTextoAtributo(atributos, "categoriaProducto") ??
      obtenerTextoAtributo(atributos, "categoria"),
    subcategoriaProducto:
      obtenerTextoAtributo(atributos, "subcategoriaProducto") ??
      obtenerTextoAtributo(atributos, "subcategoria"),
    nivelProducto:
      obtenerTextoAtributo(atributos, "nivelProducto") ??
      obtenerTextoAtributo(atributos, "nivel"),
    coleccionProducto:
      obtenerTextoAtributo(atributos, "coleccionProducto") ??
      obtenerTextoAtributo(atributos, "coleccion"),
    formato: obtenerTextoAtributo(atributos, "formato"),
    pesoKg: obtenerNumeroAtributo(atributos, "pesoKg"),
    acabado: obtenerTextoAtributo(atributos, "acabado"),
    efecto: obtenerTextoAtributo(atributos, "efecto"),
    colorHex: obtenerTextoAtributo(atributos, "colorHex"),
    compatiblePLA: obtenerBooleanoAtributo(atributos, "compatiblePLA"),
    cantidad: fila.cantidad,
    precioUnitarioCLP: fila.precio_unitario_iva_incluido,
    subtotalCLP: fila.subtotal_linea_iva_incluido,
  };
}

function mapearResumenPedidoAdmin(
  fila: FilaPedidoListadoSupabase,
): ResumenPedidoAdmin {
  const estado = extraerRelacionSimple(fila.estado);
  const direccion = extraerRelacionSimple(fila.direccion);
  const pagosOrdenados = ordenarPagosMasRecientes(fila.pagos ?? []);
  const pagoActual = mapearPagoPedidoAdmin(pagosOrdenados[0] ?? null);

  return {
    id: fila.id,
    numeroPedido: fila.numero_pedido,
    creadoEnISO: fila.creado_en,
    actualizadoEnISO: fila.actualizado_en,
    estadoId: estado?.id ?? "",
    estadoCodigo: limpiarTextoOpcional(estado?.codigo) ?? "desconocido",
    estadoNombre: limpiarTextoOpcional(estado?.nombre) ?? "Sin estado",
    totalIvaIncluido: fila.total_iva_incluido,
    monedaCodigo: fila.moneda_codigo,
    nombreCliente: fila.nombre_cliente_snapshot,
    apellidoCliente: fila.apellido_cliente_snapshot,
    correoCliente: fila.correo_cliente_snapshot,
    telefonoCliente: limpiarTextoOpcional(fila.telefono_cliente_snapshot),
    region: limpiarTextoOpcional(direccion?.region ?? null),
    comuna: limpiarTextoOpcional(direccion?.comuna ?? null),
    totalItems: (fila.items ?? []).length,
    pagoActual,
  };
}

function construirHistorialPedidoAdmin(
  pedido: FilaPedidoDetalleSupabase,
  pagos: readonly PagoPedidoAdmin[],
): readonly EventoHistorialPedidoAdmin[] {
  const eventos: EventoHistorialPedidoAdmin[] = [
    {
      id: `pedido-${pedido.id}-creado`,
      fechaISO: pedido.creado_en,
      titulo: "Pedido registrado",
      descripcion: `El pedido ${pedido.numero_pedido} quedo creado en el ecommerce.`,
      tono: "base",
    },
  ];

  pagos.forEach((pago) => {
    if (!pago.creadoEnISO) {
      return;
    }

    eventos.push({
      id: `pago-${pago.id}-creado`,
      fechaISO: pago.creadoEnISO,
      titulo: `Intento de pago ${pago.intento ?? "-"}`,
      descripcion:
        pago.estado === "pendiente"
          ? "Se registro una intencion de pago pendiente de confirmacion."
          : pago.estado === "pagado"
            ? "Se registro un intento de pago que luego fue confirmado."
            : "Se registro un intento de pago que no logro confirmarse.",
      tono: pago.estado === "fallido" ? "alerta" : pago.estado === "pagado" ? "exito" : "base",
    });

    if (pago.pagadoEnISO) {
      eventos.push({
        id: `pago-${pago.id}-pagado`,
        fechaISO: pago.pagadoEnISO,
        titulo: "Pago confirmado",
        descripcion: "La pasarela confirmo correctamente el pago del pedido.",
        tono: "exito",
      });
    }

    if (pago.fallidoEnISO) {
      eventos.push({
        id: `pago-${pago.id}-fallido`,
        fechaISO: pago.fallidoEnISO,
        titulo: "Pago no confirmado",
        descripcion:
          pago.ultimoError ??
          "El intento de pago fue rechazado, cancelado o no pudo confirmarse.",
        tono: "alerta",
      });
    }
  });

  if (pedido.actualizado_en !== pedido.creado_en) {
    const estado = extraerRelacionSimple(pedido.estado);

    eventos.push({
      id: `pedido-${pedido.id}-actualizado`,
      fechaISO: pedido.actualizado_en,
      titulo: "Ultima actualizacion del pedido",
      descripcion: `Estado actual: ${limpiarTextoOpcional(estado?.nombre) ?? "Sin estado"}.`,
      tono:
        limpiarTextoOpcional(estado?.codigo) === "pagado"
          ? "exito"
          : limpiarTextoOpcional(estado?.codigo) === "pago-fallido"
            ? "alerta"
            : "base",
    });
  }

  return eventos.sort(
    (eventoA, eventoB) =>
      new Date(eventoB.fechaISO).getTime() - new Date(eventoA.fechaISO).getTime(),
  );
}

export async function listarEstadosPedidoAdmin(): Promise<readonly EstadoPedidoAdmin[]> {
  const cliente = crearClienteSupabaseServidorServicio();
  const { data, error } = await cliente
    .from("estado_entidad")
    .select("id, codigo, nombre")
    .eq("entidad_objetivo", "pedido")
    .eq("esta_activo", true)
    .order("orden_visual", { ascending: true })
    .order("nombre", { ascending: true });

  if (error) {
    throw new Error(
      `No pudimos obtener los estados de pedido para admin: ${error.message}`,
    );
  }

  return ((data ?? []) as readonly EstadoPedidoAdmin[]).map((estado) => ({
    id: estado.id,
    codigo: estado.codigo,
    nombre: estado.nombre,
  }));
}

export async function listarPedidosAdmin(): Promise<readonly ResumenPedidoAdmin[]> {
  const cliente = crearClienteSupabaseServidorServicio();
  const { data, error } = await cliente
    .from("pedido")
    .select(seleccionListadoPedidosAdmin)
    .order("creado_en", { ascending: false });

  if (error) {
    throw new Error(`No pudimos cargar los pedidos para admin: ${error.message}`);
  }

  return ((data ?? []) as unknown as readonly FilaPedidoListadoSupabase[]).map((fila) =>
    mapearResumenPedidoAdmin(fila),
  );
}

export async function obtenerVistaAdminPedidos(): Promise<VistaAdminPedidos> {
  const [pedidos, estadosPedido] = await Promise.all([
    listarPedidosAdmin(),
    listarEstadosPedidoAdmin(),
  ]);

  return {
    pedidos,
    estadosPedido,
  };
}

export async function obtenerDetallePedidoAdmin(
  pedidoId: string,
): Promise<DetallePedidoAdmin | null> {
  const cliente = crearClienteSupabaseServidorServicio();
  const { data, error } = await cliente
    .from("pedido")
    .select(seleccionDetallePedidoAdmin)
    .eq("id", pedidoId)
    .maybeSingle();

  if (error) {
    throw new Error(`No pudimos cargar el detalle del pedido: ${error.message}`);
  }

  if (!data) {
    return null;
  }

  const fila = data as unknown as FilaPedidoDetalleSupabase;
  const resumen = mapearResumenPedidoAdmin(fila);
  const pagos = ordenarPagosMasRecientes(fila.pagos ?? []).map((pago) =>
    mapearPagoPedidoAdmin(pago),
  );
  const direccion = mapearDireccionPedidoAdmin(extraerRelacionSimple(fila.direccion));
  const items = (fila.items ?? []).map((item) => mapearItemPedidoAdmin(item));
  const resumenPago = await obtenerResumenPagoPedido(pedidoId);

  return {
    ...resumen,
    subtotalIvaIncluido: fila.subtotal_iva_incluido,
    descuentoIvaIncluido: fila.descuento_iva_incluido,
    costoEnvioIvaIncluido: fila.costo_envio_iva_incluido,
    observacionesCliente: limpiarTextoOpcional(fila.observaciones_cliente),
    direccion,
    items,
    pagos,
    historial: construirHistorialPedidoAdmin(fila, pagos),
    mensajeEstadoPago: resumenPago?.mensajeEstado ?? null,
  };
}
