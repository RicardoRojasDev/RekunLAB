export { obtenerVistaAdminProductos } from "./servicios/admin-productos-supabase";
export {
  ErrorOperacionAdminProducto,
  listarProductosAdmin,
  listarOpcionesAdminProductos,
  crearProductoAdmin,
  actualizarProductoAdmin,
  cambiarEstadoProductoAdmin,
  eliminarLogicoProductoAdmin,
} from "./servicios/admin-productos-supabase";
export { ErrorValidacionProductoAdmin } from "./validaciones/validar-datos-formulario-producto-admin";
export { validarDatosFormularioProductoAdmin } from "./validaciones/validar-datos-formulario-producto-admin";
export type {
  DatosFormularioProductoAdmin,
  OpcionReferenciaAdminProducto,
  OpcionesAdminProductos,
  ProductoAdmin,
  RespuestaApiAdminProductos,
  VistaAdminProductos,
} from "./tipos/admin-productos";
