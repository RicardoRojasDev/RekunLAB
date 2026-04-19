export type CardinalidadRelacionDominioNegocio = "1:1" | "1:n" | "n:n";

export type RelacionDominioNegocio = Readonly<{
  origen: string;
  destino: string;
  cardinalidad: CardinalidadRelacionDominioNegocio;
  descripcion: string;
}>;

export const relacionesDominioNegocioRekunLab: readonly RelacionDominioNegocio[] = [
  {
    origen: "producto",
    destino: "variante-producto",
    cardinalidad: "1:n",
    descripcion:
      "Un producto puede tener cero o muchas variantes comerciales sin duplicar la entidad padre.",
  },
  {
    origen: "producto",
    destino: "asignacion-categoria-producto",
    cardinalidad: "1:n",
    descripcion:
      "La pertenencia a categorias se maneja como relacion separada para soportar categorias multiples y una principal.",
  },
  {
    origen: "producto",
    destino: "imagen-producto",
    cardinalidad: "1:n",
    descripcion:
      "Las imagenes viven fuera del producto para soportar orden, principalidad y relacion con variantes.",
  },
  {
    origen: "producto",
    destino: "valor-atributo-producto",
    cardinalidad: "1:n",
    descripcion:
      "Los atributos informativos, tecnicos o comerciales se asignan sin fijar columnas por cada linea futura.",
  },
  {
    origen: "producto",
    destino: "compatibilidad-producto-material",
    cardinalidad: "n:n",
    descripcion:
      "La compatibilidad con materiales se expresa como una relacion flexible y no como un booleano aislado.",
  },
  {
    origen: "definicion-atributo-producto",
    destino: "opcion-atributo-producto",
    cardinalidad: "1:n",
    descripcion:
      "Los atributos con opciones controladas necesitan un catalogo reutilizable de valores posibles.",
  },
  {
    origen: "cliente",
    destino: "direccion-cliente",
    cardinalidad: "1:n",
    descripcion:
      "Un cliente puede guardar multiples direcciones para futuras compras, sin afectar snapshots historicos.",
  },
  {
    origen: "cliente",
    destino: "pedido",
    cardinalidad: "1:n",
    descripcion:
      "Un cliente puede tener muchos pedidos, pero el pedido tambien puede existir con cliente invitado.",
  },
  {
    origen: "pedido",
    destino: "item-pedido",
    cardinalidad: "1:n",
    descripcion:
      "Cada pedido conserva sus lineas como snapshots para no depender del estado actual del catalogo.",
  },
  {
    origen: "pedido",
    destino: "direccion-pedido",
    cardinalidad: "1:1",
    descripcion:
      "La direccion de envio del pedido se modela como snapshot independiente de la libreta de direcciones del cliente.",
  },
  {
    origen: "cliente",
    destino: "cotizacion",
    cardinalidad: "1:n",
    descripcion:
      "Una cotizacion puede pertenecer a un cliente autenticado o mantenerse desacoplada para modo invitado.",
  },
  {
    origen: "cotizacion",
    destino: "item-cotizacion",
    cardinalidad: "1:n",
    descripcion:
      "Los items permiten cotizar productos del catalogo o referencias libres sin obligar compra directa.",
  },
  {
    origen: "configuracion-comercial",
    destino: "pedido",
    cardinalidad: "1:n",
    descripcion:
      "Los pedidos referencian la configuracion comercial vigente para mantener trazabilidad del contexto de venta.",
  },
  {
    origen: "configuracion-comercial",
    destino: "cotizacion",
    cardinalidad: "1:n",
    descripcion:
      "Las cotizaciones tambien deben saber bajo que reglas comerciales fueron creadas.",
  },
] as const;
