"use client";

import type { FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ContenedorPrincipal } from "@/compartido/componentes/base/contenedor-principal";
import { Boton, Etiqueta, MensajeError, ModalBase } from "@/compartido/componentes/ui";
import { formatearPrecioClp } from "@/compartido/utilidades/formatear-precio-clp";
import { useAutenticacion } from "@/modulos/autenticacion";
import { useCarrito } from "@/modulos/carrito";
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
  const [modalAbierto, setModalAbierto] = useState(false);
  const [errorEnvio, setErrorEnvio] = useState<string | null>(null);

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

    const esValido = checkout.prepararEnvio();

    if (!esValido) {
      enfocarPrimerError(checkout);
      return;
    }

    try {
      checkout.marcarEnvioExitoso();
      setModalAbierto(true);
    } catch {
      setErrorEnvio("No pudimos continuar. Intenta nuevamente.");
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
              para conectar pagos y creacion del pedido en modulos posteriores.
            </p>
          </div>
        </header>

        {errorEnvio ? (
          <MensajeError
            mensaje={errorEnvio}
            detalle="El checkout aun no envia informacion a backend, pero el formulario debe validarse correctamente."
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
              textoBoton="Continuar"
            />
            <BloqueConfianzaCheckout />
          </div>
        </form>
      </ContenedorPrincipal>

      <ModalBase
        abierto={modalAbierto}
        alCerrar={() => setModalAbierto(false)}
        titulo="Datos validados"
        descripcion="El checkout visual esta listo. El siguiente paso sera integrar pagos y creacion del pedido."
        pie={
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Boton variante="secundario" onClick={() => setModalAbierto(false)}>
              Seguir revisando
            </Boton>
            <Boton
              onClick={() => setModalAbierto(false)}
              title="Pagos y pedidos se integran en modulos posteriores"
            >
              Continuar
            </Boton>
          </div>
        }
      >
        <div className="space-y-3">
          <p className="texto-destacado">
            En esta etapa no se genera un pedido definitivo ni se solicita pago.
            La interfaz queda preparada para conectar Supabase y un proveedor de
            pagos cuando se definan esos modulos.
          </p>

          <div className="rounded-[var(--radio-md)] border border-[color:var(--color-borde)] bg-white/78 px-4 py-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Resumen rapido
            </p>
            <p className="text-sm leading-7 text-slate-700">
              {resumen.cantidadUnidades} unidades, subtotal{" "}
              <span className="font-semibold text-slate-950">
                {formatearPrecioClp(resumen.subtotalIvaIncluido)}
              </span>{" "}
              (IVA incluido).
            </p>
          </div>
        </div>
      </ModalBase>
    </section>
  );
}
