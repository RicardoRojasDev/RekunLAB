export const tiposDatoAtributoProductoDominioNegocio = [
  "texto-corto",
  "texto-largo",
  "numero",
  "decimal",
  "booleano",
  "fecha",
  "seleccion-simple",
  "seleccion-multiple",
  "color",
  "json",
] as const;

export const naturalezasAtributoProductoDominioNegocio = [
  "informativo",
  "comercial",
  "tecnico",
  "variante",
  "compatibilidad",
] as const;

export const entidadesObjetivoEstadoDominioNegocio = [
  "categoria-producto",
  "producto",
  "variante-producto",
  "cliente",
  "pedido",
  "cotizacion",
] as const;

export const catalogosAuxiliaresDominioNegocio = [
  {
    codigo: "marca-producto",
    nombre: "Marca de producto",
    finalidad:
      "Mantener una lista controlada y reusable de marcas para filtros, administracion y consistencia editorial.",
  },
  {
    codigo: "nivel-comercial-producto",
    nombre: "Nivel comercial del producto",
    finalidad:
      "Clasificar productos por nivel sin rigidizar el catalogo a una sola categoria como impresoras 3D.",
  },
  {
    codigo: "tecnologia-impresion",
    nombre: "Tecnologia de impresion",
    finalidad:
      "Normalizar tecnologias como un vocabulario controlado reusable en catalogo y futuras lineas.",
  },
  {
    codigo: "material",
    nombre: "Material",
    finalidad:
      "Permitir compatibilidades y relaciones con materiales actuales o futuros, sin reducir el dominio a PLA.",
  },
  {
    codigo: "estado-entidad",
    nombre: "Estado por entidad",
    finalidad:
      "Separar estados operativos y comerciales del dato principal para productos, pedidos, cotizaciones y clientes.",
  },
] as const;
