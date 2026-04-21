import type {
  ResultadoCrearPedido,
  SolicitudCrearPedido,
} from "@/modulos/pedidos";
import type { PedidoCorreoTransaccional } from "../tipos/correos-transaccionales";

type PropiedadesConstruccionPedidoCorreo = Readonly<{
  solicitud: SolicitudCrearPedido;
  resultado: ResultadoCrearPedido;
}>;

function limpiarTextoOpcional(valor: string | null | undefined) {
  if (!valor) {
    return "";
  }

  const texto = valor.trim();
  return texto.length ? texto : "";
}

export function construirPedidoCorreoTransaccionalDesdeSolicitud({
  solicitud,
  resultado,
}: PropiedadesConstruccionPedidoCorreo): PedidoCorreoTransaccional {
  return {
    pedidoId: resultado.pedidoId,
    numeroPedido: resultado.numeroPedido,
    fechaISO: new Date().toISOString(),
    subtotalCLP: resultado.subtotalIvaIncluido,
    totalCLP: resultado.totalIvaIncluido,
    datosCliente: {
      nombreCompleto: `${solicitud.datosCliente.nombre} ${solicitud.datosCliente.apellido}`.trim(),
      correo: solicitud.datosCliente.correo,
      telefono: limpiarTextoOpcional(solicitud.datosCliente.telefono),
    },
    direccionDespacho: {
      region: limpiarTextoOpcional(solicitud.direccionDespacho.region),
      comuna: limpiarTextoOpcional(solicitud.direccionDespacho.comuna),
      calle: limpiarTextoOpcional(solicitud.direccionDespacho.calle),
      numero: limpiarTextoOpcional(solicitud.direccionDespacho.numero),
      departamento: limpiarTextoOpcional(solicitud.direccionDespacho.departamento),
      referencias: limpiarTextoOpcional(solicitud.direccionDespacho.referencias),
      codigoPostal: limpiarTextoOpcional(solicitud.direccionDespacho.codigoPostal),
    },
    items: solicitud.items.map((item) => ({
      nombreProducto: item.nombre,
      nombreCompleto: item.nombreCompleto?.trim() || item.nombre,
      marca: item.marca?.trim() || "Sin marca",
      tipoProducto: item.tipoProducto.trim() || "Producto",
      precioUnitarioCLP: item.precioUnitarioIvaIncluidoSnapshot,
      cantidad: item.cantidad,
      subtotalCLP: item.precioUnitarioIvaIncluidoSnapshot * item.cantidad,
    })),
  };
}
