"use client";

import type { FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ContenedorPrincipal } from "@/compartido/componentes/base/contenedor-principal";
import { Boton, Etiqueta, MensajeError, ModalBase } from "@/compartido/componentes/ui";
import { formatearPrecioClp } from "@/compartido/utilidades/formatear-precio-clp";
import { useAutenticacion } from "@/modulos/autenticacion";
import { useCarrito } from "@/modulos/carrito";
import type { RespuestaApiCrearPedido, ResultadoCrearPedido, SolicitudCrearPedido } from "@/modulos/pedidos";
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
  const { hidratado, items, resumen, vaciarCarrito } = useCarrito();
  const { esAutenticado, usuario } = useAutenticacion();
  const checkout = useFormularioCheckout();
  const { actualizarModoCheckout, hidratarDatosClienteDesdeSesion } = checkout;
  const [modalAbierto, setModalAbierto] = useState(false);
  const [errorEnvio, setErrorEnvio] = useState<string | null>(null);
  const [pedidoCreado, setPedidoCreado] = useState<ResultadoCrearPedido | null>(null);
  const [cantidadUnidadesPedido, setCantidadUnidadesPedido] = useState(0);

  const estaVacio = hidratado && items.length === 0;
  const puedeContinuar = useMemo(
    () => checkout.puedeEnviar && items.length > 0,
    [checkout.puedeEnviar, items.length],
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

  function manejarEnvio(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setErrorEnvio(null);
    setPedidoCreado(null);
    setCantidadUnidadesPedido(0);

    const esValido = checkout.prepararEnvio();

    if (!esValido) {
      enfocarPrimerError(checkout);
      return;
    }

    checkout.setEstadoEnvio("enviando");

    const solicitud: SolicitudCrearPedido = {
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
        // Campos existentes
        slug: item.slug,
        nombre: item.nombre,
        resumen: item.resumen,
        categoria: item.categoria,
        tipoProducto: item.tipoProducto,
        coleccion: item.coleccion,
        precioUnitarioIvaIncluidoSnapshot: item.precioUnitarioIvaIncluido,
        cantidad: item.cantidad,
        etiquetasComerciales: item.etiquetasComerciales,

        // Campos NUEVOS (si existen en item, se envían)
        idProducto: item.productoId,
        nombreCompleto: item.nombreCompleto,
        marca: item.marca,
        nivel: item.nivel,
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

    fetch("/api/pedidos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(solicitud),
    })
      .then(async (respuesta) => {
        const payload = (await respuesta.json()) as RespuestaApiCrearPedido;

        if (!payload.ok) {
          throw new Error(payload.mensaje || "No pudimos registrar tu pedido.");
        }

        if (!respuesta.ok) {
          throw new Error("No pudimos registrar tu pedido.");
        }

        return payload;
      })
      .then((resultado) => {
        const unidades = items.reduce((acumulador, item) => acumulador + item.cantidad, 0);
        setPedidoCreado(resultado);
        setCantidadUnidadesPedido(unidades);
        vaciarCarrito();
        checkout.marcarEnvioExitoso();
        setModalAbierto(true);
      })
      .catch((error: unknown) => {
        checkout.reiniciarEstadoEnvio();
        setErrorEnvio(
          error instanceof Error
            ? error.message
            : "No pudimos continuar. Intenta nuevamente.",
        );
      });
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
          </div>

          <div className="space-y-3">
            <h1
              id="titulo-checkout"
              className="font-[var(--fuente-titulos)] text-[clamp(2.4rem,5vw,4.4rem)] font-semibold leading-[0.96] tracking-[-0.05em] text-slate-950"
            >
              Finaliza tu compra
            </h1>
            <p className="max-w-3xl text-base leading-8 text-slate-600 sm:text-[1.05rem]">
              Ingresa tus datos y direccion de envio. Esta interfaz queda lista
              para registrar el pedido y luego integrar pagos y correos.
            </p>
          </div>
        </header>

        {errorEnvio ? (
          <MensajeError
            mensaje={errorEnvio}
            detalle="Revisa los campos e intenta nuevamente. Si el problema persiste, puede faltar configuracion de Supabase en el servidor."
          />
        ) : null}

        <form
          onSubmit={manejarEnvio}
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
              deshabilitado={!puedeContinuar}
              textoBoton="Crear pedido"
            />
            <BloqueConfianzaCheckout />
          </div>
        </form>
      </ContenedorPrincipal>

      <ModalBase
        abierto={modalAbierto}
        alCerrar={() => setModalAbierto(false)}
        titulo="Pedido registrado"
        descripcion="Tu compra quedo registrada. El siguiente paso sera integrar pagos y confirmaciones por correo."
        pie={
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Boton variante="secundario" onClick={() => setModalAbierto(false)}>
              Seguir revisando
            </Boton>
            <Boton
              onClick={() => setModalAbierto(false)}
              title="Pagos y correos se integran en modulos posteriores"
            >
              Continuar
            </Boton>
          </div>
        }
      >
        <div className="space-y-3">
          <p className="texto-destacado">
            En esta etapa no se solicita pago. El pedido queda registrado para
            mantener trazabilidad y luego conectar un proveedor de pagos.
          </p>

          <div className="rounded-[var(--radio-md)] border border-[color:var(--color-borde)] bg-white/78 px-4 py-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Resumen rapido
            </p>
            <p className="text-sm leading-7 text-slate-700">
              {pedidoCreado ? cantidadUnidadesPedido : resumen.cantidadUnidades} unidades, subtotal{" "}
              <span className="font-semibold text-slate-950">
                {formatearPrecioClp(
                  pedidoCreado
                    ? pedidoCreado.subtotalIvaIncluido
                    : resumen.subtotalIvaIncluido,
                )}
              </span>{" "}
              (IVA incluido).
            </p>
            {pedidoCreado ? (
              <p className="mt-2 text-sm leading-7 text-slate-700">
                Numero de pedido:{" "}
                <span className="font-semibold text-slate-950">
                  {pedidoCreado.numeroPedido}
                </span>
              </p>
            ) : null}
          </div>
        </div>
      </ModalBase>
    </section>
  );
}
