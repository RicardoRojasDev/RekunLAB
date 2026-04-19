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

export type TipoDatoAtributoProductoDominioNegocio =
  (typeof tiposDatoAtributoProductoDominioNegocio)[number];

export const naturalezasAtributoProductoDominioNegocio = [
  "informativo",
  "comercial",
  "tecnico",
  "variante",
  "compatibilidad",
] as const;

export type NaturalezaAtributoProductoDominioNegocio =
  (typeof naturalezasAtributoProductoDominioNegocio)[number];

export const entidadesObjetivoEstadoDominioNegocio = [
  "categoria-producto",
  "producto",
  "variante-producto",
  "cliente",
  "pedido",
  "cotizacion",
] as const;

export type EntidadObjetivoEstadoDominioNegocio =
  (typeof entidadesObjetivoEstadoDominioNegocio)[number];
