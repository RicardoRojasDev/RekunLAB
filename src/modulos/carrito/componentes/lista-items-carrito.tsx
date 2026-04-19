import type { ItemCarrito } from "../tipos/carrito";
import { LineaItemCarrito } from "./linea-item-carrito";

type ModoListaItemsCarrito = "pagina" | "drawer";

type PropiedadesListaItemsCarrito = Readonly<{
  items: readonly ItemCarrito[];
  modo?: ModoListaItemsCarrito;
  alNavegar?: () => void;
}>;

export function ListaItemsCarrito({
  items,
  modo = "pagina",
  alNavegar,
}: PropiedadesListaItemsCarrito) {
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <LineaItemCarrito
          key={item.idLinea}
          item={item}
          modo={modo}
          alNavegar={alNavegar}
        />
      ))}
    </div>
  );
}
