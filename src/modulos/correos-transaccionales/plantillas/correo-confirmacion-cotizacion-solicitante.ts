import type { CorreoTransaccionalPreparado } from "../tipos/correos-transaccionales";
import type { CotizacionCorreoTransaccional } from "../tipos/correos-cotizacion";
import { construirMarcoCorreoHtml, construirTablaDetallesCorreo, escaparHtml, formatearFechaPedido } from "../utilidades/correos-html";

function construirTextoPlanoCotizacion(cotizacion: CotizacionCorreoTransaccional) {
  const encabezado = [
    `Cotizacion: ${cotizacion.numeroCotizacion}`,
    `Fecha: ${formatearFechaPedido(cotizacion.fechaISO)}`,
    `Solicitante: ${cotizacion.solicitante.nombreCompleto}`,
    `Correo: ${cotizacion.solicitante.correo}`,
    `Telefono: ${cotizacion.solicitante.telefono || "No informado"}`,
  ];

  const mensaje = cotizacion.mensaje.trim().length
    ? ["", "Mensaje:", cotizacion.mensaje.trim()]
    : ["", "Mensaje: (sin mensaje adicional)"];

  return [...encabezado, ...mensaje].join("\n");
}

export function construirCorreoConfirmacionCotizacionSolicitante(
  cotizacion: CotizacionCorreoTransaccional,
): CorreoTransaccionalPreparado {
  const nombreSolicitante = cotizacion.solicitante.nombreCompleto || "cliente";
  const mensaje = cotizacion.mensaje.trim();

  const contenido = `
    <p style="margin: 0 0 18px; font-size: 16px; line-height: 1.8; color: #34433f;">
      Hola ${escaparHtml(nombreSolicitante)}, recibimos tu solicitud de cotizacion y ya quedo registrada en Rekun LAB.
    </p>
    ${construirTablaDetallesCorreo([
      { etiqueta: "Cotizacion", valor: cotizacion.numeroCotizacion },
      { etiqueta: "Fecha", valor: formatearFechaPedido(cotizacion.fechaISO) },
      { etiqueta: "Correo", valor: cotizacion.solicitante.correo },
      {
        etiqueta: "Telefono",
        valor: cotizacion.solicitante.telefono || "No informado",
      },
    ])}
    <div style="height: 24px; line-height: 24px;">&nbsp;</div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse: collapse; border: 1px solid #d8e1dc; border-radius: 18px; background: #ffffff;">
      <tr>
        <td style="padding: 20px;">
          <div style="font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; color: #51635d;">Tu mensaje</div>
          <div style="margin-top: 12px; font-size: 14px; line-height: 1.8; color: #10231d;">
            ${mensaje.length ? escaparHtml(mensaje).replace(/\n/g, "<br />") : '<span style="color:#51635d;">Sin mensaje adicional.</span>'}
          </div>
        </td>
      </tr>
    </table>
    <p style="margin: 24px 0 0; font-size: 14px; line-height: 1.8; color: #51635d;">
      Si respondes este correo, tu respuesta quedara asociada a la atencion de la cotizacion.
    </p>
  `;

  return {
    asunto: `Confirmacion de cotizacion ${cotizacion.numeroCotizacion} | Rekun LAB`,
    destinatarios: [cotizacion.solicitante.correo],
    html: construirMarcoCorreoHtml(
      "Tu cotizacion fue recibida",
      "Gracias por contactarnos. Revisaremos tu solicitud y te responderemos con una propuesta.",
      contenido,
      "Correo transaccional de Rekun LAB para solicitudes de cotizacion realizadas en Chile.",
    ),
    texto: [
      "Tu cotizacion fue recibida en Rekun LAB.",
      "",
      construirTextoPlanoCotizacion(cotizacion),
    ].join("\n"),
  };
}
