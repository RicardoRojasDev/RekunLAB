export type ItemPedidoCorreoTransaccional = Readonly<{
  nombreProducto: string;
  nombreCompleto: string;
  marca: string;
  tipoProducto: string;
  precioUnitarioCLP: number;
  cantidad: number;
  subtotalCLP: number;
}>;

export type PedidoCorreoTransaccional = Readonly<{
  pedidoId: string;
  numeroPedido: string;
  fechaISO: string;
  subtotalCLP: number;
  totalCLP: number;
  datosCliente: Readonly<{
    nombreCompleto: string;
    correo: string;
    telefono: string;
  }>;
  direccionDespacho: Readonly<{
    region: string;
    comuna: string;
    calle: string;
    numero: string;
    departamento: string;
    referencias: string;
    codigoPostal: string;
  }>;
  items: readonly ItemPedidoCorreoTransaccional[];
}>;

export type CorreoTransaccionalPreparado = Readonly<{
  asunto: string;
  destinatarios: readonly string[];
  html: string;
  texto: string;
  responderA?: string;
}>;

export type ResultadoEnvioCorreoTransaccional = Readonly<{
  exito: boolean;
  proveedor: string;
  idMensaje?: string;
  error?: string;
}>;

export type ProveedorCorreosTransaccionales = Readonly<{
  nombre: string;
  enviar: (
    correo: CorreoTransaccionalPreparado,
  ) => Promise<ResultadoEnvioCorreoTransaccional>;
}>;

export type ResultadoNotificacionPedido = Readonly<{
  cliente: ResultadoEnvioCorreoTransaccional | null;
  interno: ResultadoEnvioCorreoTransaccional | null;
  omitido: boolean;
  motivoOmitido?: string;
}>;
