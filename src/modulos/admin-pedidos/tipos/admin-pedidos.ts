export type EstadoPagoAdminPedido = "sin-pago" | "pendiente" | "pagado" | "fallido";

export type EstadoPedidoAdmin = Readonly<{
  id: string;
  codigo: string;
  nombre: string;
}>;

export type PagoPedidoAdmin = Readonly<{
  id: string;
  estado: EstadoPagoAdminPedido;
  proveedor: string | null;
  intento: number | null;
  referenciaExterna: string | null;
  creadoEnISO: string | null;
  pagadoEnISO: string | null;
  fallidoEnISO: string | null;
  ultimoError: string | null;
}>;

export type ResumenPedidoAdmin = Readonly<{
  id: string;
  numeroPedido: string;
  creadoEnISO: string;
  actualizadoEnISO: string;
  estadoId: string;
  estadoCodigo: string;
  estadoNombre: string;
  totalIvaIncluido: number;
  monedaCodigo: string;
  nombreCliente: string;
  apellidoCliente: string;
  correoCliente: string;
  telefonoCliente: string | null;
  region: string | null;
  comuna: string | null;
  totalItems: number;
  pagoActual: PagoPedidoAdmin;
}>;

export type DireccionPedidoAdmin = Readonly<{
  nombreDestinatario: string;
  apellidoDestinatario: string;
  telefonoDestinatario: string | null;
  region: string;
  comuna: string;
  calle: string;
  numero: string;
  departamento: string | null;
  referencias: string | null;
  codigoPostal: string | null;
}>;

export type ItemPedidoAdmin = Readonly<{
  id: string;
  skuSnapshot: string | null;
  nombreProducto: string;
  nombreCompletoProducto: string;
  descripcionProducto: string | null;
  marcaProducto: string | null;
  tipoProducto: string | null;
  categoriaProducto: string | null;
  subcategoriaProducto: string | null;
  nivelProducto: string | null;
  coleccionProducto: string | null;
  formato: string | null;
  pesoKg: number | null;
  acabado: string | null;
  efecto: string | null;
  colorHex: string | null;
  compatiblePLA: boolean | null;
  cantidad: number;
  precioUnitarioCLP: number;
  subtotalCLP: number;
}>;

export type EventoHistorialPedidoAdmin = Readonly<{
  id: string;
  fechaISO: string;
  titulo: string;
  descripcion: string;
  tono: "base" | "exito" | "alerta";
}>;

export type DetallePedidoAdmin = Readonly<
  ResumenPedidoAdmin & {
    subtotalIvaIncluido: number;
    descuentoIvaIncluido: number | null;
    costoEnvioIvaIncluido: number | null;
    observacionesCliente: string | null;
    direccion: DireccionPedidoAdmin | null;
    items: readonly ItemPedidoAdmin[];
    pagos: readonly PagoPedidoAdmin[];
    historial: readonly EventoHistorialPedidoAdmin[];
    mensajeEstadoPago: string | null;
  }
>;

export type VistaAdminPedidos = Readonly<{
  pedidos: readonly ResumenPedidoAdmin[];
  estadosPedido: readonly EstadoPedidoAdmin[];
}>;
