import type {
  EntradaAgregarItemCarrito,
  ItemCarrito,
  ResumenCarrito,
} from "../tipos/carrito";

export function sanearCantidadItemCarrito(cantidad: number) {
  if (!Number.isFinite(cantidad)) {
    return 1;
  }

  return Math.max(1, Math.floor(cantidad));
}

export function crearIdLineaCarrito(
  entrada: Pick<EntradaAgregarItemCarrito, "productoId" | "variante">,
) {
  return `${entrada.productoId}::${entrada.variante?.id ?? "base"}`;
}

function crearItemCarrito(entrada: EntradaAgregarItemCarrito): ItemCarrito {
  const cantidad = sanearCantidadItemCarrito(entrada.cantidad);

  return {
    ...entrada,
    cantidad,
    idLinea: crearIdLineaCarrito(entrada),
  };
}

export function agregarItemCarrito(
  itemsActuales: readonly ItemCarrito[],
  entrada: EntradaAgregarItemCarrito,
) {
  const itemNuevo = crearItemCarrito(entrada);
  const indiceExistente = itemsActuales.findIndex(
    (item) => item.idLinea === itemNuevo.idLinea,
  );

  if (indiceExistente === -1) {
    return [...itemsActuales, itemNuevo];
  }

  return itemsActuales.map((item, indice) => {
    if (indice !== indiceExistente) {
      return item;
    }

    return {
      ...itemNuevo,
      cantidad: item.cantidad + itemNuevo.cantidad,
    };
  });
}

export function actualizarCantidadItemCarrito(
  itemsActuales: readonly ItemCarrito[],
  idLinea: string,
  cantidad: number,
) {
  const cantidadSanitizada = sanearCantidadItemCarrito(cantidad);

  return itemsActuales.map((item) =>
    item.idLinea === idLinea ? { ...item, cantidad: cantidadSanitizada } : item,
  );
}

export function eliminarItemCarrito(
  itemsActuales: readonly ItemCarrito[],
  idLinea: string,
) {
  return itemsActuales.filter((item) => item.idLinea !== idLinea);
}

export function calcularMontoLineaItemCarrito(
  item: Pick<ItemCarrito, "cantidad" | "precioUnitarioIvaIncluido">,
) {
  return item.cantidad * item.precioUnitarioIvaIncluido;
}

export function calcularResumenCarrito(
  itemsActuales: readonly ItemCarrito[],
): ResumenCarrito {
  return itemsActuales.reduce<ResumenCarrito>(
    (acumulador, item) => ({
      cantidadLineas: acumulador.cantidadLineas + 1,
      cantidadUnidades: acumulador.cantidadUnidades + item.cantidad,
      subtotalIvaIncluido:
        acumulador.subtotalIvaIncluido + calcularMontoLineaItemCarrito(item),
    }),
    {
      cantidadLineas: 0,
      cantidadUnidades: 0,
      subtotalIvaIncluido: 0,
    },
  );
}
