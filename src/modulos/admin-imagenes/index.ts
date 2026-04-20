export {
  obtenerVistaAdminImagenes,
  subirImagenProductoAdmin,
  marcarImagenProductoComoPrincipalAdmin,
  eliminarImagenProductoAdmin,
  ErrorOperacionAdminImagen,
} from "./servicios/admin-imagenes-supabase";
export { PaginaAdminImagenes } from "./componentes/pagina-admin-imagenes";
export type {
  ImagenProductoAdmin,
  RespuestaApiAdminImagenes,
  ResultadoOperacionImagenProductoAdmin,
  VistaAdminImagenes,
} from "./tipos/admin-imagenes";
