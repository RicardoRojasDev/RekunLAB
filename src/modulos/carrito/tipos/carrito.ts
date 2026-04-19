export type ImagenItemCarrito = Readonly<{
  src: string;
  alt: string;
  ancho: number;
  alto: number;
}>;

export type SeleccionVarianteItemCarrito = Readonly<{
  codigoAtributo: string;
  etiquetaAtributo: string;
  opcionId: string;
  etiquetaOpcion: string;
  valorOpcion: string;
}>;

export type VarianteItemCarrito = Readonly<{
  id: string;
  etiqueta: string;
  codigoReferencia: string;
  selecciones: readonly SeleccionVarianteItemCarrito[];
}>;

export type EntradaAgregarItemCarrito = Readonly<{
  // Campos básicos (existentes)
  productoId: string;
  slug: string;
  nombre: string;
  resumen: string;
  categoria: string;
  tipoProducto: string;
  coleccion?: string;
  imagen: ImagenItemCarrito;
  precioUnitarioIvaIncluido: number;
  cantidad: number;
  etiquetasComerciales?: readonly string[];

  // Campos NUEVOS para snapshot
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
  variante?: VarianteItemCarrito | null;
}>;

export type ItemCarrito = Readonly<
  EntradaAgregarItemCarrito & {
    idLinea: string;
  }
>;

export type ResumenCarrito = Readonly<{
  cantidadLineas: number;
  cantidadUnidades: number;
  subtotalIvaIncluido: number;
}>;

export type EstadoCarrito = Readonly<{
  items: readonly ItemCarrito[];
  hidratado: boolean;
  drawerAbierto: boolean;
}>;

export type OpcionesAgregarItemCarrito = Readonly<{
  abrirDrawer?: boolean;
}>;
