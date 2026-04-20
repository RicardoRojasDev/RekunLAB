import type {
  CorreoTransaccionalPreparado,
  PedidoCorreoTransaccional,
} from "../tipos/correos-transaccionales";
import {
  construirMarcoCorreoHtml,
  construirResumenPedidoCorreo,
  construirTablaItemsCorreo,
  construirTextoPlanoPedido,
  escaparHtml,
  formatearFechaPedido,
} from "../utilidades/correos-html";

export function construirCorreoRespaldoPedidoInterno(
  pedido: PedidoCorreoTransaccional,
  correoInterno: string,
): CorreoTransaccionalPreparado {
  const direccion = [
    `${pedido.direccionDespacho.calle} ${pedido.direccionDespacho.numero}`,
    pedido.direccionDespacho.departamento || null,
    `${pedido.direccionDespacho.comuna}, ${pedido.direccionDespacho.region}`,
    pedido.direccionDespacho.codigoPostal || null,
  ]
    .filter(Boolean)
    .join(", ");

  const contenido = `
    <p style="margin: 0 0 18px; font-size: 16px; line-height: 1.8; color: #34433f;">
      Se registro un nuevo pedido en el ecommerce de Rekun LAB y este correo deja respaldo interno para operacion.
    </p>
    <div style="margin-bottom: 24px; border: 1px solid #d8e1dc; border-radius: 18px; background: #f7faf8; padding: 20px;">
      <div style="display: grid; gap: 10px; font-size: 14px; color: #34433f;">
        <div><strong>Pedido:</strong> ${escaparHtml(pedido.numeroPedido)}</div>
        <div><strong>Fecha:</strong> ${escaparHtml(formatearFechaPedido(pedido.fechaISO))}</div>
        <div><strong>Cliente:</strong> ${escaparHtml(pedido.datosCliente.nombreCompleto)}</div>
        <div><strong>Correo:</strong> ${escaparHtml(pedido.datosCliente.correo)}</div>
        <div><strong>Telefono:</strong> ${escaparHtml(pedido.datosCliente.telefono || "No informado")}</div>
        <div><strong>Despacho:</strong> ${escaparHtml(direccion || "No informado")}</div>
        ${
          pedido.direccionDespacho.referencias
            ? `<div><strong>Referencias:</strong> ${escaparHtml(pedido.direccionDespacho.referencias)}</div>`
            : ""
        }
      </div>
    </div>
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
