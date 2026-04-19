export const enlacesNavegacionPrincipal = [
  {
    etiqueta: "Inicio",
    href: "/",
    estado: "disponible",
  },
  {
    etiqueta: "Catalogo",
    href: "/catalogo",
    estado: "disponible",
  },
  {
    etiqueta: "Servicios",
    href: null,
    estado: "preparado",
  },
  {
    etiqueta: "Cotizaciones",
    href: null,
    estado: "preparado",
  },
] as const;

export const capacidadesMarca = [
  "Impresion 3D sustentable",
  "Reciclaje de plastico",
  "Filamento PLA ecologico",
] as const;

export const indicadoresOperacionInicial = [
  "Solo Chile",
  "IVA incluido",
  "Envios",
] as const;

export const espaciosPreparadosLayout = [
  "Branding principal",
  "Carrito futuro",
  "Navegacion comercial",
  "SEO tecnico base",
] as const;
