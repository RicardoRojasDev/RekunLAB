export type EstadoPago = "pendiente" | "pagado" | "fallido";

export type ProveedorPago = "webpay-plus";

export type ResultadoCrearIntencionPago = Readonly<{
  pagoId: string;
  pedidoId: string;
  numeroPedido: string;
  proveedor: ProveedorPago;
  estado: "pendiente";
  referenciaExterna: string;
  urlRedireccion: string;
  tokenRedireccion: string;
}>;

export type RespuestaApiCrearIntencionPago =
  | (Readonly<{ ok: true }> & ResultadoCrearIntencionPago)
  | Readonly<{
      ok: false;
      codigo: string;
      mensaje: string;
      detalle?: string;
    }>;

export type ResumenPagoPedido = Readonly<{
  pedidoId: string;
  numeroPedido: string;
  fechaPedidoISO: string;
  estadoPedido: string;
  totalIvaIncluido: number;
  monedaCodigo: string;
  mensajeEstado: string;
  pago: Readonly<{
    id: string | null;
    proveedor: ProveedorPago | null;
    estado: EstadoPago | "sin-pago";
    referenciaExterna: string | null;
    intento: number | null;
    pagadoEnISO: string | null;
    fallidoEnISO: string | null;
    ultimoError: string | null;
    permiteReintento: boolean;
  }>;
}>;
