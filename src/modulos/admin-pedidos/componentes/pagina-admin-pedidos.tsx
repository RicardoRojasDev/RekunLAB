"use client";

import Link from "next/link";
import { useDeferredValue, useState } from "react";
import {
  CampoTexto,
  EstadoVacio,
  Etiqueta,
  Selector,
  Tarjeta,
} from "@/compartido/componentes/ui";
import { formatearPrecioClp } from "@/compartido/utilidades/formatear-precio-clp";
import type {
  EstadoPedidoAdmin,
  ResumenPedidoAdmin,
} from "../tipos/admin-pedidos";

type PropiedadesPaginaAdminPedidos = Readonly<{
  pedidos: readonly ResumenPedidoAdmin[];
  estadosPedido: readonly EstadoPedidoAdmin[];
}>;

function formatearFecha(fechaISO: string | null) {
  if (!fechaISO) {
    return "Sin fecha";
  }

  return new Intl.DateTimeFormat("es-CL", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "America/Santiago",
  }).format(new Date(fechaISO));
}

function varianteEstadoPedido(codigo: string) {
  if (codigo === "pagado") {
    return "premium";
  }

  if (codigo === "pago-fallido") {
    return "critica";
  }

  if (codigo === "creado") {
    return "primaria";
  }

  return "suave";
}

function varianteEstadoPago(codigo: string) {
  if (codigo === "pagado") {
    return "premium";
  }

  if (codigo === "fallido") {
    return "critica";
  }

  if (codigo === "pendiente") {
    return "primaria";
  }

  return "suave";
}

function etiquetaEstadoPago(codigo: ResumenPedidoAdmin["pagoActual"]["estado"]) {
  switch (codigo) {
    case "pendiente":
      return "Pago pendiente";
    case "pagado":
      return "Pago confirmado";
    case "fallido":
      return "Pago fallido";
    default:
      return "Sin pago";
  }
}

function contarPedidosPorEstado(
  pedidos: readonly ResumenPedidoAdmin[],
  estadoCodigo: string,
) {
  return pedidos.filter((pedido) => pedido.estadoCodigo === estadoCodigo).length;
}

export function PaginaAdminPedidos({
  pedidos,
  estadosPedido,
}: PropiedadesPaginaAdminPedidos) {
  const [busqueda, setBusqueda] = useState("");
  const [estadoSeleccionado, setEstadoSeleccionado] = useState("");
  const [estadoPagoSeleccionado, setEstadoPagoSeleccionado] = useState("");
  const busquedaDiferida = useDeferredValue(busqueda);

  const pedidosFiltrados = pedidos.filter((pedido) => {
    const termino = busquedaDiferida.trim().toLowerCase();
    const coincideBusqueda =
      !termino ||
      [
        pedido.numeroPedido,
        pedido.nombreCliente,
        pedido.apellidoCliente,
        pedido.correoCliente,
        pedido.comuna ?? "",
        pedido.region ?? "",
      ].some((valor) => valor.toLowerCase().includes(termino));

    if (!coincideBusqueda) {
      return false;
    }

    if (estadoSeleccionado && pedido.estadoCodigo !== estadoSeleccionado) {
      return false;
    }

    if (estadoPagoSeleccionado && pedido.pagoActual.estado !== estadoPagoSeleccionado) {
      return false;
    }

    return true;
  });

  return (
    <section className="space-y-6">
      <Tarjeta
        variante="elevada"
        etiqueta={<Etiqueta variante="primaria">Modulo 21</Etiqueta>}
        titulo="Administracion de pedidos"
        descripcion="Vista operativa para revisar pedidos, su contexto de cliente, el estado comercial y el estado del pago sin salir del backoffice."
      >
        <div className="grid gap-3 md:grid-cols-4">
          <div className="rounded-[var(--radio-md)] border border-[color:var(--color-borde)] bg-white/84 px-4 py-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Total
            </p>
            <p className="mt-2 text-2xl font-semibold text-slate-950">{pedidos.length}</p>
          </div>
          <div className="rounded-[var(--radio-md)] border border-[color:var(--color-borde)] bg-white/84 px-4 py-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Creados
            </p>
            <p className="mt-2 text-2xl font-semibold text-slate-950">
              {contarPedidosPorEstado(pedidos, "creado")}
            </p>
          </div>
          <div className="rounded-[var(--radio-md)] border border-[color:var(--color-borde)] bg-white/84 px-4 py-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Pagados
            </p>
            <p className="mt-2 text-2xl font-semibold text-slate-950">
              {contarPedidosPorEstado(pedidos, "pagado")}
            </p>
          </div>
          <div className="rounded-[var(--radio-md)] border border-[color:var(--color-borde)] bg-white/84 px-4 py-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Pago fallido
            </p>
            <p className="mt-2 text-2xl font-semibold text-slate-950">
              {contarPedidosPorEstado(pedidos, "pago-fallido")}
            </p>
          </div>
        </div>
      </Tarjeta>

      <Tarjeta
        etiqueta={<Etiqueta variante="suave">Listado</Etiqueta>}
        titulo="Pedidos del ecommerce"
        descripcion="Filtra por cliente, numero de pedido, estado del pedido o estado del pago para revisar la operacion diaria."
      >
        <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr_0.8fr]">
          <CampoTexto
            etiqueta="Busqueda"
            placeholder="Numero de pedido, cliente, correo o comuna"
            value={busqueda}
            onChange={(evento) => setBusqueda(evento.target.value)}
          />

          <Selector
            etiqueta="Estado del pedido"
            placeholder="Todos los estados"
            opciones={estadosPedido.map((estado) => ({
              valor: estado.codigo,
              etiqueta: estado.nombre,
            }))}
            value={estadoSeleccionado}
            onChange={(evento) => setEstadoSeleccionado(evento.target.value)}
          />

          <Selector
            etiqueta="Estado del pago"
            placeholder="Todos los estados"
            opciones={[
              { valor: "sin-pago", etiqueta: "Sin pago" },
              { valor: "pendiente", etiqueta: "Pendiente" },
              { valor: "pagado", etiqueta: "Pagado" },
              { valor: "fallido", etiqueta: "Fallido" },
            ]}
            value={estadoPagoSeleccionado}
            onChange={(evento) => setEstadoPagoSeleccionado(evento.target.value)}
          />
        </div>

        {pedidosFiltrados.length ? (
          <div className="space-y-3">
            {pedidosFiltrados.map((pedido) => (
              <article
                key={pedido.id}
                className="rounded-[var(--radio-lg)] border border-[color:var(--color-borde)] bg-white/86 px-4 py-4 shadow-[var(--sombra-suave)]"
              >
                <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                  <div className="min-w-0 flex-1 space-y-3">
                    <div className="flex flex-wrap gap-2">
                      <Etiqueta variante={varianteEstadoPedido(pedido.estadoCodigo)}>
                        {pedido.estadoNombre}
                      </Etiqueta>
                      <Etiqueta variante={varianteEstadoPago(pedido.pagoActual.estado)}>
                        {etiquetaEstadoPago(pedido.pagoActual.estado)}
                      </Etiqueta>
                      <Etiqueta variante="suave">
                        {pedido.totalItems} {pedido.totalItems === 1 ? "item" : "items"}
                      </Etiqueta>
                    </div>

                    <div className="space-y-1">
                      <h2 className="text-lg font-semibold text-slate-950">
                        {pedido.numeroPedido}
                      </h2>
                      <p className="text-sm leading-7 text-slate-600">
                        {pedido.nombreCliente} {pedido.apellidoCliente} - {pedido.correoCliente}
                      </p>
                    </div>

                    <div className="grid gap-3 text-sm text-slate-600 md:grid-cols-2 xl:grid-cols-4">
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                          Fecha
                        </p>
                        <p className="mt-1">{formatearFecha(pedido.creadoEnISO)}</p>
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                          Envio
                        </p>
                        <p className="mt-1">
                          {[pedido.comuna, pedido.region].filter(Boolean).join(", ") || "Sin direccion"}
                        </p>
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                          Pago
                        </p>
                        <p className="mt-1">
                          {pedido.pagoActual.intento
                            ? `Intento ${pedido.pagoActual.intento}`
                            : "Sin intentos"}
                        </p>
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                          Total
                        </p>
                        <p className="mt-1 font-semibold text-slate-950">
                          {formatearPrecioClp(pedido.totalIvaIncluido)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 xl:justify-end">
                    <Link
                      href={`/admin/pedidos/${pedido.id}`}
                      className="boton-base boton-primario min-h-11 px-4 text-sm"
                    >
                      Ver detalle
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <EstadoVacio
            titulo="No hay pedidos para este filtro"
            descripcion="Ajusta la busqueda o los selectores para volver a ver pedidos del ecommerce."
            accion={
              <button
                type="button"
                className="boton-base boton-secundario min-h-11 px-4 text-sm"
                onClick={() => {
                  setBusqueda("");
                  setEstadoSeleccionado("");
                  setEstadoPagoSeleccionado("");
                }}
              >
                Limpiar filtros
              </button>
            }
            claseName="min-h-[18rem]"
          />
        )}
      </Tarjeta>
    </section>
  );
}
