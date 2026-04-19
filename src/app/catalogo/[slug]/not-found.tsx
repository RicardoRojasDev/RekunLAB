import Link from "next/link";
import { ContenedorPrincipal } from "@/compartido/componentes/base/contenedor-principal";
import { EstadoVacio } from "@/compartido/componentes/ui";

export default function ProductoNoEncontrado() {
  return (
    <section>
      <ContenedorPrincipal claseName="pb-[var(--espacio-2xl)]">
        <EstadoVacio
          titulo="No encontramos esta ficha de producto"
          descripcion="El slug solicitado no existe en la capa mock actual del catalogo. Puedes volver al listado y seguir explorando desde ahi."
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
