export type OpcionFiltroCatalogo = Readonly<{
  valor: string;
  etiqueta: string;
}>;

export const opcionesOrdenCatalogo = [
  {
    valor: "orden-base",
    etiqueta: "Orden base",
  },
  {
    valor: "precio-menor",
    etiqueta: "Precio: menor a mayor",
  },
  {
    valor: "precio-mayor",
    etiqueta: "Precio: mayor a menor",
  },
  {
    valor: "nombre-az",
    etiqueta: "Nombre: A a Z",
  },
] as const satisfies readonly OpcionFiltroCatalogo[];

export type ValorOrdenCatalogo =
  (typeof opcionesOrdenCatalogo)[number]["valor"];

export type EstadoFiltrosCatalogo = Readonly<{
  categoria: string;
  coleccion: string;
  tipoProducto: string;
  orden: ValorOrdenCatalogo;
}>;

export type ClaveFiltroCatalogo = keyof EstadoFiltrosCatalogo;

export type FiltroActivoCatalogo = Readonly<{
  clave: ClaveFiltroCatalogo;
  etiqueta: string;
  valor: string;
}>;

export type OpcionesPanelFiltrosCatalogo = Readonly<{
  categorias: readonly OpcionFiltroCatalogo[];
  colecciones: readonly OpcionFiltroCatalogo[];
  tiposProducto: readonly OpcionFiltroCatalogo[];
  ordenamiento: readonly OpcionFiltroCatalogo[];
}>;

export const filtrosCatalogoPorDefecto: EstadoFiltrosCatalogo = {
  categoria: "",
  coleccion: "",
  tipoProducto: "",
  orden: "orden-base",
};
