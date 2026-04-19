import { Etiqueta } from "@/compartido/componentes/ui/etiqueta";
import type { ProductoCatalogo } from "../tipos/producto-catalogo";
import { EstadoVacioCatalogo } from "./estado-vacio-catalogo";
import { TarjetaProductoCatalogo } from "./tarjeta-producto-catalogo";

type PropiedadesGrillaProductosCatalogo = Readonly<{
  productos: readonly ProductoCatalogo[];
  cantidadColecciones: number;
}>;

export function GrillaProductosCatalogo({
  productos,
  cantidadColecciones,
}: PropiedadesGrillaProductosCatalogo) {
  if (!productos.length) {
    return <EstadoVacioCatalogo />;
  }

  return (
    <section aria-labelledby="titulo-grilla-catalogo" className="space-y-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-3">
          <Etiqueta variante="suave">Seleccion actual</Etiqueta>
          <div className="space-y-2">
            <h2 id="titulo-grilla-catalogo" className="titulo-seccion text-slate-950">
              Catalogo visual reusable y preparado para evolucionar por dominio
            </h2>
            <p className="texto-soporte max-w-3xl">
              Cada tarjeta expone imagen, nombre, categoria, coleccion, precio
              final y etiquetas comerciales sin mezclar todavia filtros,
              detalle completo ni carrito funcional.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Etiqueta variante="primaria">{productos.length} productos</Etiqueta>
          <Etiqueta variante="premium">{cantidadColecciones} colecciones</Etiqueta>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
        {productos.map((producto) => (
          <TarjetaProductoCatalogo key={producto.id} producto={producto} />
        ))}
      </div>
    </section>
  );
}
