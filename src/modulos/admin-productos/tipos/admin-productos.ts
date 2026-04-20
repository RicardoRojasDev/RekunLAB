export type OpcionReferenciaAdminProducto = Readonly<{
  id: string;
  codigo: string;
  nombre: string;
  slug?: string;
}>;

export type ProductoAdmin = Readonly<{
  id: string;
  creadoEnISO: string;
  actualizadoEnISO: string;
  skuBase: string;
  nombre: string;
  nombreCompleto?: string;
  slug: string;
  resumen: string;
  descripcion: string;
  categoriaId: string | null;
  categoria: string;
  subcategoria?: string;
  nivelId?: string;
  nivel?: string;
  marcaId?: string;
  marca?: string;
  tipoProducto: string;
  precioCLP: number;
  formato?: string;
  pesoKg?: number;
  acabado?: string;
  efecto?: string;
  colorHex?: string;
  compatiblePLA?: boolean;
  coleccion?: string;
  esDestacado: boolean;
  estadoId: string;
  estado: string;
  estadoNombre: string;
}>;

export type DatosFormularioProductoAdmin = Readonly<{
  skuBase: string;
  nombre: string;
  nombreCompleto?: string;
  slug: string;
  resumen: string;
  descripcion: string;
  categoriaId: string;
  subcategoria?: string;
  nivelId?: string;
  marcaId?: string;
  tipoProducto: string;
  precioCLP: number;
  formato?: string;
  pesoKg?: number;
  acabado?: string;
  efecto?: string;
  colorHex?: string;
  compatiblePLA?: boolean;
  coleccion?: string;
  esDestacado: boolean;
  estadoId: string;
}>;

export type OpcionesAdminProductos = Readonly<{
  categorias: readonly OpcionReferenciaAdminProducto[];
  marcas: readonly OpcionReferenciaAdminProducto[];
  niveles: readonly OpcionReferenciaAdminProducto[];
  estados: readonly OpcionReferenciaAdminProducto[];
}>;

export type VistaAdminProductos = Readonly<{
  productos: readonly ProductoAdmin[];
  opciones: OpcionesAdminProductos;
}>;

export type RespuestaApiAdminProductos = Readonly<{
  ok: boolean;
  codigo?: string;
  mensaje?: string;
  detalle?: string;
  producto?: ProductoAdmin;
  productos?: readonly ProductoAdmin[];
  opciones?: OpcionesAdminProductos;
}>;
