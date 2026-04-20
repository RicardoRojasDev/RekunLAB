import type { ResultadoCrearPedido, SolicitudCrearPedido } from "../tipos/crear-pedido";
import { notificarPedidoCreado } from "@/modulos/correos-transaccionales";
import {
  validarSolicitudCrearPedido,
  type ErroresCrearPedido,
} from "../validaciones/crear-pedido";
import { crearPedidoDesdeCheckoutSupabase } from "../repositorios/crear-pedido-supabase";

export class ErrorValidacionCrearPedido extends Error {
  public readonly codigo = "VALIDACION_PEDIDO";
  public readonly errores: ErroresCrearPedido;

  public constructor(errores: ErroresCrearPedido) {
    super("La solicitud de pedido no es valida.");
    this.errores = errores;
  }
}

export async function registrarPedidoDesdeCheckout(
  solicitud: SolicitudCrearPedido,
): Promise<ResultadoCrearPedido> {
  const validacion = validarSolicitudCrearPedido(solicitud);

  if (!validacion.esValido) {
    throw new ErrorValidacionCrearPedido(validacion.errores);
  }

  const resultado = await crearPedidoDesdeCheckoutSupabase(solicitud);

  try {
    const notificacion = await notificarPedidoCreado({
      solicitud,
      resultado,
    });

    if (notificacion.omitido) {
      console.warn(
        "Correos transaccionales omitidos para el pedido creado:",
        resultado.numeroPedido,
        notificacion.motivoOmitido,
      );
    } else {
      if (notificacion.cliente && !notificacion.cliente.exito) {
        console.error(
          "No fue posible enviar el correo al cliente:",
          resultado.numeroPedido,
          notificacion.cliente.error,
        );
      }

      if (notificacion.interno && !notificacion.interno.exito) {
        console.error(
          "No fue posible enviar el correo interno de respaldo:",
          resultado.numeroPedido,
          notificacion.interno.error,
        );
      }
    }
  } catch (error) {
    console.error(
      "Error inesperado enviando correos transaccionales del pedido:",
      resultado.numeroPedido,
      error,
    );
  }

  return resultado;
}
