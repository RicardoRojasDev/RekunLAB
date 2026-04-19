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

export type ResumenProductoCatalogo = Readonly<{
  id: string;
  slug: string;
  nombre: string;
  resumen: string;
  categoria: string;
  tipoProducto: string;
  coleccion?: string;
  precioIvaIncluido: number;
  imagen: ImagenProductoCatalogo;
  etiquetasComerciales: readonly string[];
}>;

export type ProductoCatalogo = Readonly<
  ResumenProductoCatalogo & {
    descripcion: string;
    imagenesGaleria: readonly ImagenGaleriaProductoCatalogo[];
    especificaciones: readonly EspecificacionProductoCatalogo[];
  }
>;

export type ProductoRelacionadoCatalogo = ResumenProductoCatalogo;

export type RespuestaCatalogoResumen = readonly ResumenProductoCatalogo[];

export type RespuestaCatalogoDetalle = readonly ProductoCatalogo[];

export type ProductoCatalogoPorSlug = ProductoCatalogo | null;

export type RespuestaProductosRelacionadosCatalogo =
  readonly ProductoRelacionadoCatalogo[];

export type RespuestaCatalogoProductos = readonly ProductoCatalogo[];
