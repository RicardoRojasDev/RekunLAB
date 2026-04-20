import type { EnlaceNavegacionAdmin } from "../tipos/admin";

export const enlacesNavegacionAdmin: readonly EnlaceNavegacionAdmin[] = [
  {
    href: "/admin",
    etiqueta: "Resumen",
    descripcion: "Vista general del backoffice",
    claveVisual: "RS",
  },
  {
    href: "/admin/productos",
    etiqueta: "Productos",
    descripcion: "Base para catalogo y categorias",
    claveVisual: "PD",
  },
  {
    href: "/admin/pedidos",
    etiqueta: "Pedidos",
    descripcion: "Base para operacion diaria",
    claveVisual: "PE",
  },
  {
    href: "/admin/imagenes",
    etiqueta: "Imagenes",
    descripcion: "Base para storage y medios",
    claveVisual: "IM",
  },
] as const;
