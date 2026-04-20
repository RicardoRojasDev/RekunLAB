import "server-only";

import { Resend } from "resend";
import type {
  CorreoTransaccionalPreparado,
  ProveedorCorreosTransaccionales,
  ResultadoEnvioCorreoTransaccional,
} from "../tipos/correos-transaccionales";

type ConfiguracionProveedorResend = Readonly<{
  apiKey: string;
  correoOrigen: string;
}>;

export function crearProveedorResend(
  configuracion: ConfiguracionProveedorResend,
): ProveedorCorreosTransaccionales {
  const cliente = new Resend(configuracion.apiKey);

  async function enviar(
    correo: CorreoTransaccionalPreparado,
  ): Promise<ResultadoEnvioCorreoTransaccional> {
    try {
      const respuesta = await cliente.emails.send({
        from: configuracion.correoOrigen,
        to: [...correo.destinatarios],
        subject: correo.asunto,
        html: correo.html,
        text: correo.texto,
        replyTo: correo.responderA,
      });

      if (respuesta.error) {
        return {
          exito: false,
          proveedor: "resend",
          error: respuesta.error.message,
        };
      }

      return {
        exito: true,
        proveedor: "resend",
        idMensaje: respuesta.data?.id,
      };
    } catch (error) {
      return {
        exito: false,
        proveedor: "resend",
        error: error instanceof Error ? error.message : "Error desconocido enviando correo.",
      };
    }
  }

  return {
    nombre: "resend",
    enviar,
  };
}
