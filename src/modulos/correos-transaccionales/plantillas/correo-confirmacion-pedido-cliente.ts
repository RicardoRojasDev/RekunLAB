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

export function construirCorreoConfirmacionPedidoCliente(
  pedido: PedidoCorreoTransaccional,
): CorreoTransaccionalPreparado {
  const contenido = `
    <p style="margin: 0 0 18px; font-size: 16px; line-height: 1.8; color: #34433f;">
      Hola ${escaparHtml(pedido.datosCliente.nombreCompleto)}, registramos correctamente tu pedido y ya quedo respaldado en Rekun LAB.
    </p>
    <div style="margin-bottom: 24px; border: 1px solid #d8e1dc; border-radius: 18px; background: #f7faf8; padding: 20px;">
      <div style="display: grid; gap: 10px; font-size: 14px; color: #34433f;">
        <div><strong>Pedido:</strong> ${escaparHtml(pedido.numeroPedido)}</div>
        <div><strong>Fecha:</strong> ${escaparHtml(formatearFechaPedido(pedido.fechaISO))}</div>
        <div><strong>Correo:</strong> ${escaparHtml(pedido.datosCliente.correo)}</div>
      </div>
    </div>
    ${construirTablaItemsCorreo(pedido.items)}
    ${construirResumenPedidoCorreo(pedido)}
    <p style="margin: 24px 0 0; font-size: 14px; line-height: 1.8; color: #51635d;">
      Este correo confirma la recepcion del pedido. El flujo de pago y confirmacion operativa continuara segun la etapa actual del ecommerce.
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
