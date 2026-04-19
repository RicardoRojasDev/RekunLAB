"use client";

import { useOptimistic, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type {
  ClaveFiltroCatalogo,
  EstadoFiltrosCatalogo,
  OpcionesPanelFiltrosCatalogo,
} from "../tipos/filtros-catalogo";
import { filtrosCatalogoPorDefecto } from "../tipos/filtros-catalogo";
import {
  depurarFiltrosCatalogoConOpciones,
  normalizarFiltrosCatalogoDesdeQuery,
  serializarFiltrosCatalogoEnQuery,
} from "../utilidades/query-params-catalogo";

type PropiedadesUseFiltrosCatalogo = Readonly<{
  filtrosIniciales: EstadoFiltrosCatalogo;
  opcionesFiltros: OpcionesPanelFiltrosCatalogo;
}>;

export function useFiltrosCatalogo({
  filtrosIniciales,
  opcionesFiltros,
}: PropiedadesUseFiltrosCatalogo) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [sincronizandoUrl, iniciarTransicion] = useTransition();
  const filtrosDesdeUrl = depurarFiltrosCatalogoConOpciones(
    searchParams.size
      ? normalizarFiltrosCatalogoDesdeQuery(searchParams)
      : filtrosIniciales,
    opcionesFiltros,
  );
  const [filtros, establecerFiltrosOptimistas] = useOptimistic(
    filtrosDesdeUrl,
    (
      _estadoActual: EstadoFiltrosCatalogo,
      siguienteEstado: EstadoFiltrosCatalogo,
    ) => siguienteEstado,
  );

  function sincronizarUrl(siguientesFiltros: EstadoFiltrosCatalogo) {
    const querySerializada = serializarFiltrosCatalogoEnQuery(siguientesFiltros);
    const destino = querySerializada ? `${pathname}?${querySerializada}` : pathname;

    iniciarTransicion(() => {
      router.replace(destino, { scroll: false });
    });
  }

  function actualizarFiltro(
    clave: ClaveFiltroCatalogo,
    valor: string,
  ) {
    const siguienteEstado = {
      ...filtros,
      [clave]: valor,
    } as EstadoFiltrosCatalogo;

    const filtrosDepurados = depurarFiltrosCatalogoConOpciones(
      siguienteEstado,
      opcionesFiltros,
    );

    establecerFiltrosOptimistas(filtrosDepurados);
    sincronizarUrl(filtrosDepurados);
  }

  function limpiarFiltro(clave: ClaveFiltroCatalogo) {
    const valorLimpio =
      clave === "orden" ? filtrosCatalogoPorDefecto.orden : "";

    actualizarFiltro(clave, valorLimpio);
  }

  function limpiarFiltros() {
    establecerFiltrosOptimistas(filtrosCatalogoPorDefecto);
    sincronizarUrl(filtrosCatalogoPorDefecto);
  }

  return {
    filtros,
    actualizarFiltro,
    limpiarFiltro,
    limpiarFiltros,
    sincronizandoUrl,
  };
}
