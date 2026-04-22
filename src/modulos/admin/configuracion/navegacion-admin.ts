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
    descripcion: "Gestion de catalogo y categorias",
    claveVisual: "PD",
  },
  {
    href: "/admin/pedidos",
    etiqueta: "Pedidos",
    descripcion: "Seguimiento y gestion operativa",
    claveVisual: "PE",
  },
  {
    href: "/admin/imagenes",
    etiqueta: "Imagenes",
    descripcion: "Biblioteca de imagenes del catalogo",
    claveVisual: "IM",
  },
] as const;
