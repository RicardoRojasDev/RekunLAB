import type {
  EntidadObjetivoEstadoDominioNegocio,
  NaturalezaAtributoProductoDominioNegocio,
  TipoDatoAtributoProductoDominioNegocio,
} from "./catalogos-dominio-negocio";

export type ValorMetadatoDominioNegocio =
  | string
  | number
  | boolean
  | null
  | readonly ValorMetadatoDominioNegocio[]
  | {
      readonly [clave: string]: ValorMetadatoDominioNegocio;
    };

export type RegistroMetadatosDominioNegocio = Readonly<
  Record<string, ValorMetadatoDominioNegocio>
>;

export type EntidadBaseDominioNegocio = Readonly<{
  id: string;
  creadoEn: string;
  actualizadoEn: string;
  metadatos: RegistroMetadatosDominioNegocio;
}>;

export type CatalogoAuxiliarBaseDominioNegocio = Readonly<
  EntidadBaseDominioNegocio & {
    codigo: string;
    nombre: string;
    descripcion: string | null;
    estaActivo: boolean;
    ordenVisual: number;
  }
>;

export type EstadoEntidadDominioNegocio = Readonly<
  CatalogoAuxiliarBaseDominioNegocio & {
    entidadObjetivo: EntidadObjetivoEstadoDominioNegocio;
    esFinal: boolean;
  }
>;

export type MarcaDominioNegocio = Readonly<
  CatalogoAuxiliarBaseDominioNegocio & {
    slug: string;
    sitioWeb: string | null;
  }
>;

export type NivelComercialProductoDominioNegocio =
  CatalogoAuxiliarBaseDominioNegocio;

export type TecnologiaImpresionDominioNegocio =
  CatalogoAuxiliarBaseDominioNegocio;

export type MaterialDominioNegocio = Readonly<
  CatalogoAuxiliarBaseDominioNegocio & {
    codigoTecnico: string | null;
  }
>;

export type CategoriaProductoDominioNegocio = Readonly<
  EntidadBaseDominioNegocio & {
    slug: string;
    nombre: string;
    descripcion: string | null;
    categoriaPadreId: string | null;
    estadoId: string;
    ordenVisual: number;
  }
>;

export type ProductoDominioNegocio = Readonly<
  EntidadBaseDominioNegocio & {
    slug: string;
    skuBase: string;
    nombre: string;
    modeloComercial: string | null;
    resumen: string;
    descripcion: string;
    precioBaseIvaIncluido: number | null;
    marcaId: string | null;
    nivelComercialId: string | null;
    tecnologiaImpresionId: string | null;
    estadoId: string;
    vendeDirecto: boolean;
    permiteCotizacion: boolean;
  }
>;

export type VarianteProductoDominioNegocio = Readonly<
  EntidadBaseDominioNegocio & {
    productoId: string;
    skuVariante: string;
    codigoReferencia: string | null;
    nombreComercial: string | null;
    precioIvaIncluido: number | null;
    estadoId: string;
    ordenVisual: number;
  }
>;

export type AsignacionCategoriaProductoDominioNegocio = Readonly<
  EntidadBaseDominioNegocio & {
    productoId: string;
    categoriaId: string;
    esPrincipal: boolean;
    ordenVisual: number;
  }
>;

export type DefinicionAtributoProductoDominioNegocio = Readonly<
  EntidadBaseDominioNegocio & {
    codigo: string;
    nombre: string;
    descripcion: string | null;
    tipoDato: TipoDatoAtributoProductoDominioNegocio;
    naturaleza: NaturalezaAtributoProductoDominioNegocio;
    unidadBase: string | null;
    usaOpcionesPredefinidas: boolean;
    esFiltrable: boolean;
    esVisibleEnFicha: boolean;
    permiteVariantes: boolean;
    ordenVisual: number;
  }
>;

export type OpcionAtributoProductoDominioNegocio = Readonly<
  EntidadBaseDominioNegocio & {
    atributoId: string;
    codigo: string;
    etiqueta: string;
    valor: string;
    colorHex: string | null;
    estaActivo: boolean;
    ordenVisual: number;
  }
>;

export type ValorAtributoProductoDominioNegocio = Readonly<
  EntidadBaseDominioNegocio & {
    productoId: string;
    varianteId: string | null;
    atributoId: string;
    opcionId: string | null;
    valorTexto: string | null;
    valorNumero: number | null;
    valorBooleano: boolean | null;
    valorJson: RegistroMetadatosDominioNegocio | null;
  }
>;

export type ImagenProductoDominioNegocio = Readonly<
  EntidadBaseDominioNegocio & {
    productoId: string;
    varianteId: string | null;
    url: string;
    alt: string;
    etiqueta: string | null;
    ordenVisual: number;
    esPrincipal: boolean;
  }
>;

export type CompatibilidadProductoMaterialDominioNegocio = Readonly<
  EntidadBaseDominioNegocio & {
    productoId: string;
    materialId: string;
    observacion: string | null;
  }
>;

export type TipoRegistroClienteDominioNegocio = "invitado" | "cuenta";

export type ClienteDominioNegocio = Readonly<
  EntidadBaseDominioNegocio & {
    tipoRegistro: TipoRegistroClienteDominioNegocio;
    authUsuarioId: string | null;
    correoPrincipal: string;
    nombre: string;
    apellido: string;
    telefono: string | null;
    estadoId: string | null;
  }
>;

export type DireccionBaseDominioNegocio = Readonly<{
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

export type DireccionClienteDominioNegocio = Readonly<
  EntidadBaseDominioNegocio &
    DireccionBaseDominioNegocio & {
      clienteId: string;
      alias: string | null;
      esPredeterminada: boolean;
    }
>;

export type DireccionPedidoDominioNegocio = Readonly<
  EntidadBaseDominioNegocio &
    DireccionBaseDominioNegocio & {
      pedidoId: string;
    }
>;

export type PedidoDominioNegocio = Readonly<
  EntidadBaseDominioNegocio & {
    numeroPedido: string;
    clienteId: string | null;
    estadoId: string;
    configuracionComercialId: string;
    monedaCodigo: string;
    nombreClienteSnapshot: string;
    apellidoClienteSnapshot: string;
    correoClienteSnapshot: string;
    telefonoClienteSnapshot: string | null;
    subtotalIvaIncluido: number;
    descuentoIvaIncluido: number | null;
    costoEnvioIvaIncluido: number | null;
    totalIvaIncluido: number;
    observacionesCliente: string | null;
  }
>;

export type ItemPedidoDominioNegocio = Readonly<
  EntidadBaseDominioNegocio & {
    pedidoId: string;
    productoId: string | null;
    varianteId: string | null;
    skuSnapshot: string | null;
    nombreProductoSnapshot: string;
    descripcionProductoSnapshot: string | null;
    atributosSnapshot: RegistroMetadatosDominioNegocio;
    precioUnitarioIvaIncluido: number;
    cantidad: number;
    subtotalLineaIvaIncluido: number;
  }
>;

export type CotizacionDominioNegocio = Readonly<
  EntidadBaseDominioNegocio & {
    numeroCotizacion: string;
    clienteId: string | null;
    estadoId: string;
    configuracionComercialId: string;
    nombreSolicitante: string;
    apellidoSolicitante: string;
    correoSolicitante: string;
    telefonoSolicitante: string | null;
    mensajeSolicitud: string | null;
  }
>;

export type ItemCotizacionDominioNegocio = Readonly<
  EntidadBaseDominioNegocio & {
    cotizacionId: string;
    productoId: string | null;
    varianteId: string | null;
    nombreProductoSnapshot: string | null;
    atributosSolicitadosSnapshot: RegistroMetadatosDominioNegocio;
    cantidadSolicitada: number;
    observacionSolicitante: string | null;
  }
>;

export type ConfiguracionComercialDominioNegocio = Readonly<
  EntidadBaseDominioNegocio & {
    codigo: string;
    version: string;
    paisOperacion: "CL";
    monedaBase: "CLP";
    preciosIncluyenIva: boolean;
    ventaSoloChile: boolean;
    despachoHabilitado: boolean;
    retiroFisicoHabilitado: boolean;
    loginGoogleHabilitado: boolean;
    compraInvitadoHabilitada: boolean;
    stockVisiblePublico: boolean;
    respaldoCorreoPedidos: boolean;
    catalogoAdministrableDesdePanel: boolean;
    cotizacionMedianteFormulario: boolean;
  }
>;
