import Link from "next/link";
import { Etiqueta } from "@/compartido/componentes/ui";
import type { ProductoRelacionadoCatalogo } from "../../tipos/producto-catalogo";
import { TarjetaProductoCatalogo } from "../tarjeta-producto-catalogo";

type PropiedadesProductosRelacionadosDetalle = Readonly<{
  productos: readonly ProductoRelacionadoCatalogo[];
}>;

export function ProductosRelacionadosDetalle({
  productos,
}: PropiedadesProductosRelacionadosDetalle) {
  if (!productos.length) {
    return null;
  }

  return (
    <section aria-labelledby="titulo-productos-relacionados" className="space-y-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-3">
          <Etiqueta variante="primaria">Relacionados</Etiqueta>
          <div className="space-y-2">
            <h2
              id="titulo-productos-relacionados"
              className="titulo-seccion text-slate-950"
            >
              Otras opciones para seguir explorando
            </h2>
            <p className="texto-soporte max-w-3xl">
              Productos del mismo universo comercial para comparar alternativas
              sin salir del recorrido de compra.
            </p>
          </div>
        </div>

        <Link
          href="/catalogo"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 transition-colors hover:text-slate-950"
        >
          Volver al catalogo
          <span aria-hidden="true">/</span>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
        {productos.map((producto) => (
          <TarjetaProductoCatalogo key={producto.id} producto={producto} />
        ))}
      </div>
    </section>
  );
}
