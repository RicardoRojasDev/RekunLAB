"use client";

import { Etiqueta, Tarjeta } from "@/compartido/componentes/ui";
import { useVariantesProducto } from "../../hooks/use-variantes-producto";
import type { ProductoCatalogo } from "../../tipos/producto-catalogo";
import { GaleriaProductoDetalle } from "./galeria-producto-detalle";
import { PanelCompraProductoDetalle } from "./panel-compra-producto-detalle";

type PropiedadesExperienciaDetalleProducto = Readonly<{
  producto: ProductoCatalogo;
}>;

export function ExperienciaDetalleProducto({
  producto,
}: PropiedadesExperienciaDetalleProducto) {
  const {
    configuracionVariantes,
    tieneVariantes,
    seleccion,
    seleccionarOpcion,
    opcionesDisponibles,
    vistaDetalle,
    validacion,
  } = useVariantesProducto(producto);

  return (
    <>
      <div className="grid gap-6 xl:grid-cols-[0.94fr_1.06fr] xl:items-start">
        <GaleriaProductoDetalle
          key={vistaDetalle.varianteSeleccionada?.id ?? `${producto.id}-base`}
          producto={producto}
          vistaDetalle={vistaDetalle}
        />
        <PanelCompraProductoDetalle
          producto={producto}
          configuracionVariantes={configuracionVariantes}
          tieneVariantes={tieneVariantes}
          seleccion={seleccion}
          opcionesDisponibles={opcionesDisponibles}
          vistaDetalle={vistaDetalle}
          validacion={validacion}
          alSeleccionarOpcion={seleccionarOpcion}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <Tarjeta
          variante="elevada"
          etiqueta={<Etiqueta variante="primaria">Descripcion</Etiqueta>}
          titulo="Descripcion del producto"
          descripcion={producto.resumen}
        >
          <div className="space-y-4">
            <p className="texto-destacado">{producto.descripcion}</p>

            <div className="flex flex-wrap gap-2">
              <Etiqueta variante="suave">{producto.categoria}</Etiqueta>
              <Etiqueta variante="suave">{producto.tipoProducto}</Etiqueta>
              {producto.coleccion ? (
                <Etiqueta variante="premium">
                  Coleccion {producto.coleccion}
                </Etiqueta>
              ) : null}
              {vistaDetalle.varianteSeleccionada ? (
                <Etiqueta variante="primaria">
                  Variante {vistaDetalle.varianteSeleccionada.etiqueta}
                </Etiqueta>
              ) : null}
            </div>
          </div>
        </Tarjeta>

        <Tarjeta
          variante="base"
          etiqueta={<Etiqueta variante="premium">Especificaciones</Etiqueta>}
          titulo="Ficha tecnica"
          descripcion={
            tieneVariantes
              ? "La ficha se ajusta segun color, peso o formato cuando corresponde."
              : "Informacion clave para evaluar el producto antes de agregarlo al carrito."
          }
        >
          <dl className="grid gap-3">
            {vistaDetalle.especificaciones.map((especificacion) => (
              <div
                key={`${producto.id}-${especificacion.etiqueta}`}
                className="grid gap-1 rounded-[var(--radio-md)] border border-[color:var(--color-borde)] bg-white/76 px-4 py-4"
              >
                <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  {especificacion.etiqueta}
                </dt>
                <dd className="text-sm leading-7 text-slate-800">
                  {especificacion.valor}
                </dd>
              </div>
            ))}
          </dl>
        </Tarjeta>
      </div>
    </>
  );
}
