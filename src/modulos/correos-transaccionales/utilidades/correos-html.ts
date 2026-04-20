import { formatearPrecioClp } from "@/compartido/utilidades/formatear-precio-clp";
import type {
  ItemPedidoCorreoTransaccional,
  PedidoCorreoTransaccional,
} from "../tipos/correos-transaccionales";

const formateadorFechaPedido = new Intl.DateTimeFormat("es-CL", {
  dateStyle: "full",
  timeStyle: "short",
  timeZone: "America/Santiago",
});

export function escaparHtml(valor: string) {
  return valor
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function formatearFechaPedido(fechaISO: string) {
  return formateadorFechaPedido.format(new Date(fechaISO));
}

function construirFilasTablaItems(
  items: readonly ItemPedidoCorreoTransaccional[],
) {
  return items
    .map(
      (item) => `
        <tr>
          <td style="padding: 14px 12px; border-bottom: 1px solid #d8e1dc; vertical-align: top;">
            <div style="font-weight: 700; color: #10231d;">${escaparHtml(item.nombreCompleto)}</div>
            <div style="margin-top: 4px; font-size: 12px; color: #51635d;">
              ${escaparHtml(item.nombreProducto)} · ${escaparHtml(item.marca)} · ${escaparHtml(item.tipoProducto)}
            </div>
          </td>
          <td style="padding: 14px 12px; border-bottom: 1px solid #d8e1dc; text-align: center; color: #10231d;">${item.cantidad}</td>
          <td style="padding: 14px 12px; border-bottom: 1px solid #d8e1dc; text-align: right; color: #10231d;">${formatearPrecioClp(item.precioUnitarioCLP)}</td>
          <td style="padding: 14px 12px; border-bottom: 1px solid #d8e1dc; text-align: right; color: #10231d; font-weight: 700;">${formatearPrecioClp(item.subtotalCLP)}</td>
        </tr>
      `,
    )
    .join("");
}

export function construirTablaItemsCorreo(
  items: readonly ItemPedidoCorreoTransaccional[],
) {
  return `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse: collapse; background: #ffffff; border: 1px solid #d8e1dc; border-radius: 18px; overflow: hidden;">
      <thead>
        <tr style="background: #f3f6f4;">
          <th style="padding: 14px 12px; text-align: left; font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; color: #51635d;">Producto</th>
          <th style="padding: 14px 12px; text-align: center; font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; color: #51635d;">Cant.</th>
          <th style="padding: 14px 12px; text-align: right; font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; color: #51635d;">Unitario</th>
          <th style="padding: 14px 12px; text-align: right; font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; color: #51635d;">Subtotal</th>
        </tr>
      </thead>
      <tbody>
        ${construirFilasTablaItems(items)}
      </tbody>
    </table>
  `;
}

export function construirResumenPedidoCorreo(pedido: PedidoCorreoTransaccional) {
  return `
    <div style="margin-top: 24px; border: 1px solid #d8e1dc; border-radius: 18px; background: #ffffff; padding: 20px;">
      <div style="font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; color: #51635d;">Resumen del pedido</div>
      <div style="margin-top: 16px; display: grid; gap: 12px;">
        <div style="display: flex; justify-content: space-between; gap: 16px; color: #10231d;">
          <span>Subtotal</span>
          <strong>${formatearPrecioClp(pedido.subtotalCLP)}</strong>
        </div>
        <div style="display: flex; justify-content: space-between; gap: 16px; color: #10231d; font-size: 18px;">
          <span>Total</span>
          <strong>${formatearPrecioClp(pedido.totalCLP)}</strong>
        </div>
        <div style="font-size: 12px; color: #51635d;">Precios con IVA incluido.</div>
      </div>
    </div>
  `;
}

export function construirMarcoCorreoHtml(
  titulo: string,
  subtitulo: string,
  contenido: string,
) {
  return `
    <!DOCTYPE html>
    <html lang="es">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${escaparHtml(titulo)}</title>
      </head>
      <body style="margin: 0; padding: 32px 16px; background: #edf3ef; font-family: Arial, Helvetica, sans-serif; color: #10231d;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 760px; margin: 0 auto;">
          <tr>
            <td>
              <div style="margin-bottom: 18px; color: #0d7c66; font-size: 12px; letter-spacing: 0.24em; text-transform: uppercase; font-weight: 700;">Rekun LAB</div>
              <div style="background: linear-gradient(180deg, #ffffff, #f6faf7); border: 1px solid #d8e1dc; border-radius: 28px; overflow: hidden;">
                <div style="padding: 32px; background: linear-gradient(135deg, #0f332a, #184c40); color: #ffffff;">
                  <div style="font-size: 12px; letter-spacing: 0.2em; text-transform: uppercase; opacity: 0.78;">Ecommerce Rekun LAB</div>
                  <h1 style="margin: 14px 0 0; font-size: 34px; line-height: 1.1;">${escaparHtml(titulo)}</h1>
                  <p style="margin: 14px 0 0; max-width: 560px; font-size: 16px; line-height: 1.75; color: rgba(255,255,255,0.82);">${escaparHtml(subtitulo)}</p>
                </div>
                <div style="padding: 32px;">
                  ${contenido}
                </div>
              </div>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}

export function construirTextoPlanoPedido(pedido: PedidoCorreoTransaccional) {
  const encabezado = [
    `Pedido: ${pedido.numeroPedido}`,
    `Fecha: ${formatearFechaPedido(pedido.fechaISO)}`,
    `Cliente: ${pedido.datosCliente.nombreCompleto}`,
    `Correo: ${pedido.datosCliente.correo}`,
    `Telefono: ${pedido.datosCliente.telefono || "No informado"}`,
    "",
    "Items:",
  ];

  const lineasItems = pedido.items.map(
    (item) =>
      `- ${item.nombreCompleto} | ${item.marca} | ${item.tipoProducto} | ${item.cantidad} x ${formatearPrecioClp(item.precioUnitarioCLP)} = ${formatearPrecioClp(item.subtotalCLP)}`,
  );

  const pie = [
    "",
    `Subtotal: ${formatearPrecioClp(pedido.subtotalCLP)}`,
    `Total: ${formatearPrecioClp(pedido.totalCLP)}`,
  ];

  return [...encabezado, ...lineasItems, ...pie].join("\n");
}
