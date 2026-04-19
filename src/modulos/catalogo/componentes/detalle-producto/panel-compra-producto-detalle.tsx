"use client";

import { useState } from "react";
import { Boton, Contenedor, Etiqueta } from "@/compartido/componentes/ui";
import { formatearPrecioClp } from "@/compartido/utilidades/formatear-precio-clp";
import { useCarrito } from "@/modulos/carrito";
import type { SeleccionVarianteItemCarrito } from "@/modulos/carrito";
import type {
  ConfiguracionVariantesProductoCatalogo,
  EstadoValidacionVariantesProductoCatalogo,
  MapaOpcionesDisponiblesVariantesProductoCatalogo,
  ProductoCatalogo,
  SeleccionVarianteProductoCatalogo,
  VistaDetalleProductoCatalogo,
} from "../../tipos/producto-catalogo";
import { BloqueConfianzaComercialProducto } from "./bloque-confianza-comercial-producto";
import { SelectorVariantesProducto } from "./selector-variantes-producto";
import { SelectorCantidadProducto } from "./selector-cantidad-producto";

type PropiedadesPanelCompraProductoDetalle = Readonly<{
  producto: ProductoCatalogo;
  configuracionVariantes: ConfiguracionVariantesProductoCatalogo | null;
  tieneVariantes: boolean;
  seleccion: SeleccionVarianteProductoCatalogo;
  opcionesDisponibles: MapaOpcionesDisponiblesVariantesProductoCatalogo;
  vistaDetalle: VistaDetalleProductoCatalogo;
  validacion: EstadoValidacionVariantesProductoCatalogo;
  alSeleccionarOpcion: (codigoAtributo: string, opcionId: string) => void;
}>;

function resolverEtiquetaUnidades(cantidad: number) {
  return cantidad === 1 ? "unidad" : "unidades";
}

function resolverSeleccionesVarianteParaCarrito(
  configuracionVariantes: ConfiguracionVariantesProductoCatalogo | null,
  vistaDetalle: VistaDetalleProductoCatalogo,
): readonly SeleccionVarianteItemCarrito[] {
  if (!configuracionVariantes || !vistaDetalle.varianteSeleccionada) {
    return [];
  }

  return configuracionVariantes.atributos
    .map((atributo) => {
      const opcionId = vistaDetalle.varianteSeleccionada?.selecciones[atributo.codigo];
      const opcion = atributo.opciones.find((item) => item.id === opcionId);

      if (!opcionId || !opcion) {
        return null;
      }

      return {
        codigoAtributo: atributo.codigo,
        etiquetaAtributo: atributo.etiqueta,
        opcionId,
        etiquetaOpcion: opcion.etiqueta,
        valorOpcion: opcion.valor,
      };
    })
    .filter((seleccion): seleccion is SeleccionVarianteItemCarrito => Boolean(seleccion));
}

export function PanelCompraProductoDetalle({
  producto,
  configuracionVariantes,
  tieneVariantes,
  seleccion,
  opcionesDisponibles,
  vistaDetalle,
  validacion,
  alSeleccionarOpcion,
}: PropiedadesPanelCompraProductoDetalle) {
  const { agregarItem } = useCarrito();
  const [cantidad, setCantidad] = useState(1);
  const [ultimaCantidadAgregada, setUltimaCantidadAgregada] = useState<number | null>(
    null,
  );
  const [mensajeErrorVariante, setMensajeErrorVariante] = useState<string | null>(
    null,
  );

  function manejarSeleccionVariante(codigoAtributo: string, opcionId: string) {
    setMensajeErrorVariante(null);
    alSeleccionarOpcion(codigoAtributo, opcionId);
  }

  function agregarSeleccionLocal() {
    if (!validacion.esValida) {
      setMensajeErrorVariante(
        validacion.mensaje ?? "Selecciona una variante valida para continuar.",
      );
      setUltimaCantidadAgregada(null);
      return;
    }

    const seleccionesVariante = resolverSeleccionesVarianteParaCarrito(
      configuracionVariantes,
      vistaDetalle,
    );

    agregarItem(
      {
        productoId: producto.id,
        slug: producto.slug,
        nombre: producto.nombre,
        resumen: producto.resumen,
        categoria: producto.categoria,
        tipoProducto: producto.tipoProducto,
        coleccion: producto.coleccion,
        imagen: vistaDetalle.imagen,
        precioUnitarioIvaIncluido: vistaDetalle.precioIvaIncluido,
        cantidad,
        etiquetasComerciales: producto.etiquetasComerciales,
        variante: vistaDetalle.varianteSeleccionada
          ? {
              id: vistaDetalle.varianteSeleccionada.id,
              etiqueta: vistaDetalle.varianteSeleccionada.etiqueta,
              codigoReferencia: vistaDetalle.varianteSeleccionada.codigoReferencia,
              selecciones: seleccionesVariante,
            }
          : null,
      },
      {
        abrirDrawer: true,
      },
    );

    setMensajeErrorVariante(null);
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
              {formatearPrecioClp(vistaDetalle.precioIvaIncluido)}
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

          {tieneVariantes && configuracionVariantes ? (
            <Contenedor variante="base">
              <div className="space-y-5">
                <div className="space-y-2">
                  <Etiqueta variante="primaria">Variantes</Etiqueta>
                  <h2 className="text-xl font-semibold text-slate-950">
                    Selecciona color, peso o formato segun corresponda
                  </h2>
                  <p className="text-sm leading-7 text-slate-600">
                    La estructura ya admite atributos futuros sin convertir cada
                    combinacion en un producto separado.
                  </p>
                </div>

                <SelectorVariantesProducto
                  configuracionVariantes={configuracionVariantes}
                  seleccion={seleccion}
                  opcionesDisponibles={opcionesDisponibles}
                  alSeleccionarOpcion={manejarSeleccionVariante}
                />

                <div
                  className="rounded-[var(--radio-md)] border border-[color:var(--color-borde)] bg-white/76 px-4 py-4"
                  aria-live="polite"
                >
                  {mensajeErrorVariante ? (
                    <p className="text-sm font-medium text-[color:var(--color-error-600)]">
                      {mensajeErrorVariante}
                    </p>
                  ) : vistaDetalle.varianteSeleccionada ? (
                    <div className="space-y-1">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                        Variante validada
                      </p>
                      <p className="text-sm font-semibold text-slate-900">
                        {vistaDetalle.varianteSeleccionada.etiqueta}
                      </p>
                      <p className="text-xs text-slate-500">
                        Codigo referencia {vistaDetalle.varianteSeleccionada.codigoReferencia}
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500">
                      Selecciona una combinacion valida para continuar.
                    </p>
                  )}
                </div>
              </div>
            </Contenedor>
          ) : null}

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
                  disabled={tieneVariantes && !validacion.esValida}
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
                El carrito ya persiste en este dispositivo para validar la UX de
                compra. Todavia no crea pedidos ni avanza al checkout.
              </p>

              <div aria-live="polite" className="min-h-6">
                {ultimaCantidadAgregada ? (
                  <p className="text-sm font-medium text-[color:var(--color-primario-700)]">
                    {ultimaCantidadAgregada} {resolverEtiquetaUnidades(ultimaCantidadAgregada)}{" "}
                    agregadas al carrito
                    {vistaDetalle.varianteSeleccionada
                      ? ` (${vistaDetalle.varianteSeleccionada.etiqueta}).`
                      : "."}
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
