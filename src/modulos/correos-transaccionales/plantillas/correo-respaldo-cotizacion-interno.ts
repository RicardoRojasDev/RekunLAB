import type { CorreoTransaccionalPreparado } from "../tipos/correos-transaccionales";
import type { CotizacionCorreoTransaccional } from "../tipos/correos-cotizacion";
import {
  construirMarcoCorreoHtml,
  construirTablaDetallesCorreo,
  escaparHtml,
  formatearFechaPedido,
} from "../utilidades/correos-html";

export function construirCorreoRespaldoCotizacionInterno(
  cotizacion: CotizacionCorreoTransaccional,
  correoInterno: string,
): CorreoTransaccionalPreparado {
  const mensaje = cotizacion.mensaje.trim();

  const contenido = `
    <p style="margin: 0 0 18px; font-size: 16px; line-height: 1.8; color: #34433f;">
      Se registro una nueva solicitud de cotizacion en el ecommerce de Rekun LAB.
    </p>
    ${construirTablaDetallesCorreo([
      { etiqueta: "Cotizacion", valor: cotizacion.numeroCotizacion },
      { etiqueta: "Fecha", valor: formatearFechaPedido(cotizacion.fechaISO) },
      { etiqueta: "Solicitante", valor: cotizacion.solicitante.nombreCompleto || "No informado" },
      { etiqueta: "Correo", valor: cotizacion.solicitante.correo },
      {
        etiqueta: "Telefono",
        valor: cotizacion.solicitante.telefono || "No informado",
      },
      { etiqueta: "ID", valor: cotizacion.cotizacionId },
    ])}
    <div style="height: 24px; line-height: 24px;">&nbsp;</div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse: collapse; border: 1px solid #d8e1dc; border-radius: 18px; background: #ffffff;">
      <tr>
        <td style="padding: 20px;">
          <div style="font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; color: #51635d;">Mensaje del solicitante</div>
          <div style="margin-top: 12px; font-size: 14px; line-height: 1.8; color: #10231d;">
            ${mensaje.length ? escaparHtml(mensaje).replace(/\n/g, "<br />") : '<span style="color:#51635d;">Sin mensaje adicional.</span>'}
          </div>
        </td>
      </tr>
    </table>
  `;

  return {
    asunto: `Nueva cotizacion ${cotizacion.numeroCotizacion} | Rekun LAB`,
    destinatarios: [correoInterno],
    html: construirMarcoCorreoHtml(
      "Nueva solicitud de cotizacion",
      "Este correo respalda la solicitud para respuesta operativa. Responde para contactar al solicitante.",
      contenido,
      "Correo transaccional de Rekun LAB para respaldo interno de cotizaciones.",
    ),
    texto: [
      `Nueva cotizacion registrada: ${cotizacion.numeroCotizacion}`,
      `Fecha: ${formatearFechaPedido(cotizacion.fechaISO)}`,
      `Solicitante: ${cotizacion.solicitante.nombreCompleto}`,
      `Correo: ${cotizacion.solicitante.correo}`,
      `Telefono: ${cotizacion.solicitante.telefono || "No informado"}`,
      "",
      "Mensaje:",
      mensaje.length ? mensaje : "(sin mensaje adicional)",
      "",
      `ID: ${cotizacion.cotizacionId}`,
    ].join("\n"),
  };
}
