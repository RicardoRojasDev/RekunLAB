import type { ResultadoCrearPedido, SolicitudCrearPedido } from "../tipos/crear-pedido";
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

  return crearPedidoDesdeCheckoutSupabase(solicitud);
}

