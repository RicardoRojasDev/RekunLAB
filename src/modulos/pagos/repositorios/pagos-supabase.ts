import "server-only";

import { crearClienteSupabaseServidorServicio } from "@/compartido/servicios/supabase/index-servidor";
import { exigirRespuestaSupabase } from "@/compartido/servicios/supabase";
import type { EstadoPago, ProveedorPago, ResumenPagoPedido } from "../tipos/pagos";

type RelacionSimple<T> = T | readonly T[] | null;

type FilaPedidoSupabase = Readonly<{
  id: string;
  numero_pedido: string;
  creado_en: string;
  total_iva_incluido: number;
  moneda_codigo: string;
  nombre_cliente_snapshot: string;
  apellido_cliente_snapshot: string;
  correo_cliente_snapshot: string;
  estado: RelacionSimple<Readonly<{ codigo: string | null }>>;
}>;

type FilaPagoSupabase = Readonly<{
  id: string;
  pedido_id: string;
  proveedor: string;
  estado: EstadoPago;
  intento: number;
  referencia_externa: string;
  session_id_pasarela: string;
  token_pasarela: string | null;
  url_redireccion: string | null;
  monto: number;
  moneda_codigo: string;
  codigo_autorizacion: string | null;
  codigo_respuesta: string | null;
  tipo_pago: string | null;
  cuotas: number | null;
  tarjeta_ultimos_digitos: string | null;
  payload_creacion: Record<string, unknown>;
  payload_confirmacion: Record<string, unknown> | null;
  ultimo_error: string | null;
  pagado_en: string | null;
  fallido_en: string | null;
  creado_en: string;
}>;

export type PedidoParaPago = Readonly<{
  id: string;
  numeroPedido: string;
  creadoEnISO: string;
  totalIvaIncluido: number;
  monedaCodigo: string;
  estadoPedido: string;
  nombreClienteSnapshot: string;
  apellidoClienteSnapshot: string;
  correoClienteSnapshot: string;
}>;

export type PagoRegistrado = Readonly<{
  id: string;
  pedidoId: string;
  proveedor: ProveedorPago;
  estado: EstadoPago;
  intento: number;
  referenciaExterna: string;
  sessionIdPasarela: string;
  tokenPasarela: string | null;
  urlRedireccion: string | null;
  monto: number;
  monedaCodigo: string;
  codigoAutorizacion: string | null;
  codigoRespuesta: string | null;
  tipoPago: string | null;
  cuotas: number | null;
  tarjetaUltimosDigitos: string | null;
  payloadCreacion: Record<string, unknown>;
  payloadConfirmacion: Record<string, unknown> | null;
  ultimoError: string | null;
  pagadoEnISO: string | null;
  fallidoEnISO: string | null;
  creadoEnISO: string;
}>;

type DatosCrearPagoPendiente = Readonly<{
  pedidoId: string;
  proveedor: ProveedorPago;
  intento: number;
  referenciaExterna: string;
  sessionIdPasarela: string;
  monto: number;
  monedaCodigo: string;
  metadatos?: Record<string, unknown>;
}>;

type DatosActualizacionCreacionPago = Readonly<{
  pagoId: string;
  tokenPasarela: string;
  urlRedireccion: string;
  payloadCreacion: Record<string, unknown>;
}>;

type DatosPagoConfirmado = Readonly<{
  pagoId: string;
  codigoAutorizacion: string | null;
  codigoRespuesta: string | null;
  tipoPago: string | null;
  cuotas: number | null;
  tarjetaUltimosDigitos: string | null;
  payloadConfirmacion: Record<string, unknown>;
}>;

type DatosPagoFallido = Readonly<{
  pagoId: string;
  codigoRespuesta?: string | null;
  payloadConfirmacion?: Record<string, unknown> | null;
  ultimoError: string;
}>;

const cacheEstadosPedido = new Map<string, string>();

function extraerRelacionSimple<T>(valor: RelacionSimple<T>) {
  if (Array.isArray(valor)) {
    return valor[0] ?? null;
  }

  return valor ?? null;
}

function mapearFilaPedido(fila: FilaPedidoSupabase): PedidoParaPago {
  return {
    id: fila.id,
    numeroPedido: fila.numero_pedido,
    creadoEnISO: fila.creado_en,
    totalIvaIncluido: fila.total_iva_incluido,
    monedaCodigo: fila.moneda_codigo,
    estadoPedido: extraerRelacionSimple(fila.estado)?.codigo ?? "desconocido",
    nombreClienteSnapshot: fila.nombre_cliente_snapshot,
    apellidoClienteSnapshot: fila.apellido_cliente_snapshot,
    correoClienteSnapshot: fila.correo_cliente_snapshot,
  };
}

function mapearFilaPago(fila: FilaPagoSupabase): PagoRegistrado {
  return {
    id: fila.id,
    pedidoId: fila.pedido_id,
    proveedor: fila.proveedor as ProveedorPago,
    estado: fila.estado,
    intento: fila.intento,
    referenciaExterna: fila.referencia_externa,
    sessionIdPasarela: fila.session_id_pasarela,
    tokenPasarela: fila.token_pasarela,
    urlRedireccion: fila.url_redireccion,
    monto: fila.monto,
    monedaCodigo: fila.moneda_codigo,
    codigoAutorizacion: fila.codigo_autorizacion,
    codigoRespuesta: fila.codigo_respuesta,
    tipoPago: fila.tipo_pago,
    cuotas: fila.cuotas,
    tarjetaUltimosDigitos: fila.tarjeta_ultimos_digitos,
    payloadCreacion: fila.payload_creacion ?? {},
    payloadConfirmacion: fila.payload_confirmacion,
    ultimoError: fila.ultimo_error,
    pagadoEnISO: fila.pagado_en,
    fallidoEnISO: fila.fallido_en,
    creadoEnISO: fila.creado_en,
  };
}

async function resolverEstadoPedidoIdPorCodigo(codigo: string) {
  const existente = cacheEstadosPedido.get(codigo);

  if (existente) {
    return existente;
  }

  const cliente = crearClienteSupabaseServidorServicio();
  const respuesta = await cliente
    .from("estado_entidad")
    .select("id")
    .eq("entidad_objetivo", "pedido")
    .eq("codigo", codigo)
    .maybeSingle();

  const data = exigirRespuestaSupabase(
    respuesta,
    `resolverEstadoPedidoIdPorCodigo:${codigo}`,
  ) as { id?: string } | null;

  if (!data?.id) {
    throw new Error(`No existe un estado de pedido configurado con codigo ${codigo}.`);
  }

  cacheEstadosPedido.set(codigo, data.id);

  return data.id;
}

export async function obtenerPedidoParaPagoPorId(
  pedidoId: string,
): Promise<PedidoParaPago | null> {
  const cliente = crearClienteSupabaseServidorServicio();
  const respuesta = await cliente
    .from("pedido")
    .select(
      `
        id,
        numero_pedido,
        creado_en,
        total_iva_incluido,
        moneda_codigo,
        nombre_cliente_snapshot,
        apellido_cliente_snapshot,
        correo_cliente_snapshot,
        estado:estado_entidad(codigo)
      `,
    )
    .eq("id", pedidoId)
    .maybeSingle();

  if (respuesta.error) {
    throw new Error(
      `Error al buscar pedido para pago (${pedidoId}): ${respuesta.error.message}`,
    );
  }

  if (!respuesta.data) {
    return null;
  }

  return mapearFilaPedido(respuesta.data as unknown as FilaPedidoSupabase);
}

export async function listarPagosPedido(pedidoId: string): Promise<readonly PagoRegistrado[]> {
  const cliente = crearClienteSupabaseServidorServicio();
  const respuesta = await cliente
    .from("pago")
    .select("*")
    .eq("pedido_id", pedidoId)
    .order("intento", { ascending: false });

  const data = exigirRespuestaSupabase(
    respuesta,
    `listarPagosPedido:${pedidoId}`,
  ) as unknown as readonly FilaPagoSupabase[];

  return data.map((fila) => mapearFilaPago(fila));
}

export async function buscarPagoPorTokenPasarela(
  tokenPasarela: string,
): Promise<PagoRegistrado | null> {
  const cliente = crearClienteSupabaseServidorServicio();
  const respuesta = await cliente
    .from("pago")
    .select("*")
    .eq("token_pasarela", tokenPasarela)
    .maybeSingle();

  if (respuesta.error) {
    throw new Error(
      `Error al buscar pago por token de pasarela: ${respuesta.error.message}`,
    );
  }

  if (!respuesta.data) {
    return null;
  }

  return mapearFilaPago(respuesta.data as unknown as FilaPagoSupabase);
}

export async function buscarPagoPorReferenciaExterna(
  referenciaExterna: string,
): Promise<PagoRegistrado | null> {
  const cliente = crearClienteSupabaseServidorServicio();
  const respuesta = await cliente
    .from("pago")
    .select("*")
    .eq("referencia_externa", referenciaExterna)
    .maybeSingle();

  if (respuesta.error) {
    throw new Error(
      `Error al buscar pago por referencia externa: ${respuesta.error.message}`,
    );
  }

  if (!respuesta.data) {
    return null;
  }

  return mapearFilaPago(respuesta.data as unknown as FilaPagoSupabase);
}

export async function buscarPagoPorSessionYReferencia(
  sessionIdPasarela: string,
  referenciaExterna: string,
): Promise<PagoRegistrado | null> {
  const cliente = crearClienteSupabaseServidorServicio();
  const respuesta = await cliente
    .from("pago")
    .select("*")
    .eq("session_id_pasarela", sessionIdPasarela)
    .eq("referencia_externa", referenciaExterna)
    .maybeSingle();

  if (respuesta.error) {
    throw new Error(
      `Error al buscar pago por session y referencia: ${respuesta.error.message}`,
    );
  }

  if (!respuesta.data) {
    return null;
  }

  return mapearFilaPago(respuesta.data as unknown as FilaPagoSupabase);
}

export async function crearPagoPendiente(
  datos: DatosCrearPagoPendiente,
): Promise<PagoRegistrado> {
  const cliente = crearClienteSupabaseServidorServicio();
  const respuesta = await cliente
    .from("pago")
    .insert({
      pedido_id: datos.pedidoId,
      proveedor: datos.proveedor,
      estado: "pendiente",
      intento: datos.intento,
      referencia_externa: datos.referenciaExterna,
      session_id_pasarela: datos.sessionIdPasarela,
      monto: datos.monto,
      moneda_codigo: datos.monedaCodigo,
      metadatos: datos.metadatos ?? {},
    })
    .select("*")
    .single();

  const data = exigirRespuestaSupabase(
    respuesta,
    `crearPagoPendiente:${datos.pedidoId}`,
  ) as unknown as FilaPagoSupabase;

  return mapearFilaPago(data);
}

export async function actualizarCreacionPago(
  datos: DatosActualizacionCreacionPago,
): Promise<PagoRegistrado> {
  const cliente = crearClienteSupabaseServidorServicio();
  const respuesta = await cliente
    .from("pago")
    .update({
      token_pasarela: datos.tokenPasarela,
      url_redireccion: datos.urlRedireccion,
      payload_creacion: datos.payloadCreacion,
    })
    .eq("id", datos.pagoId)
    .select("*")
    .single();

  const data = exigirRespuestaSupabase(
    respuesta,
    `actualizarCreacionPago:${datos.pagoId}`,
  ) as unknown as FilaPagoSupabase;

  return mapearFilaPago(data);
}

export async function marcarPagoComoPagado(
  datos: DatosPagoConfirmado,
): Promise<PagoRegistrado> {
  const cliente = crearClienteSupabaseServidorServicio();
  const respuesta = await cliente
    .from("pago")
    .update({
      estado: "pagado",
      codigo_autorizacion: datos.codigoAutorizacion,
      codigo_respuesta: datos.codigoRespuesta,
      tipo_pago: datos.tipoPago,
      cuotas: datos.cuotas,
      tarjeta_ultimos_digitos: datos.tarjetaUltimosDigitos,
      payload_confirmacion: datos.payloadConfirmacion,
      ultimo_error: null,
      pagado_en: new Date().toISOString(),
      fallido_en: null,
    })
    .eq("id", datos.pagoId)
    .select("*")
    .single();

  const data = exigirRespuestaSupabase(
    respuesta,
    `marcarPagoComoPagado:${datos.pagoId}`,
  ) as unknown as FilaPagoSupabase;

  return mapearFilaPago(data);
}

export async function marcarPagoComoFallido(
  datos: DatosPagoFallido,
): Promise<PagoRegistrado> {
  const cliente = crearClienteSupabaseServidorServicio();
  const respuesta = await cliente
    .from("pago")
    .update({
      estado: "fallido",
      codigo_respuesta: datos.codigoRespuesta ?? null,
      payload_confirmacion: datos.payloadConfirmacion ?? null,
      ultimo_error: datos.ultimoError,
      fallido_en: new Date().toISOString(),
    })
    .eq("id", datos.pagoId)
    .select("*")
    .single();

  const data = exigirRespuestaSupabase(
    respuesta,
    `marcarPagoComoFallido:${datos.pagoId}`,
  ) as unknown as FilaPagoSupabase;

  return mapearFilaPago(data);
}

export async function actualizarEstadoPedidoPorCodigo(
  pedidoId: string,
  codigoEstado: string,
) {
  const estadoId = await resolverEstadoPedidoIdPorCodigo(codigoEstado);
  const cliente = crearClienteSupabaseServidorServicio();
  const respuesta = await cliente
    .from("pedido")
    .update({ estado_id: estadoId })
    .eq("id", pedidoId)
    .select("id")
    .single();

  exigirRespuestaSupabase(
    respuesta,
    `actualizarEstadoPedidoPorCodigo:${pedidoId}:${codigoEstado}`,
  );
}

export async function obtenerResumenPagoPedidoPorId(
  pedidoId: string,
): Promise<ResumenPagoPedido | null> {
  const pedido = await obtenerPedidoParaPagoPorId(pedidoId);

  if (!pedido) {
    return null;
  }

  const pagos = await listarPagosPedido(pedidoId);
  const ultimoPago = pagos[0] ?? null;

  const estadoPago = ultimoPago?.estado ?? "sin-pago";
  const permiteReintento =
    estadoPago === "fallido" || estadoPago === "sin-pago";

  const mensajeEstado =
    estadoPago === "pagado"
      ? "Tu pago fue confirmado correctamente y el pedido ya quedo marcado como pagado."
      : estadoPago === "pendiente"
        ? "Tu pago todavia esta pendiente de confirmacion. Si cerraste la ventana, vuelve a intentarlo desde aqui."
        : estadoPago === "fallido"
          ? "El pago no pudo confirmarse. Puedes reintentar sin volver a crear el pedido."
          : "El pedido fue registrado y todavia no tiene una intencion de pago activa.";

  return {
    pedidoId: pedido.id,
    numeroPedido: pedido.numeroPedido,
    fechaPedidoISO: pedido.creadoEnISO,
    estadoPedido: pedido.estadoPedido,
    totalIvaIncluido: pedido.totalIvaIncluido,
    monedaCodigo: pedido.monedaCodigo,
    mensajeEstado,
    pago: {
      id: ultimoPago?.id ?? null,
      proveedor: ultimoPago?.proveedor ?? null,
      estado: estadoPago,
      referenciaExterna: ultimoPago?.referenciaExterna ?? null,
      intento: ultimoPago?.intento ?? null,
      pagadoEnISO: ultimoPago?.pagadoEnISO ?? null,
      fallidoEnISO: ultimoPago?.fallidoEnISO ?? null,
      ultimoError: ultimoPago?.ultimoError ?? null,
      permiteReintento,
    },
  };
}
