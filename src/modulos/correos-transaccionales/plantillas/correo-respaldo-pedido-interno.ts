import type {
  CorreoTransaccionalPreparado,
  PedidoCorreoTransaccional,
} from "../tipos/correos-transaccionales";
import {
  construirMarcoCorreoHtml,
  construirResumenPedidoCorreo,
  construirTablaDetallesCorreo,
  construirTablaItemsCorreo,
  construirTextoPlanoPedido,
  formatearFechaPedido,
} from "../utilidades/correos-html";

export function construirCorreoRespaldoPedidoInterno(
  pedido: PedidoCorreoTransaccional,
  correoInterno: string,
): CorreoTransaccionalPreparado {
  const direccion = [
    `${pedido.direccionDespacho.calle} ${pedido.direccionDespacho.numero}`.trim(),
    pedido.direccionDespacho.departamento || null,
    [pedido.direccionDespacho.comuna, pedido.direccionDespacho.region]
      .filter(Boolean)
      .join(", "),
    pedido.direccionDespacho.codigoPostal || null,
  ]
    .filter(Boolean)
    .join(", ");

  const contenido = `
    <p style="margin: 0 0 18px; font-size: 16px; line-height: 1.8; color: #34433f;">
      Se registro un nuevo pedido en el ecommerce de Rekun LAB y este correo deja respaldo interno para operacion.
    </p>
    ${construirTablaDetallesCorreo([
      { etiqueta: "Pedido", valor: pedido.numeroPedido },
      { etiqueta: "Fecha", valor: formatearFechaPedido(pedido.fechaISO) },
      { etiqueta: "Cliente", valor: pedido.datosCliente.nombreCompleto },
      { etiqueta: "Correo", valor: pedido.datosCliente.correo },
      {
        etiqueta: "Telefono",
        valor: pedido.datosCliente.telefono || "No informado",
      },
      {
        etiqueta: "Despacho",
        valor: direccion || "No informado",
      },
      {
        etiqueta: "Referencias",
        valor: pedido.direccionDespacho.referencias || "Sin referencias",
      },
    ])}
    <div style="height: 24px; line-height: 24px;">&nbsp;</div>
    ${construirTablaItemsCorreo(pedido.items)}
    ${construirResumenPedidoCorreo(pedido)}
  `;

  return {
    asunto: `Nuevo pedido ${pedido.numeroPedido} | Respaldo interno Rekun LAB`,
    destinatarios: [correoInterno],
    html: construirMarcoCorreoHtml(
      "Nuevo pedido registrado",
      "Respaldo interno del pedido creado en el ecommerce para seguimiento operativo y comercial.",
      contenido,
    ),
    texto: [
      "Nuevo pedido registrado en Rekun LAB.",
      "",
      construirTextoPlanoPedido(pedido),
      "",
      `Despacho: ${direccion || "No informado"}`,
      pedido.direccionDespacho.referencias
        ? `Referencias: ${pedido.direccionDespacho.referencias}`
        : null,
    ]
      .filter(Boolean)
      .join("\n"),
  };
}
