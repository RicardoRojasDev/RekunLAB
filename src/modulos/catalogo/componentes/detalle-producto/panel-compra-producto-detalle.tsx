"use client";

import { useState } from "react";
import { Boton, Contenedor, Etiqueta } from "@/compartido/componentes/ui";
import { formatearPrecioClp } from "@/compartido/utilidades/formatear-precio-clp";
import type { ProductoCatalogo } from "../../tipos/producto-catalogo";
import { BloqueConfianzaComercialProducto } from "./bloque-confianza-comercial-producto";
import { SelectorCantidadProducto } from "./selector-cantidad-producto";

type PropiedadesPanelCompraProductoDetalle = Readonly<{
  producto: ProductoCatalogo;
}>;

function resolverEtiquetaUnidades(cantidad: number) {
  return cantidad === 1 ? "unidad" : "unidades";
}

export function PanelCompraProductoDetalle({
  producto,
}: PropiedadesPanelCompraProductoDetalle) {
  const [cantidad, setCantidad] = useState(1);
  const [ultimaCantidadAgregada, setUltimaCantidadAgregada] = useState<number | null>(
    null,
  );

  function agregarSeleccionLocal() {
    setUltimaCantidadAgregada(cantidad);
  }

  return (
    <aside className="space-y-4 xl:sticky xl:top-28">
      <Contenedor etiquetaHtml="section" variante="elevado" relleno="lg">
        <div className="space-y-6">
          <div className="flex flex-wrap gap-2">
            <Etiqueta variante="primaria">{producto.categoria}</Etiqueta>
            <Etiqueta variante="suave">{producto.tipoProducto}</Etiqueta>
            {producto.coleccion ? (
              <Etiqueta variante="premium">Coleccion {producto.coleccion}</Etiqueta>
            ) : null}
          </div>

          <div className="space-y-4">
            <h1
              id="titulo-detalle-producto"
              className="font-[var(--fuente-titulos)] text-[clamp(2.25rem,4vw,3.7rem)] font-semibold leading-[0.96] tracking-[-0.05em] text-slate-950"
            >
              {producto.nombre}
            </h1>

            <p className="text-base leading-8 text-slate-600 sm:text-[1.05rem]">
              {producto.resumen}
            </p>
          </div>

          <div className="space-y-2 rounded-[var(--radio-lg)] border border-[color:var(--color-borde)] bg-white/82 px-5 py-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Precio final
            </p>
            <p className="font-[var(--fuente-titulos)] text-[clamp(2.1rem,4vw,3rem)] font-semibold leading-none tracking-[-0.06em] text-slate-950">
              {formatearPrecioClp(producto.precioIvaIncluido)}
            </p>
            <p className="text-sm text-slate-500">IVA incluido</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {producto.etiquetasComerciales.map((etiqueta) => (
              <Etiqueta key={`${producto.id}-${etiqueta}`} variante="suave">
                {etiqueta}
              </Etiqueta>
            ))}
          </div>

          <Contenedor variante="base">
            <div className="space-y-5">
              <div className="grid gap-4 md:grid-cols-[minmax(0,11rem)_1fr] md:items-end">
                <SelectorCantidadProducto
                  cantidad={cantidad}
                  alCambiarCantidad={setCantidad}
                />

                <Boton
                  bloque
                  tamanio="lg"
                  onClick={agregarSeleccionLocal}
                  inicio={
                    <span aria-hidden="true" className="text-base">
                      +
                    </span>
                  }
                >
                  Agregar al carrito
                </Boton>
              </div>

              <p className="text-xs leading-6 text-slate-500">
                La accion se mantiene local en esta etapa para validar la UX de
                compra. No crea pedidos ni persiste un carrito global todavia.
              </p>

              <div aria-live="polite" className="min-h-6">
                {ultimaCantidadAgregada ? (
                  <p className="text-sm font-medium text-[color:var(--color-primario-700)]">
                    {ultimaCantidadAgregada} {resolverEtiquetaUnidades(ultimaCantidadAgregada)}{" "}
                    agregadas a la seleccion local.
                  </p>
                ) : null}
              </div>
            </div>
          </Contenedor>
        </div>
      </Contenedor>

      <BloqueConfianzaComercialProducto />
    </aside>
  );
}
