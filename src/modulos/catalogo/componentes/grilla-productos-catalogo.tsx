import { Boton, Etiqueta } from "@/compartido/componentes/ui";
import type { ProductoCatalogo } from "../tipos/producto-catalogo";
import { EstadoVacioCatalogo } from "./estado-vacio-catalogo";
import { TarjetaProductoCatalogo } from "./tarjeta-producto-catalogo";

type PropiedadesGrillaProductosCatalogo = Readonly<{
  productos: readonly ProductoCatalogo[];
  cantidadColecciones: number;
  cantidadProductosTotales: number;
  cantidadFiltrosActivos: number;
  alLimpiarFiltros: () => void;
}>;

export function GrillaProductosCatalogo({
  productos,
  cantidadColecciones,
  cantidadProductosTotales,
  cantidadFiltrosActivos,
  alLimpiarFiltros,
}: PropiedadesGrillaProductosCatalogo) {
  if (!productos.length) {
    return (
      <EstadoVacioCatalogo
        titulo="No encontramos productos con esta combinacion de filtros"
        descripcion="Ajusta la categoria, la coleccion o el tipo de producto para volver a recorrer el catalogo."
        accion={
          cantidadFiltrosActivos > 0 ? (
            <Boton variante="secundario" onClick={alLimpiarFiltros}>
              Limpiar filtros
            </Boton>
          ) : undefined
        }
      />
    );
  }

  return (
    <section aria-labelledby="titulo-grilla-catalogo" className="space-y-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-3">
          <Etiqueta variante="suave">Resultados</Etiqueta>
          <div className="space-y-2">
            <h2 id="titulo-grilla-catalogo" className="titulo-seccion text-slate-950">
              Productos disponibles
            </h2>
            <p className="texto-soporte max-w-3xl">
              {cantidadFiltrosActivos > 0
                ? `Mostrando ${productos.length} de ${cantidadProductosTotales} productos segun la seleccion activa.`
                : "Explora productos con informacion clara: categoria, precio final con IVA incluido y acceso al detalle."}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Etiqueta variante="primaria">{productos.length} productos</Etiqueta>
          <Etiqueta variante="premium">{cantidadColecciones} colecciones</Etiqueta>
          {cantidadFiltrosActivos > 0 ? (
            <Etiqueta variante="suave">{cantidadFiltrosActivos} activos</Etiqueta>
          ) : null}
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
