import Link from "next/link";
import { ContenedorPrincipal } from "@/compartido/componentes/base/contenedor-principal";
import { EstadoVacio } from "@/compartido/componentes/ui";

export default function PaginaNoEncontrada() {
  return (
    <section>
      <ContenedorPrincipal claseName="pb-[var(--espacio-2xl)]">
        <EstadoVacio
          titulo="Pagina no encontrada"
          descripcion="La ruta solicitada no existe o fue movida."
          accion={
            <div className="flex flex-wrap gap-3">
              <Link
                href="/"
                className="boton-base boton-primario min-h-11 px-4 text-sm"
              >
                Ir al inicio
              </Link>
              <Link
                href="/catalogo"
                className="boton-base boton-secundario min-h-11 px-4 text-sm"
              >
                Ver catalogo
              </Link>
            </div>
          }
        />
      </ContenedorPrincipal>
    </section>
  );
}

