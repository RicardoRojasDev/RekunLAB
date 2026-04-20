export { enlacesNavegacionAdmin } from "./configuracion/navegacion-admin";
export { LayoutAdminInterno } from "./componentes/layout-admin-interno";
export { PaginaDashboardAdmin } from "./componentes/pagina-dashboard-admin";
export { PaginaSeccionAdminBase } from "./componentes/pagina-seccion-admin-base";
export {
  exigirAccesoAdministrador,
  resolverAccesoAdministrador,
} from "./servicios/acceso-admin-servidor";
export type {
  EnlaceNavegacionAdmin,
  ResultadoAccesoAdministrador,
  UsuarioAdministrador,
} from "./tipos/admin";
