export type ImagenProductoCatalogo = Readonly<{
  src: string;
  alt: string;
  ancho: number;
  alto: number;
}>;

export type ImagenGaleriaProductoCatalogo = Readonly<
  ImagenProductoCatalogo & {
    etiqueta: string;
    posicionObjeto?: string;
  }
>;

export type EspecificacionProductoCatalogo = Readonly<{
  etiqueta: string;
  valor: string;
}>;

export type TipoPresentacionAtributoVarianteProductoCatalogo =
  | "texto"
  | "color";

export type OpcionAtributoVarianteProductoCatalogo = Readonly<{
  id: string;
  etiqueta: string;
  valor: string;
  descripcion?: string;
  colorHex?: string;
}>;

export type AtributoVarianteProductoCatalogo = Readonly<{
  codigo: string;
  etiqueta: string;
  tipoPresentacion: TipoPresentacionAtributoVarianteProductoCatalogo;
  opciones: readonly OpcionAtributoVarianteProductoCatalogo[];
}>;

export type SeleccionVarianteProductoCatalogo = Readonly<Record<string, string>>;

export type VarianteProductoCatalogo = Readonly<{
  id: string;
  codigoReferencia: string;
  etiqueta: string;
  precioIvaIncluido: number;
  selecciones: SeleccionVarianteProductoCatalogo;
  imagen?: ImagenProductoCatalogo;
  imagenesGaleria?: readonly ImagenGaleriaProductoCatalogo[];
  especificacionesComplementarias?: readonly EspecificacionProductoCatalogo[];
}>;

export type ConfiguracionVariantesProductoCatalogo = Readonly<{
  atributos: readonly AtributoVarianteProductoCatalogo[];
  variantes: readonly VarianteProductoCatalogo[];
  variantePorDefectoId?: string;
}>;

export type ResumenProductoCatalogo = Readonly<{
  id: string;
  slug: string;
  nombre: string;
  nombreCompleto?: string;
  resumen: string;
  categoria: string;
  subcategoria?: string;
  marca?: string;
  tipoProducto: string;
  nivel?: string;
  coleccion?: string;
  formato?: string;
  pesoKg?: number;
  acabado?: string;
  efecto?: string;
  colorHex?: string;
  compatiblePLA?: boolean;
  esDestacado?: boolean;
  estado?: string;
  precioIvaIncluido: number;
  imagen: ImagenProductoCatalogo;
  etiquetasComerciales: readonly string[];
}>;

export type ProductoCatalogo = Readonly<
  ResumenProductoCatalogo & {
    descripcion: string;
    imagenesGaleria: readonly ImagenGaleriaProductoCatalogo[];
    especificaciones: readonly EspecificacionProductoCatalogo[];
    configuracionVariantes?: ConfiguracionVariantesProductoCatalogo;
  }
>;

export type ProductoRelacionadoCatalogo = ResumenProductoCatalogo;

export type OpcionDisponibleVarianteProductoCatalogo = Readonly<
  OpcionAtributoVarianteProductoCatalogo & {
    disponible: boolean;
    seleccionada: boolean;
  }
>;

export type MapaOpcionesDisponiblesVariantesProductoCatalogo = Readonly<
  Record<string, readonly OpcionDisponibleVarianteProductoCatalogo[]>
>;

export type EstadoValidacionVariantesProductoCatalogo = Readonly<{
  esValida: boolean;
  mensaje: string | null;
  atributosFaltantes: readonly string[];
  varianteSeleccionada: VarianteProductoCatalogo | null;
}>;

export type VistaDetalleProductoCatalogo = Readonly<{
  productoBase: ProductoCatalogo;
  varianteSeleccionada: VarianteProductoCatalogo | null;
  precioIvaIncluido: number;
  imagen: ImagenProductoCatalogo;
  imagenesGaleria: readonly ImagenGaleriaProductoCatalogo[];
  especificaciones: readonly EspecificacionProductoCatalogo[];
}>;

export type RespuestaCatalogoResumen = readonly ResumenProductoCatalogo[];

export type RespuestaCatalogoDetalle = readonly ProductoCatalogo[];

export type ProductoCatalogoPorSlug = ProductoCatalogo | null;

export type RespuestaProductosRelacionadosCatalogo =
  readonly ProductoRelacionadoCatalogo[];

export type RespuestaCatalogoProductos = readonly ProductoCatalogo[];
