"use client";

import { useState } from "react";
import type {
  ProductoCatalogo,
  SeleccionVarianteProductoCatalogo,
} from "../tipos/producto-catalogo";
import {
  normalizarSeleccionVariantesProducto,
  obtenerSeleccionInicialVariantesProducto,
  productoTieneVariantes,
  resolverOpcionesDisponiblesVariantesProducto,
  resolverVistaDetalleProducto,
  validarSeleccionVariantesProducto,
} from "../utilidades/variantes-producto-catalogo";

export function useVariantesProducto(producto: ProductoCatalogo) {
  const [seleccion, setSeleccion] = useState<SeleccionVarianteProductoCatalogo>(
    () => obtenerSeleccionInicialVariantesProducto(producto),
  );

  function seleccionarOpcion(codigoAtributo: string, opcionId: string) {
    setSeleccion((seleccionActual) =>
      normalizarSeleccionVariantesProducto(producto, {
        ...seleccionActual,
        [codigoAtributo]: opcionId,
      }),
    );
  }

  const tieneVariantes = productoTieneVariantes(producto);
  const vistaDetalle = resolverVistaDetalleProducto(producto, seleccion);
  const validacion = validarSeleccionVariantesProducto(producto, seleccion);
  const opcionesDisponibles = resolverOpcionesDisponiblesVariantesProducto(
    producto,
    seleccion,
  );

  return {
    configuracionVariantes: producto.configuracionVariantes ?? null,
    tieneVariantes,
    seleccion,
    seleccionarOpcion,
    opcionesDisponibles,
    vistaDetalle,
    validacion,
  };
}
