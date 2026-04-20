import type { ProductoAdmin } from "@/modulos/admin-productos";

export type ImagenProductoAdmin = Readonly<{
  id: string;
  productoId: string;
  url: string;
  alt: string;
  etiqueta: string | null;
  ordenVisual: number;
  esPrincipal: boolean;
  creadoEnISO: string;
  rutaStorage: string | null;
  bucketStorage: string | null;
  nombreArchivoOriginal: string | null;
  tamanoBytes: number | null;
  mimeType: string | null;
}>;

export type VistaAdminImagenes = Readonly<{
  productos: readonly ProductoAdmin[];
  productoSeleccionado: ProductoAdmin | null;
  imagenes: readonly ImagenProductoAdmin[];
}>;

export type ResultadoOperacionImagenProductoAdmin = Readonly<{
  imagen: ImagenProductoAdmin;
  mensaje: string;
}>;

export type RespuestaApiAdminImagenes =
  | Readonly<{
      ok: true;
      imagen?: ImagenProductoAdmin;
      mensaje?: string;
    }>
  | Readonly<{
      ok: false;
      codigo: string;
      mensaje: string;
      detalle?: string;
    }>;
