import { formatearPrecioClp } from "@/compartido/utilidades/formatear-precio-clp";
import type {
  ItemPedidoCorreoTransaccional,
  PedidoCorreoTransaccional,
} from "../tipos/correos-transaccionales";

type DetalleCorreo = Readonly<{
  etiqueta: string;
  valor: string;
}>;

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

export function construirTablaDetallesCorreo(
  detalles: readonly DetalleCorreo[],
) {
  const filas = detalles
    .map(
      (detalle) => `
        <tr>
          <td style="padding: 0 0 10px; width: 132px; vertical-align: top; font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; color: #5e716a; font-weight: 700;">
            ${escaparHtml(detalle.etiqueta)}
          </td>
          <td style="padding: 0 0 10px; vertical-align: top; font-size: 14px; line-height: 1.7; color: #10231d;">
            ${escaparHtml(detalle.valor)}
          </td>
        </tr>
      `,
    )
    .join("");

  return `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse: collapse; border: 1px solid #d8e1dc; border-radius: 18px; background: #f7faf8;">
      <tr>
        <td style="padding: 20px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">
            ${filas}
          </table>
        </td>
      </tr>
    </table>
  `;
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
              ${escaparHtml(item.nombreProducto)} &middot; ${escaparHtml(item.marca)} &middot; ${escaparHtml(item.tipoProducto)}
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
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse: collapse; background: #ffffff; border: 1px solid #d8e1dc; border-radius: 18px;">
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
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top: 24px; border-collapse: collapse; border: 1px solid #d8e1dc; border-radius: 18px; background: #ffffff;">
      <tr>
        <td style="padding: 20px;">
          <div style="font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; color: #51635d;">Resumen del pedido</div>
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top: 16px; border-collapse: collapse;">
            <tr>
              <td style="padding: 0 0 12px; color: #10231d;">Subtotal</td>
              <td style="padding: 0 0 12px; text-align: right; color: #10231d; font-weight: 700;">${formatearPrecioClp(pedido.subtotalCLP)}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0 0; border-top: 1px solid #d8e1dc; color: #10231d; font-size: 18px; font-weight: 700;">Total</td>
              <td style="padding: 12px 0 0; border-top: 1px solid #d8e1dc; text-align: right; color: #10231d; font-size: 18px; font-weight: 700;">${formatearPrecioClp(pedido.totalCLP)}</td>
            </tr>
          </table>
          <div style="margin-top: 12px; font-size: 12px; color: #51635d;">Precios con IVA incluido.</div>
        </td>
      </tr>
    </table>
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
              <div style="background: #ffffff; border: 1px solid #d8e1dc; border-radius: 28px; overflow: hidden;">
                <div style="padding: 32px; background: #173d33; color: #ffffff;">
                  <div style="font-size: 12px; letter-spacing: 0.2em; text-transform: uppercase; opacity: 0.78;">Ecommerce Rekun LAB</div>
                  <h1 style="margin: 14px 0 0; font-size: 34px; line-height: 1.1;">${escaparHtml(titulo)}</h1>
                  <p style="margin: 14px 0 0; max-width: 560px; font-size: 16px; line-height: 1.75; color: rgba(255,255,255,0.82);">${escaparHtml(subtitulo)}</p>
                </div>
                <div style="padding: 32px;">
                  ${contenido}
                </div>
              </div>
              <div style="padding: 16px 8px 0; font-size: 12px; line-height: 1.7; color: #5e716a; text-align: center;">
                Correo transaccional de Rekun LAB para pedidos realizados en Chile.
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
