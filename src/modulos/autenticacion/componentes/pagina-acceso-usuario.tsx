"use client";

import Link from "next/link";
import { ContenedorPrincipal } from "@/compartido/componentes/base/contenedor-principal";
import {
  Boton,
  Cargador,
  Etiqueta,
  MensajeError,
  Tarjeta,
} from "@/compartido/componentes/ui";
import { useAutenticacion } from "../hooks/use-autenticacion";
import { BotonGoogleAutenticacion } from "./boton-google-autenticacion";

function TarjetaSesionUsuario() {
  const {
    accionActual,
    disponibilidad,
    esAutenticado,
    estadoSesion,
    limpiarMensajeError,
    mensajeError,
    usuario,
    cerrarSesion,
  } = useAutenticacion();

  if (estadoSesion === "cargando") {
    return (
      <Tarjeta
        variante="elevada"
        etiqueta={<Etiqueta variante="primaria">Sesion</Etiqueta>}
        titulo="Verificando estado de acceso"
        descripcion="Estamos comprobando si existe una sesion activa en este navegador."
      >
        <Cargador centrado etiqueta="Revisando sesion actual" />
      </Tarjeta>
    );
  }

  return (
    <div className="space-y-4">
      {mensajeError ? (
        <MensajeError
          mensaje={mensajeError}
          accion={
            <Boton variante="secundario" tamanio="sm" onClick={limpiarMensajeError}>
              Ocultar
            </Boton>
          }
        />
      ) : null}

      <Tarjeta
        variante="elevada"
        etiqueta={
          <Etiqueta variante={esAutenticado ? "premium" : "primaria"}>
            {esAutenticado ? "Sesion activa" : "Acceso"}
          </Etiqueta>
        }
        titulo={
          esAutenticado && usuario
            ? `Hola, ${usuario.nombre}`
            : "Inicia sesion con Google"
        }
        descripcion={
          esAutenticado
            ? "Puedes seguir navegando, revisar el catalogo o cerrar sesion cuando lo necesites."
            : "La compra como invitado sigue disponible. Si eliges Google, podras entrar con una experiencia mas directa cuando este habilitada."
        }
        acciones={
          esAutenticado ? (
            <Boton
              variante="secundario"
              tamanio="sm"
              cargando={accionActual === "cerrar-sesion"}
              onClick={() => {
                void cerrarSesion();
              }}
            >
              Cerrar sesion
            </Boton>
          ) : (
            <BotonGoogleAutenticacion tamanio="sm" variante="primario" />
          )
        }
      >
        {esAutenticado && usuario ? (
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-[var(--radio-md)] border border-[color:var(--color-borde)] bg-white/78 px-4 py-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Nombre
              </p>
              <p className="text-sm font-semibold text-slate-950">
                {usuario.nombreCompleto}
              </p>
            </div>

            <div className="rounded-[var(--radio-md)] border border-[color:var(--color-borde)] bg-white/78 px-4 py-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Correo
              </p>
              <p className="text-sm font-semibold text-slate-950">
                {usuario.correo ?? "Sin correo disponible"}
              </p>
            </div>

            <div className="rounded-[var(--radio-md)] border border-[color:var(--color-borde)] bg-white/78 px-4 py-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Proveedor
              </p>
              <p className="text-sm font-semibold text-slate-950">
                {usuario.proveedor ?? "Google"}
              </p>
            </div>

            <div className="rounded-[var(--radio-md)] border border-[color:var(--color-borde)] bg-white/78 px-4 py-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Estado
              </p>
              <p className="text-sm font-semibold text-slate-950">
                Sesion activa
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="texto-soporte">
              {disponibilidad === "configurada"
                ? "Puedes entrar con Google o seguir como invitado sin interrumpir la compra."
                : "El acceso con Google no esta disponible por ahora. Puedes seguir comprando como invitado sin problema."}
            </p>

            <div className="flex flex-wrap gap-3">
              <BotonGoogleAutenticacion variante="primario" />
              <Link
                href="/checkout"
                className="boton-base boton-secundario min-h-11 px-4 text-sm"
              >
                Seguir como invitado
              </Link>
            </div>
          </div>
        )}
      </Tarjeta>
    </div>
  );
}

export function PaginaAccesoUsuario() {
  const { esAutenticado } = useAutenticacion();

  return (
    <section aria-labelledby="titulo-acceso">
      <ContenedorPrincipal claseName="flex flex-col gap-[var(--espacio-xl)] pb-[var(--espacio-2xl)]">
        <nav
          aria-label="Ruta de navegacion"
          className="flex flex-wrap items-center gap-2 text-sm text-slate-500"
        >
          <Link href="/" className="hover:text-slate-900">
            Inicio
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-slate-900">Acceso</span>
        </nav>

        <div className="grid gap-6 xl:grid-cols-[1.02fr_0.98fr] xl:items-start">
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Etiqueta variante="primaria">Acceso</Etiqueta>
                <Etiqueta variante="suave">Google</Etiqueta>
                <Etiqueta variante="premium">Invitado permitido</Etiqueta>
              </div>

              <div className="space-y-3">
                <h1
                  id="titulo-acceso"
                  className="font-[var(--fuente-titulos)] text-[clamp(2.4rem,5vw,4.4rem)] font-semibold leading-[0.96] tracking-[-0.05em] text-slate-950"
                >
                  {esAutenticado ? "Tu sesion esta activa" : "Acceso simple para una compra flexible"}
                </h1>
                <p className="max-w-3xl text-base leading-8 text-slate-600 sm:text-[1.05rem]">
                  Accede con Google cuando este disponible o sigue comprando como
                  invitado. El objetivo es mantener una experiencia fluida y sin
                  bloqueos innecesarios.
                </p>
              </div>
            </div>

            <TarjetaSesionUsuario />
          </div>

          <div className="space-y-6 xl:sticky xl:top-28">
            <Tarjeta
              variante="oscura"
              etiqueta={<Etiqueta variante="premium">Cuenta y compra</Etiqueta>}
              titulo="El acceso acompana la experiencia, no la interrumpe"
              descripcion="Tanto la sesion activa como la compra como invitado siguen disponibles segun lo que te acomode mas."
            >
              <ul className="grid gap-3">
                <li className="rounded-[var(--radio-md)] border border-white/10 bg-white/6 px-4 py-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/58">
                    Compra flexible
                  </p>
                  <p className="text-sm leading-7 text-white/82">
                    Puedes ir al checkout aunque no hayas iniciado sesion.
                  </p>
                </li>
                <li className="rounded-[var(--radio-md)] border border-white/10 bg-white/6 px-4 py-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/58">
                    Datos editables
                  </p>
                  <p className="text-sm leading-7 text-white/82">
                    Tu informacion puede revisarse y ajustarse antes de confirmar
                    una compra.
                  </p>
                </li>
                <li className="rounded-[var(--radio-md)] border border-white/10 bg-white/6 px-4 py-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/58">
                    Continuidad
                  </p>
                  <p className="text-sm leading-7 text-white/82">
                    Puedes volver al catalogo, revisar tu carrito o entrar cuando
                    lo necesites.
                  </p>
                </li>
              </ul>
            </Tarjeta>

            <Tarjeta
              variante="elevada"
              etiqueta={<Etiqueta variante="primaria">Siguiente paso</Etiqueta>}
              titulo="Sigue recorriendo la tienda"
              descripcion="El acceso es opcional y no bloquea ninguna accion de compra."
            >
              <div className="grid gap-3">
                <Link
                  href="/catalogo"
                  className="boton-base boton-secundario min-h-11 justify-center px-4 text-sm"
                >
                  Ir al catalogo
                </Link>
                <Link
                  href="/checkout"
                  className="boton-base boton-primario min-h-11 justify-center px-4 text-sm"
                >
                  Ir al checkout
                </Link>
              </div>
            </Tarjeta>
          </div>
        </div>
      </ContenedorPrincipal>
    </section>
  );
}
