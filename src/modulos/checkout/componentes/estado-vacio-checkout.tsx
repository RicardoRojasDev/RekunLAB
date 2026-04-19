import Link from "next/link";
import { EstadoVacio } from "@/compartido/componentes/ui";

export function EstadoVacioCheckout() {
  return (
    <EstadoVacio
      titulo="No hay productos para finalizar"
      descripcion="Tu carrito esta vacio. Agrega productos desde el catalogo para continuar al checkout."
      accion={
        <Link
          href="/catalogo"
          className="boton-base boton-primario min-h-11 px-4 text-sm"
        >
          Ir al catalogo
        </Link>
      }
    />
  );
}

