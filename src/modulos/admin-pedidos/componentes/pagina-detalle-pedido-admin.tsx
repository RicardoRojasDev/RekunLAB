import Link from "next/link";
import {
  EstadoVacio,
  Etiqueta,
  Tarjeta,
} from "@/compartido/componentes/ui";
import { formatearPrecioClp } from "@/compartido/utilidades/formatear-precio-clp";
import type {
  DetallePedidoAdmin,
  EventoHistorialPedidoAdmin,
  PagoPedidoAdmin,
} from "../tipos/admin-pedidos";

type PropiedadesPaginaDetallePedidoAdmin = Readonly<{
  pedido: DetallePedidoAdmin;
}>;

function formatearFecha(fechaISO: string | null) {
  if (!fechaISO) {
    return "Sin fecha";
  }

  return new Intl.DateTimeFormat("es-CL", {
    dateStyle: "full",
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

function varianteEstadoPago(codigo: PagoPedidoAdmin["estado"]) {
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

function tituloEstadoPago(codigo: PagoPedidoAdmin["estado"]) {
  switch (codigo) {
    case "pagado":
      return "Pago confirmado";
    case "pendiente":
      return "Pago pendiente";
    case "fallido":
      return "Pago fallido";
    default:
      return "Sin pago";
  }
}

function clasesHistorial(evento: EventoHistorialPedidoAdmin["tono"]) {
  if (evento === "exito") {
    return "border-[rgba(14,124,103,0.18)] bg-[rgba(243,251,248,0.96)]";
  }

  if (evento === "alerta") {
    return "border-[rgba(180,78,58,0.18)] bg-[rgba(255,248,246,0.96)]";
  }

  return "border-[color:var(--color-borde)] bg-white/84";
}

export function PaginaDetallePedidoAdmin({
  pedido,
}: PropiedadesPaginaDetallePedidoAdmin) {
  const direccionLinea = pedido.direccion
    ? [pedido.direccion.calle, pedido.direccion.numero].filter(Boolean).join(" ")
    : null;

  return (
    <section className="space-y-6">
      <Tarjeta
        variante="elevada"
        etiqueta={<Etiqueta variante="primaria">Detalle de pedido</Etiqueta>}
        titulo={pedido.numeroPedido}
        descripcion="Vista completa del pedido con contexto de cliente, direccion, items, pago y trazabilidad minima para operacion interna."
        acciones={
          <Link
            href="/admin/pedidos"
            className="boton-base boton-secundario min-h-11 px-4 text-sm"
          >
            Volver al listado
          </Link>
        }
      >
        <div className="flex flex-wrap gap-2">
          <Etiqueta variante={varianteEstadoPedido(pedido.estadoCodigo)}>
            {pedido.estadoNombre}
          </Etiqueta>
          <Etiqueta variante={varianteEstadoPago(pedido.pagoActual.estado)}>
            {tituloEstadoPago(pedido.pagoActual.estado)}
          </Etiqueta>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-[var(--radio-md)] border border-[color:var(--color-borde)] bg-white/82 px-4 py-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Fecha del pedido
            </p>
            <p className="mt-2 text-sm leading-7 text-slate-700">
              {formatearFecha(pedido.creadoEnISO)}
            </p>
          </div>
          <div className="rounded-[var(--radio-md)] border border-[color:var(--color-borde)] bg-white/82 px-4 py-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Cliente
            </p>
            <p className="mt-2 text-sm font-semibold text-slate-950">
              {pedido.nombreCliente} {pedido.apellidoCliente}
            </p>
            <p className="mt-1 text-sm text-slate-600">{pedido.correoCliente}</p>
          </div>
          <div className="rounded-[var(--radio-md)] border border-[color:var(--color-borde)] bg-white/82 px-4 py-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Envio
            </p>
            <p className="mt-2 text-sm leading-7 text-slate-700">
              {[pedido.comuna, pedido.region].filter(Boolean).join(", ") || "Sin direccion"}
            </p>
          </div>
          <div className="rounded-[var(--radio-md)] border border-[color:var(--color-borde)] bg-white/82 px-4 py-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Total
            </p>
            <p className="mt-2 text-xl font-semibold text-slate-950">
              {formatearPrecioClp(pedido.totalIvaIncluido)}
            </p>
          </div>
        </div>
      </Tarjeta>

      <div className="grid gap-4 xl:grid-cols-[0.96fr_1.04fr]">
        <Tarjeta
          etiqueta={<Etiqueta variante="suave">Cliente</Etiqueta>}
          titulo="Datos del comprador"
          descripcion="Snapshot del pedido para mantener trazabilidad aunque el cliente cambie despues."
        >
          <dl className="grid gap-3 text-sm text-slate-700 sm:grid-cols-2">
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Nombre
              </dt>
              <dd className="mt-1">
                {pedido.nombreCliente} {pedido.apellidoCliente}
              </dd>
            </div>
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Correo
              </dt>
              <dd className="mt-1">{pedido.correoCliente}</dd>
            </div>
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Telefono
              </dt>
              <dd className="mt-1">{pedido.telefonoCliente || "No informado"}</dd>
            </div>
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Estado actual
              </dt>
              <dd className="mt-1">{pedido.estadoNombre}</dd>
            </div>
          </dl>
        </Tarjeta>

        <Tarjeta
          etiqueta={<Etiqueta variante="suave">Despacho</Etiqueta>}
          titulo="Direccion de envio"
          descripcion="Direccion efectiva usada durante el checkout."
        >
          {pedido.direccion ? (
            <dl className="grid gap-3 text-sm text-slate-700 sm:grid-cols-2">
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Destinatario
                </dt>
                <dd className="mt-1">
                  {pedido.direccion.nombreDestinatario} {pedido.direccion.apellidoDestinatario}
                </dd>
              </div>
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Telefono
                </dt>
                <dd className="mt-1">
                  {pedido.direccion.telefonoDestinatario || "No informado"}
                </dd>
              </div>
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Calle
                </dt>
                <dd className="mt-1">{direccionLinea}</dd>
              </div>
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Departamento
                </dt>
                <dd className="mt-1">{pedido.direccion.departamento || "No informado"}</dd>
              </div>
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Comuna y region
                </dt>
                <dd className="mt-1">
                  {pedido.direccion.comuna}, {pedido.direccion.region}
                </dd>
              </div>
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Codigo postal
                </dt>
                <dd className="mt-1">{pedido.direccion.codigoPostal || "No informado"}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Referencias
                </dt>
                <dd className="mt-1">{pedido.direccion.referencias || "Sin referencias"}</dd>
              </div>
            </dl>
          ) : (
            <EstadoVacio
              titulo="No hay direccion registrada"
              descripcion="Este pedido no devolvio direccion en la consulta administrativa."
              claseName="min-h-[14rem]"
            />
          )}
        </Tarjeta>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.08fr_0.92fr]">
        <Tarjeta
          etiqueta={<Etiqueta variante="suave">Items</Etiqueta>}
          titulo="Productos comprados"
          descripcion="Snapshot de cada linea del pedido con precio unitario, cantidad y subtotal historico."
        >
          {pedido.items.length ? (
            <div className="space-y-3">
              {pedido.items.map((item) => (
                <article
                  key={item.id}
                  className="rounded-[var(--radio-md)] border border-[color:var(--color-borde)] bg-white/84 px-4 py-4"
                >
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0 flex-1 space-y-2">
                      <div className="flex flex-wrap gap-2">
                        {item.categoriaProducto ? (
                          <Etiqueta variante="suave">{item.categoriaProducto}</Etiqueta>
                        ) : null}
                        {item.tipoProducto ? (
                          <Etiqueta variante="suave">{item.tipoProducto}</Etiqueta>
                        ) : null}
                        {item.marcaProducto ? (
                          <Etiqueta variante="suave">{item.marcaProducto}</Etiqueta>
                        ) : null}
                      </div>

                      <div>
                        <h3 className="text-base font-semibold text-slate-950">
                          {item.nombreCompletoProducto}
                        </h3>
                        {item.nombreProducto !== item.nombreCompletoProducto ? (
                          <p className="mt-1 text-sm text-slate-600">{item.nombreProducto}</p>
                        ) : null}
                        {item.descripcionProducto ? (
                          <p className="mt-2 text-sm leading-7 text-slate-600">
                            {item.descripcionProducto}
                          </p>
                        ) : null}
                      </div>

                      <div className="grid gap-3 text-sm text-slate-600 sm:grid-cols-2 xl:grid-cols-4">
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                            SKU
                          </p>
                          <p className="mt-1">{item.skuSnapshot || "Sin SKU"}</p>
                        </div>
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                            Cantidad
                          </p>
                          <p className="mt-1">{item.cantidad}</p>
                        </div>
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                            Unitario
                          </p>
                          <p className="mt-1">{formatearPrecioClp(item.precioUnitarioCLP)}</p>
                        </div>
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                            Subtotal
                          </p>
                          <p className="mt-1 font-semibold text-slate-950">
                            {formatearPrecioClp(item.subtotalCLP)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <EstadoVacio
              titulo="No hay items en este pedido"
              descripcion="La consulta no devolvio lineas asociadas al pedido."
              claseName="min-h-[14rem]"
            />
          )}
        </Tarjeta>

        <div className="space-y-4">
          <Tarjeta
            etiqueta={<Etiqueta variante="suave">Resumen</Etiqueta>}
            titulo="Totales y estado"
            descripcion="Resumen monetario del pedido y su lectura actual desde pago."
          >
            <dl className="space-y-3 text-sm text-slate-700">
              <div className="flex items-center justify-between gap-4">
                <dt>Subtotal</dt>
                <dd className="font-semibold text-slate-950">
                  {formatearPrecioClp(pedido.subtotalIvaIncluido)}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt>Descuento</dt>
                <dd>{formatearPrecioClp(pedido.descuentoIvaIncluido ?? 0)}</dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt>Envio</dt>
                <dd>{formatearPrecioClp(pedido.costoEnvioIvaIncluido ?? 0)}</dd>
              </div>
              <div className="flex items-center justify-between gap-4 border-t border-[color:var(--color-borde)] pt-3 text-base">
                <dt className="font-semibold text-slate-950">Total</dt>
                <dd className="font-semibold text-slate-950">
                  {formatearPrecioClp(pedido.totalIvaIncluido)}
                </dd>
              </div>
            </dl>

            {pedido.mensajeEstadoPago ? (
              <div className="rounded-[var(--radio-md)] border border-[color:var(--color-borde)] bg-white/84 px-4 py-4 text-sm leading-7 text-slate-600">
                {pedido.mensajeEstadoPago}
              </div>
            ) : null}
          </Tarjeta>

          <Tarjeta
            etiqueta={<Etiqueta variante="suave">Pagos</Etiqueta>}
            titulo="Intentos de pago"
            descripcion="Historial minimo de la pasarela ligado a este pedido."
          >
            {pedido.pagos.length ? (
              <div className="space-y-3">
                {pedido.pagos.map((pago) => (
                  <div
                    key={pago.id}
                    className="rounded-[var(--radio-md)] border border-[color:var(--color-borde)] bg-white/84 px-4 py-4"
                  >
                    <div className="flex flex-wrap gap-2">
                      <Etiqueta variante={varianteEstadoPago(pago.estado)}>
                        {tituloEstadoPago(pago.estado)}
                      </Etiqueta>
                      {pago.intento ? (
                        <Etiqueta variante="suave">Intento {pago.intento}</Etiqueta>
                      ) : null}
                    </div>

                    <dl className="mt-3 grid gap-3 text-sm text-slate-700">
                      <div className="flex items-center justify-between gap-4">
                        <dt>Proveedor</dt>
                        <dd>{pago.proveedor || "No informado"}</dd>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <dt>Creado</dt>
                        <dd>{formatearFecha(pago.creadoEnISO)}</dd>
                      </div>
                      {pago.pagadoEnISO ? (
                        <div className="flex items-center justify-between gap-4">
                          <dt>Confirmado</dt>
                          <dd>{formatearFecha(pago.pagadoEnISO)}</dd>
                        </div>
                      ) : null}
                      {pago.fallidoEnISO ? (
                        <div className="flex items-center justify-between gap-4">
                          <dt>Fallido</dt>
                          <dd>{formatearFecha(pago.fallidoEnISO)}</dd>
                        </div>
                      ) : null}
                      {pago.ultimoError ? (
                        <div className="rounded-[var(--radio-sm)] border border-[rgba(180,78,58,0.16)] bg-[rgba(255,248,246,0.96)] px-3 py-3 text-[color:var(--color-error-700)]">
                          {pago.ultimoError}
                        </div>
                      ) : null}
                    </dl>
                  </div>
                ))}
              </div>
            ) : (
              <EstadoVacio
                titulo="Todavia no hay pagos asociados"
                descripcion="El pedido existe, pero no registra intentos de pago en la consulta administrativa."
                claseName="min-h-[14rem]"
              />
            )}
          </Tarjeta>
        </div>
      </div>

      <Tarjeta
        etiqueta={<Etiqueta variante="suave">Historial</Etiqueta>}
        titulo="Historial minimo necesario"
        descripcion="Linea de tiempo basada en la creacion del pedido, sus intentos de pago y la ultima actualizacion registrada."
      >
        <div className="space-y-3">
          {pedido.historial.map((evento) => (
            <article
              key={evento.id}
              className={`rounded-[var(--radio-md)] border px-4 py-4 ${clasesHistorial(evento.tono)}`}
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-1">
                  <h3 className="text-sm font-semibold text-slate-950">{evento.titulo}</h3>
                  <p className="text-sm leading-7 text-slate-600">{evento.descripcion}</p>
                </div>
                <p className="shrink-0 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                  {formatearFecha(evento.fechaISO)}
                </p>
              </div>
            </article>
          ))}
        </div>
      </Tarjeta>

      {pedido.observacionesCliente ? (
        <Tarjeta
          etiqueta={<Etiqueta variante="suave">Observaciones</Etiqueta>}
          titulo="Mensaje del cliente"
          descripcion="Campo capturado junto al pedido cuando exista informacion adicional."
        >
          <div className="rounded-[var(--radio-md)] border border-[color:var(--color-borde)] bg-white/84 px-4 py-4 text-sm leading-7 text-slate-700">
            {pedido.observacionesCliente}
          </div>
        </Tarjeta>
      ) : null}
    </section>
  );
}
