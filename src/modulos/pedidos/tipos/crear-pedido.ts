export type DatosClientePedido = Readonly<{
  nombre: string;
  apellido: string;
  correo: string;
  telefono: string;
}>;

export type DireccionDespachoPedido = Readonly<{
  region: string;
  comuna: string;
  calle: string;
  numero: string;
  departamento: string;
  referencias: string;
  codigoPostal: string;
}>;

export type SeleccionVariantePedido = Readonly<{
  codigoAtributo: string;
  etiquetaAtributo: string;
  opcionId: string;
  etiquetaOpcion: string;
  valorOpcion: string;
}>;

export type VariantePedido = Readonly<{
  etiqueta: string;
  codigoReferencia: string | null;
  selecciones: readonly SeleccionVariantePedido[];
}>;

export type ItemCrearPedido = Readonly<{
  // Campos básicos (existentes)
  slug: string;
  nombre: string;
  resumen: string;
  categoria: string;
  tipoProducto: string;
  coleccion?: string;
  precioUnitarioIvaIncluidoSnapshot: number;
  cantidad: number;
  etiquetasComerciales?: readonly string[];

  // Campos NUEVOS para snapshot completo
  idProducto?: string;
  nombreCompleto?: string;
  marca?: string;
  nivel?: string;
  formato?: string;
  pesoKg?: number;
  acabado?: string;
  efecto?: string;
  colorHex?: string;
  compatiblePLA?: boolean;
  esDestacado?: boolean;
  estado?: string;

  // Variante (existente)
  variante?: VariantePedido | null;
}>;

export type SolicitudCrearPedido = Readonly<{
  datosCliente: DatosClientePedido;
  direccionDespacho: DireccionDespachoPedido;
  items: readonly ItemCrearPedido[];
}>;

export type ResultadoCrearPedido = Readonly<{
  pedidoId: string;
  numeroPedido: string;
  subtotalIvaIncluido: number;
  totalIvaIncluido: number;
}>;

export type RespuestaApiCrearPedido =
  | (Readonly<{ ok: true }> & ResultadoCrearPedido)
  | Readonly<{
      ok: false;
      codigo: string;
      mensaje: string;
      detalle?: string;
    }>;

