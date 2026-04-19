export type ImagenProductoCatalogo = Readonly<{
  src: string;
  alt: string;
  ancho: number;
  alto: number;
}>;

export type ProductoCatalogo = Readonly<{
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

export type RespuestaCatalogoProductos = readonly ProductoCatalogo[];
