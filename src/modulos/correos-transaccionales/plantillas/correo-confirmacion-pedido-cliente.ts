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
  escaparHtml,
  formatearFechaPedido,
} from "../utilidades/correos-html";

export function construirCorreoConfirmacionPedidoCliente(
  pedido: PedidoCorreoTransaccional,
): CorreoTransaccionalPreparado {
  const nombreCliente = pedido.datosCliente.nombreCompleto || "cliente";
  const direccionDespacho = [
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
      Hola ${escaparHtml(nombreCliente)}, registramos correctamente tu pedido y ya quedo respaldado en Rekun LAB.
    </p>
    ${construirTablaDetallesCorreo([
      { etiqueta: "Pedido", valor: pedido.numeroPedido },
      { etiqueta: "Fecha", valor: formatearFechaPedido(pedido.fechaISO) },
      { etiqueta: "Correo", valor: pedido.datosCliente.correo },
      {
        etiqueta: "Despacho",
        valor: direccionDespacho || "Direccion de envio no disponible",
      },
    ])}
    <div style="height: 24px; line-height: 24px;">&nbsp;</div>
    ${construirTablaItemsCorreo(pedido.items)}
    ${construirResumenPedidoCorreo(pedido)}
    <p style="margin: 24px 0 0; font-size: 14px; line-height: 1.8; color: #51635d;">
      Este correo confirma la recepcion de tu pedido. Si respondes este mensaje, tu consulta quedara asociada a la atencion del pedido.
    </p>
  `;

  return {
    asunto: `Confirmacion de pedido ${pedido.numeroPedido} | Rekun LAB`,
    destinatarios: [pedido.datosCliente.correo],
    html: construirMarcoCorreoHtml(
      "Tu pedido ya fue registrado",
      "Gracias por comprar en Rekun LAB. Aqui tienes el respaldo de tu pedido con sus productos y montos.",
      contenido,
    ),
    texto: [
      "Tu pedido ya fue registrado en Rekun LAB.",
      "",
      construirTextoPlanoPedido(pedido),
    ].join("\n"),
  };
}
