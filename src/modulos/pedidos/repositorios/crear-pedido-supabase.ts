import "server-only";

import { crearClienteSupabaseServidorServicio } from "@/compartido/servicios/supabase/index-servidor";
import { exigirRespuestaSupabase } from "@/compartido/servicios/supabase";
import type {
  ItemCrearPedido,
  ResultadoCrearPedido,
  SolicitudCrearPedido,
} from "../tipos/crear-pedido";

type PayloadRpcCrearPedido = Readonly<{
  datosCliente: SolicitudCrearPedido["datosCliente"];
  direccionDespacho: SolicitudCrearPedido["direccionDespacho"];
  items: readonly Readonly<{
    slug: string;
    nombre: string;
    resumen: string;
    cantidad: number;
    precioUnitarioIvaIncluidoSnapshot: number;
    codigoReferenciaVariante: string | null;
    skuSnapshot: string | null;
    atributosSnapshot: Record<string, unknown>;
  }>[];
}>;

function construirAtributosSnapshotItem(item: ItemCrearPedido): Record<string, unknown> {
  return {
    categoria: item.categoria,
    tipoProducto: item.tipoProducto,
    coleccion: item.coleccion ?? null,
    etiquetasComerciales: item.etiquetasComerciales ?? [],
    variante: item.variante
      ? {
          etiqueta: item.variante.etiqueta,
          codigoReferencia: item.variante.codigoReferencia,
          selecciones: item.variante.selecciones,
        }
      : null,
  };
}

function construirPayloadRpc(solicitud: SolicitudCrearPedido): PayloadRpcCrearPedido {
  return {
    datosCliente: solicitud.datosCliente,
    direccionDespacho: solicitud.direccionDespacho,
    items: solicitud.items.map((item) => ({
      slug: item.slug,
      nombre: item.nombre,
      resumen: item.resumen,
      cantidad: item.cantidad,
      precioUnitarioIvaIncluidoSnapshot: item.precioUnitarioIvaIncluidoSnapshot,
      codigoReferenciaVariante: item.variante?.codigoReferencia ?? null,
      skuSnapshot: item.variante?.codigoReferencia ?? null,
      atributosSnapshot: construirAtributosSnapshotItem(item),
    })),
  };
}

type ResultadoRpcCrearPedido = Readonly<{
  pedido_id: string;
  numero_pedido: string;
  subtotal_iva_incluido: number;
  total_iva_incluido: number;
}>;

export async function crearPedidoDesdeCheckoutSupabase(
  solicitud: SolicitudCrearPedido,
): Promise<ResultadoCrearPedido> {
  const cliente = crearClienteSupabaseServidorServicio();
  const payload = construirPayloadRpc(solicitud);

  const respuesta = await cliente.rpc("crear_pedido_desde_checkout", {
    p_solicitud: payload,
  });

  const data = exigirRespuestaSupabase(
    respuesta,
    "crear_pedido_desde_checkout",
  ) as unknown as readonly ResultadoRpcCrearPedido[];

  const resultado = data[0];

  if (!resultado) {
    throw new Error(
      "Supabase no devolvio datos al crear el pedido. Revisa la funcion RPC.",
    );
  }

  return {
    pedidoId: resultado.pedido_id,
    numeroPedido: resultado.numero_pedido,
    subtotalIvaIncluido: resultado.subtotal_iva_incluido,
    totalIvaIncluido: resultado.total_iva_incluido,
  };
}

