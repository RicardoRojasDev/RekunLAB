import Link from "next/link";
import { ContenedorPrincipal } from "@/compartido/componentes/base/contenedor-principal";
import { Etiqueta, Tarjeta } from "@/compartido/componentes/ui";
import { formatearPrecioClp } from "@/compartido/utilidades/formatear-precio-clp";
import type { ResumenPagoPedido } from "../tipos/pagos";
import { AccionesResultadoPago } from "./acciones-resultado-pago";

function formatearFecha(valorISO: string | null) {
  if (!valorISO) {
    return "No disponible";
  }

  return new Intl.DateTimeFormat("es-CL", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(valorISO));
}

function resolverEtiquetaEstado(estado: ResumenPagoPedido["pago"]["estado"]) {
  switch (estado) {
    case "pagado":
      return <Etiqueta variante="primaria">Pagado</Etiqueta>;
    case "pendiente":
      return <Etiqueta variante="premium">Pendiente</Etiqueta>;
    case "fallido":
      return <Etiqueta variante="suave">Fallido</Etiqueta>;
    default:
      return <Etiqueta variante="suave">Sin pago</Etiqueta>;
  }
}

function resolverTextoEstadoPago(estado: ResumenPagoPedido["pago"]["estado"]) {
  switch (estado) {
    case "pagado":
      return "Pagado";
    case "pendiente":
      return "Pendiente";
    case "fallido":
      return "Fallido";
    default:
      return "Sin pago";
  }
}

type PropiedadesPaginaResultadoPago = Readonly<{
  resumen: ResumenPagoPedido | null;
  errorRetorno?: string | null;
}>;

export function PaginaResultadoPago({
  resumen,
  errorRetorno = null,
}: PropiedadesPaginaResultadoPago) {
  if (!resumen) {
    return (
      <section>
        <ContenedorPrincipal claseName="pb-[var(--espacio-2xl)]">
          <Tarjeta
            variante="elevada"
            titulo="No pudimos resolver el resultado del pago"
            descripcion={
              errorRetorno
                ? errorRetorno
                : "No pudimos encontrar el pedido asociado a este resultado. Vuelve al checkout para continuar."
            }
            acciones={
              <Link
                href="/checkout"
                className="boton-base boton-primario min-h-12 px-5 text-sm"
              >
                Volver al checkout
              </Link>
            }
          />
        </ContenedorPrincipal>
      </section>
    );
  }

  return (
    <section aria-labelledby="titulo-resultado-pago">
      <ContenedorPrincipal claseName="flex flex-col gap-[var(--espacio-xl)] pb-[var(--espacio-2xl)]">
        <nav
          aria-label="Ruta de navegacion"
          className="flex flex-wrap items-center gap-2 text-sm text-slate-500"
        >
          <Link href="/" className="hover:text-slate-900">
            Inicio
          </Link>
          <span aria-hidden="true">/</span>
          <Link href="/checkout" className="hover:text-slate-900">
            Checkout
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-slate-900">Resultado del pago</span>
        </nav>

        <header className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Etiqueta variante="premium">Webpay Plus</Etiqueta>
            {resolverEtiquetaEstado(resumen.pago.estado)}
          </div>

          <div className="space-y-3">
            <h1
              id="titulo-resultado-pago"
              className="font-[var(--fuente-titulos)] text-[clamp(2.2rem,5vw,4rem)] font-semibold leading-[0.96] tracking-[-0.05em] text-slate-950"
            >
              Estado del pago
            </h1>
            <p className="max-w-3xl text-base leading-8 text-slate-600 sm:text-[1.05rem]">
              {resumen.mensajeEstado}
            </p>
          </div>
        </header>

        <div className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr] xl:items-start">
          <Tarjeta
            variante="elevada"
            titulo="Resumen del pedido"
            descripcion="Datos consistentes del pedido y su ultimo intento de pago."
          >
            <dl className="grid gap-4 text-sm text-slate-700 sm:grid-cols-2">
              <div className="space-y-1">
                <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Pedido
                </dt>
                <dd className="font-semibold text-slate-950">{resumen.numeroPedido}</dd>
              </div>

              <div className="space-y-1">
                <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Fecha
                </dt>
                <dd>{formatearFecha(resumen.fechaPedidoISO)}</dd>
              </div>

              <div className="space-y-1">
                <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Total
                </dt>
                <dd className="font-semibold text-slate-950">
                  {formatearPrecioClp(resumen.totalIvaIncluido)}
                </dd>
              </div>

              <div className="space-y-1">
                <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Moneda
                </dt>
                <dd>{resumen.monedaCodigo}</dd>
              </div>

              <div className="space-y-1">
                <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Estado del pedido
                </dt>
                <dd>{resumen.estadoPedido}</dd>
              </div>

              <div className="space-y-1">
                <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Estado del pago
                </dt>
                <dd>{resolverTextoEstadoPago(resumen.pago.estado)}</dd>
              </div>

              <div className="space-y-1">
                <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Referencia de pago
                </dt>
                <dd>{resumen.pago.referenciaExterna ?? "No disponible"}</dd>
              </div>

              <div className="space-y-1">
                <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Ultimo cambio
                </dt>
                <dd>
                  {formatearFecha(
                    resumen.pago.pagadoEnISO ?? resumen.pago.fallidoEnISO,
                  )}
                </dd>
              </div>
            </dl>

            {resumen.pago.ultimoError ? (
              <div className="mt-5 rounded-[var(--radio-md)] border border-[color:var(--color-borde)] bg-white/80 p-4 text-sm leading-7 text-slate-700">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Detalle
                </p>
                <p>{resumen.pago.ultimoError}</p>
              </div>
            ) : null}
          </Tarjeta>

          <div className="space-y-6 xl:sticky xl:top-28">
            <Tarjeta
              variante="elevada"
              titulo="Siguiente paso"
              descripcion="Desde aqui puedes continuar segun el resultado real del pago."
            >
              <AccionesResultadoPago
                pedidoId={resumen.pedidoId}
                estadoPago={resumen.pago.estado}
                permiteReintento={resumen.pago.permiteReintento}
              />
            </Tarjeta>
          </div>
        </div>
      </ContenedorPrincipal>
    </section>
  );
}
