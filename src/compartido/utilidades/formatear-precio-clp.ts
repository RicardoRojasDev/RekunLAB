const formateadorPrecioClp = new Intl.NumberFormat("es-CL", {
  style: "currency",
  currency: "CLP",
  maximumFractionDigits: 0,
});

export function formatearPrecioClp(valor: number) {
  return formateadorPrecioClp.format(valor);
}
