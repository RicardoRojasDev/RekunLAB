"use client";

import type { FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ContenedorPrincipal } from "@/compartido/componentes/base/contenedor-principal";
import { Etiqueta, MensajeError } from "@/compartido/componentes/ui";
import { formatearPrecioClp } from "@/compartido/utilidades/formatear-precio-clp";
import { useAutenticacion } from "@/modulos/autenticacion";
import { useCarrito } from "@/modulos/carrito";
import type {
  RespuestaApiCrearPedido,
  ResultadoCrearPedido,
  SolicitudCrearPedido,
} from "@/modulos/pedidos";
import type { RespuestaApiCrearIntencionPago } from "@/modulos/pagos";
import { redireccionarAWebpayPlus } from "@/modulos/pagos/utilidades/redireccionar-webpay-plus";
import { useFormularioCheckout } from "../hooks/use-formulario-checkout";
import { BloqueConfianzaCheckout } from "./bloque-confianza-checkout";
import { CheckoutCargando } from "./checkout-cargando";
import { EstadoVacioCheckout } from "./estado-vacio-checkout";
import { ResumenCheckout } from "./resumen-checkout";
import {
  SeccionDatosClienteCheckout,
  idsCamposDatosClienteCheckout,
} from "./seccion-datos-cliente-checkout";
import {
  SeccionDireccionEnvioCheckout,
  idsCamposDireccionEnvioCheckout,
} from "./seccion-direccion-envio-checkout";
import { SeccionIdentificacionCheckout } from "./seccion-identificacion-checkout";

function enfocarPrimerError(checkout: ReturnType<typeof useFormularioCheckout>) {
  const { errores } = checkout;

  const ordenIds = [
    [idsCamposDatosClienteCheckout.nombre, errores.datosCliente.nombre],
    [idsCamposDatosClienteCheckout.apellido, errores.datosCliente.apellido],
    [idsCamposDatosClienteCheckout.correo, errores.datosCliente.correo],
    [idsCamposDatosClienteCheckout.telefono, errores.datosCliente.telefono],
    [idsCamposDireccionEnvioCheckout.region, errores.direccionEnvio.region],
    [idsCamposDireccionEnvioCheckout.comuna, errores.direccionEnvio.comuna],
    [idsCamposDireccionEnvioCheckout.calle, errores.direccionEnvio.calle],
    [idsCamposDireccionEnvioCheckout.numero, errores.direccionEnvio.numero],
  ] as const;

  const idCampo = ordenIds.find(([, error]) => Boolean(error))?.[0];

  if (!idCampo) {
    return;
  }

  const elemento = document.getElementById(idCampo);

  if (elemento instanceof HTMLElement) {
    elemento.focus();
  }
}

export function PaginaCheckoutVisual() {
  const { hidratado, items, resumen } = useCarrito();
  const { esAutenticado, usuario } = useAutenticacion();
  const checkout = useFormularioCheckout();
  const { actualizarModoCheckout, hidratarDatosClienteDesdeSesion } = checkout;
  const [errorEnvio, setErrorEnvio] = useState<string | null>(null);
  const [pedidoPendientePago, setPedidoPendientePago] =
    useState<ResultadoCrearPedido | null>(null);
  const [cantidadUnidadesPedido, setCantidadUnidadesPedido] = useState(0);
  const [preparandoPago, setPreparandoPago] = useState(false);

  const estaVacio = hidratado && items.length === 0;
  const puedeContinuar = useMemo(() => {
    if (pedidoPendientePago) {
      return true;
    }

    return checkout.puedeEnviar && items.length > 0;
  }, [checkout.puedeEnviar, items.length, pedidoPendientePago]);

  const textoBoton = resolverTextoBotonPago(
    resolverEstadoBotonPago(preparandoPago, pedidoPendientePago !== null),
  );

  useEffect(() => {
    if (esAutenticado && usuario) {
      actualizarModoCheckout("autenticado");
      hidratarDatosClienteDesdeSesion({
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        correo: usuario.correo ?? "",
      });
      return;
    }

    actualizarModoCheckout("invitado");
  }, [
    actualizarModoCheckout,
    esAutenticado,
    hidratarDatosClienteDesdeSesion,
    usuario,
  ]);

  if (!hidratado) {
    return <CheckoutCargando />;
  }

  if (estaVacio) {
    return (
      <section>
        <ContenedorPrincipal claseName="pb-[var(--espacio-2xl)]">
          <EstadoVacioCheckout />
        </ContenedorPrincipal>
      </section>
    );
  }

  function construirSolicitudPedido(): SolicitudCrearPedido {
    return {
      datosCliente: {
        nombre: checkout.valores.datosCliente.nombre,
        apellido: checkout.valores.datosCliente.apellido,
        correo: checkout.valores.datosCliente.correo,
        telefono: checkout.valores.datosCliente.telefono,
      },
      direccionDespacho: {
        region: checkout.valores.direccionEnvio.region,
        comuna: checkout.valores.direccionEnvio.comuna,
        calle: checkout.valores.direccionEnvio.calle,
        numero: checkout.valores.direccionEnvio.numero,
        departamento: checkout.valores.direccionEnvio.departamento,
        referencias: checkout.valores.direccionEnvio.referencias,
        codigoPostal: checkout.valores.direccionEnvio.codigoPostal,
      },
      items: items.map((item) => ({
        slug: item.slug,
        nombre: item.nombre,
        nombreCompleto: item.nombreCompleto,
        resumen: item.resumen,
        categoria: item.categoria,
        subcategoria: item.subcategoria,
        marca: item.marca,
        tipoProducto: item.tipoProducto,
        nivel: item.nivel,
        coleccion: item.coleccion,
        precioUnitarioIvaIncluidoSnapshot: item.precioUnitarioIvaIncluido,
        cantidad: item.cantidad,
        etiquetasComerciales: item.etiquetasComerciales,
        idProducto: item.productoId,
        formato: item.formato,
        pesoKg: item.pesoKg,
        acabado: item.acabado,
        efecto: item.efecto,
        colorHex: item.colorHex,
        compatiblePLA: item.compatiblePLA,
        esDestacado: item.esDestacado,
        estado: item.estado,
        variante: item.variante
          ? {
              etiqueta: item.variante.etiqueta,
              codigoReferencia: item.variante.codigoReferencia,
              selecciones: item.variante.selecciones,
            }
          : null,
      })),
    };
  }

  async function registrarPedido(): Promise<ResultadoCrearPedido> {
    const respuesta = await fetch("/api/pedidos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(construirSolicitudPedido()),
    });

    const payload = (await respuesta.json()) as RespuestaApiCrearPedido;

    if (!payload.ok) {
      throw new Error(payload.mensaje || "No pudimos registrar tu pedido.");
    }

    if (!respuesta.ok) {
      throw new Error("No pudimos registrar tu pedido.");
    }

    return payload;
  }

  async function iniciarPagoPedido(pedidoId: string) {
    const respuesta = await fetch("/api/pagos/intencion", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ pedidoId }),
    });

    const payload = (await respuesta.json()) as RespuestaApiCrearIntencionPago;

    if (!payload.ok) {
      throw new Error(payload.mensaje || "No pudimos iniciar el pago del pedido.");
    }

    if (!respuesta.ok) {
      throw new Error("No pudimos iniciar el pago del pedido.");
    }

    redireccionarAWebpayPlus(payload.urlRedireccion, payload.tokenRedireccion);
  }

  async function manejarEnvio(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setErrorEnvio(null);

    if (preparandoPago) {
      return;
    }

    if (!pedidoPendientePago) {
      const esValido = checkout.prepararEnvio();

      if (!esValido) {
        enfocarPrimerError(checkout);
        return;
      }
    }

    checkout.setEstadoEnvio("enviando");
    setPreparandoPago(true);

    try {
      let pedido = pedidoPendientePago;

      if (!pedido) {
        pedido = await registrarPedido();

        const unidades = items.reduce(
          (acumulador, item) => acumulador + item.cantidad,
          0,
        );

        setPedidoPendientePago(pedido);
        setCantidadUnidadesPedido(unidades);
      }

      await iniciarPagoPedido(pedido.pedidoId);
    } catch (error: unknown) {
      checkout.reiniciarEstadoEnvio();
      setPreparandoPago(false);
      setErrorEnvio(
        error instanceof Error
          ? error.message
          : "No pudimos continuar. Intenta nuevamente.",
      );
    }
  }

  return (
    <section aria-labelledby="titulo-checkout">
      <ContenedorPrincipal claseName="flex flex-col gap-[var(--espacio-xl)] pb-[var(--espacio-2xl)]">
        <nav
          aria-label="Ruta de navegacion"
          className="flex flex-wrap items-center gap-2 text-sm text-slate-500"
        >
          <Link href="/" className="hover:text-slate-900">
            Inicio
          </Link>
          <span aria-hidden="true">/</span>
          <Link href="/carrito" className="hover:text-slate-900">
            Carrito
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-slate-900">Checkout</span>
        </nav>

        <header className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Etiqueta variante="primaria">Checkout</Etiqueta>
            <Etiqueta variante="suave">
              {checkout.valores.datosCliente.modo === "autenticado"
                ? "Autenticado"
                : "Invitado"}
            </Etiqueta>
            <Etiqueta variante="premium">IVA incluido</Etiqueta>
            <Etiqueta variante="premium">Webpay Plus</Etiqueta>
          </div>

          <div className="space-y-3">
            <h1
              id="titulo-checkout"
              className="font-[var(--fuente-titulos)] text-[clamp(2.4rem,5vw,4.4rem)] font-semibold leading-[0.96] tracking-[-0.05em] text-slate-950"
            >
              Finaliza tu compra
            </h1>
            <p className="max-w-3xl text-base leading-8 text-slate-600 sm:text-[1.05rem]">
              Revisa tus datos de contacto, direccion de despacho y resumen de
              compra antes de continuar a pago.
            </p>
          </div>
        </header>

        {pedidoPendientePago ? (
          <div className="rounded-[var(--radio-lg)] border border-[color:var(--color-borde)] bg-white/78 px-5 py-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Pedido registrado
            </p>
            <p className="mt-2 text-sm leading-7 text-slate-700">
              Ya existe un pedido listo para pago:{" "}
              <span className="font-semibold text-slate-950">
                {pedidoPendientePago.numeroPedido}
              </span>
              . Si el pago no pudo abrirse o fue interrumpido, puedes reintentar
              sin crear otro pedido.
            </p>
            <p className="mt-2 text-sm leading-7 text-slate-700">
              {cantidadUnidadesPedido || resumen.cantidadUnidades} unidades, total{" "}
              <span className="font-semibold text-slate-950">
                {formatearPrecioClp(pedidoPendientePago.totalIvaIncluido)}
              </span>
              .
            </p>
          </div>
        ) : null}

        {errorEnvio ? (
          <MensajeError
            mensaje={errorEnvio}
            detalle={
              pedidoPendientePago
                ? "El pedido ya existe y permanece vinculado al intento de pago. Puedes volver a intentarlo sin duplicar datos."
                : "Revisa los campos e intenta nuevamente. Si el problema persiste, vuelve a intentarlo en unos minutos."
            }
          />
        ) : null}

        <form
          onSubmit={(evento) => {
            void manejarEnvio(evento);
          }}
          className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr] xl:items-start"
        >
          <div className="space-y-6">
            <SeccionIdentificacionCheckout />

            <SeccionDatosClienteCheckout
              valores={checkout.valores.datosCliente}
              errores={checkout.errores.datosCliente}
              alCambiarCampo={checkout.actualizarDatosCliente}
            />

            <SeccionDireccionEnvioCheckout
              valores={checkout.valores.direccionEnvio}
              errores={checkout.errores.direccionEnvio}
              alCambiarCampo={checkout.actualizarDireccionEnvio}
            />
          </div>

          <div className="space-y-6 xl:sticky xl:top-28">
            <ResumenCheckout
              items={items}
              resumen={resumen}
              deshabilitado={!puedeContinuar || preparandoPago}
              textoBoton={textoBoton}
            />
            <BloqueConfianzaCheckout />
          </div>
        </form>
      </ContenedorPrincipal>
    </section>
  );
}

function resolverEstadoBotonPago(
  preparandoPago: boolean,
  existePedidoPendiente: boolean,
) {
  if (preparandoPago) {
    return "preparando";
  }

  return existePedidoPendiente ? "reintento" : "nuevo";
}

function resolverTextoBotonPago(estado: "preparando" | "reintento" | "nuevo") {
  switch (estado) {
    case "preparando":
      return "Preparando pago...";
    case "reintento":
      return "Reintentar pago";
    default:
      return "Ir a pagar con Webpay";
  }
}
