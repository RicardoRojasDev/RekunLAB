"use client";

import { useState } from "react";
import Image from "next/image";
import { Contenedor, Etiqueta } from "@/compartido/componentes/ui";
import { unirClases } from "@/compartido/utilidades/unir-clases";
import type {
  ProductoCatalogo,
  VistaDetalleProductoCatalogo,
} from "../../tipos/producto-catalogo";

type PropiedadesGaleriaProductoDetalle = Readonly<{
  producto: ProductoCatalogo;
  vistaDetalle: VistaDetalleProductoCatalogo;
}>;

export function GaleriaProductoDetalle({
  producto,
  vistaDetalle,
}: PropiedadesGaleriaProductoDetalle) {
  const [indiceImagenActiva, setIndiceImagenActiva] = useState(0);
  const imagenesGaleria = vistaDetalle.imagenesGaleria.length
    ? vistaDetalle.imagenesGaleria
    : [
        {
          ...vistaDetalle.imagen,
          etiqueta: "Vista principal",
        },
      ];
  const imagenActiva =
    imagenesGaleria[indiceImagenActiva] ??
    imagenesGaleria[0] ?? {
      ...vistaDetalle.imagen,
      etiqueta: "Vista principal",
    };

  return (
    <div className="space-y-4 xl:sticky xl:top-28">
      <Contenedor
        etiquetaHtml="div"
        variante="elevado"
        claseName="overflow-hidden p-0"
      >
        <div className="relative aspect-[4/4.45] overflow-hidden bg-[linear-gradient(180deg,rgba(255,255,255,0.9),rgba(237,242,238,0.96))]">
          <Image
            src={imagenActiva.src}
            alt={imagenActiva.alt}
            width={imagenActiva.ancho}
            height={imagenActiva.alto}
            sizes="(min-width: 1280px) 42vw, 100vw"
            className="h-full w-full object-cover"
            style={{ objectPosition: imagenActiva.posicionObjeto ?? "center" }}
            priority
          />

          <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-4">
            <div className="flex flex-wrap gap-2">
              <Etiqueta variante="oscura" tamanio="sm">
                {producto.categoria}
              </Etiqueta>
              {producto.coleccion ? (
                <Etiqueta variante="premium" tamanio="sm">
                  {producto.coleccion}
                </Etiqueta>
              ) : null}
            </div>

            <div className="flex flex-wrap justify-end gap-2">
              <Etiqueta variante="oscura" tamanio="sm">
                {imagenActiva.etiqueta}
              </Etiqueta>
              {vistaDetalle.varianteSeleccionada ? (
                <Etiqueta variante="premium" tamanio="sm">
                  {vistaDetalle.varianteSeleccionada.etiqueta}
                </Etiqueta>
              ) : null}
            </div>
          </div>
        </div>
      </Contenedor>

      <div className="grid gap-3 sm:grid-cols-3">
        {imagenesGaleria.map((imagen, indice) => {
          const estaActiva = indice === indiceImagenActiva;

          return (
            <button
              key={`${producto.id}-${imagen.etiqueta}`}
              type="button"
              onClick={() => setIndiceImagenActiva(indice)}
              className={unirClases(
                "overflow-hidden rounded-[var(--radio-md)] border bg-white/84 text-left transition",
                estaActiva
                  ? "border-[color:var(--color-borde-fuerte)] shadow-[0_16px_38px_rgba(10,22,20,0.12)]"
                  : "border-[color:var(--color-borde)] hover:border-[color:var(--color-borde-fuerte)] hover:bg-white",
              )}
              aria-pressed={estaActiva}
            >
              <div className="relative aspect-[4/3] overflow-hidden border-b border-[color:var(--color-borde)] bg-[color:var(--color-fondo-suave)]">
                <Image
                  src={imagen.src}
                  alt={imagen.alt}
                  width={imagen.ancho}
                  height={imagen.alto}
                  sizes="(min-width: 640px) 18rem, 33vw"
                  className="h-full w-full object-cover"
                  style={{ objectPosition: imagen.posicionObjeto ?? "center" }}
                />
              </div>

              <div className="space-y-1 px-3 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Vista {String(indice + 1).padStart(2, "0")}
                </p>
                <p className="text-sm font-medium text-slate-900">
                  {imagen.etiqueta}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
