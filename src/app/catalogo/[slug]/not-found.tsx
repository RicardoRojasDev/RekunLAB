import Link from "next/link";
import { ContenedorPrincipal } from "@/compartido/componentes/base/contenedor-principal";
import { EstadoVacio } from "@/compartido/componentes/ui";

export default function ProductoNoEncontrado() {
  return (
    <section>
      <ContenedorPrincipal claseName="pb-[var(--espacio-2xl)]">
        <EstadoVacio
          titulo="No encontramos esta ficha de producto"
          descripcion="El producto solicitado no existe, fue desactivado o aun no esta disponible en el catalogo real."
          accion={
            <Link
              href="/catalogo"
              className="boton-base boton-secundario min-h-11 px-4 text-sm"
            >
              Volver al catalogo
            </Link>
          }
        />
      </ContenedorPrincipal>
    </section>
  );
}
