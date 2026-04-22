"use client";

import type { FormEvent } from "react";
import { useMemo, useState } from "react";
import Link from "next/link";
import { ContenedorPrincipal } from "@/compartido/componentes/base/contenedor-principal";
import { AreaTexto, Boton, CampoTexto, Cargador, Etiqueta, MensajeError, Tarjeta } from "@/compartido/componentes/ui";
import type { ResultadoCrearCotizacion } from "../tipos/crear-cotizacion";
import { useFormularioCotizacion } from "../hooks/use-formulario-cotizacion";
import { solicitarCotizacionPublica } from "../servicios/solicitar-cotizacion-publica";

export const idsCamposFormularioCotizacion = {
  nombre: "cotizacion-nombre",
  apellido: "cotizacion-apellido",
  correo: "cotizacion-correo",
  telefono: "cotizacion-telefono",
  mensaje: "cotizacion-mensaje",
} as const;

function enfocarPrimerError(cotizacion: ReturnType<typeof useFormularioCotizacion>) {
  const { errores } = cotizacion;

  const ordenIds = [
    [idsCamposFormularioCotizacion.nombre, errores.solicitante.nombre],
    [idsCamposFormularioCotizacion.apellido, errores.solicitante.apellido],
    [idsCamposFormularioCotizacion.correo, errores.solicitante.correo],
    [idsCamposFormularioCotizacion.telefono, errores.solicitante.telefono],
    [idsCamposFormularioCotizacion.mensaje, errores.mensaje],
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

const itemsConfianzaCotizacion = [
  {
    titulo: "Sin pago en linea",
    descripcion:
      "Esta via es para requerimientos especiales. Te contactaremos para definir detalles y tiempos.",
  },
  {
    titulo: "Venta en Chile",
    descripcion:
      "Operamos con despacho dentro de Chile. Actualmente no contamos con retiro fisico.",
  },
  {
    titulo: "Respuesta humana",
    descripcion:
      "Tu solicitud se revisa manualmente para asegurar compatibilidad y propuesta adecuada.",
  },
] as const;

export function PaginaFormularioCotizacion() {
  const cotizacion = useFormularioCotizacion();
  const [errorEnvio, setErrorEnvio] = useState<string | null>(null);
  const [resultado, setResultado] = useState<ResultadoCrearCotizacion | null>(null);

  const estaExitoso = cotizacion.estadoEnvio === "exitoso" && Boolean(resultado);
  const textoBoton = useMemo(() => {
    if (cotizacion.estadoEnvio === "enviando") {
      return "Enviando...";
    }

    if (estaExitoso) {
      return "Solicitud enviada";
    }

    return "Enviar solicitud";
  }, [cotizacion.estadoEnvio, estaExitoso]);

  async function manejarEnvio(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setErrorEnvio(null);

    if (cotizacion.estadoEnvio === "enviando") {
      return;
    }

    if (estaExitoso) {
      return;
    }

    const esValido = cotizacion.prepararEnvio();

    if (!esValido) {
      enfocarPrimerError(cotizacion);
      return;
    }

    cotizacion.setEstadoEnvio("enviando");

    try {
      const creado = await solicitarCotizacionPublica(cotizacion.valores);
      setResultado(creado);
      cotizacion.setEstadoEnvio("exitoso");
    } catch (error) {
      cotizacion.reiniciarEstadoEnvio();
      setErrorEnvio(
        error instanceof Error
          ? error.message
          : "No pudimos enviar tu solicitud. Intenta nuevamente.",
      );
    }
  }

  return (
    <section aria-labelledby="titulo-cotizacion">
      <ContenedorPrincipal claseName="pb-[var(--espacio-2xl)]">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
          <div className="space-y-6">
            <header className="space-y-3">
              <Etiqueta variante="suave">Cotizacion</Etiqueta>
              <h1
                id="titulo-cotizacion"
                className="text-3xl font-semibold tracking-tight text-slate-950"
              >
                Solicita una cotizacion
              </h1>
              <p className="max-w-2xl text-sm leading-7 text-slate-600">
                Comparte tu requerimiento y datos de contacto. Te responderemos con una propuesta
                ajustada a tu necesidad.
              </p>
            </header>

            {estaExitoso && resultado ? (
              <Tarjeta
                variante="elevada"
                titulo="Solicitud recibida"
                descripcion="Guardamos tu cotizacion y ya tenemos tu mensaje."
                pie={
                  <div className="flex flex-col gap-2 text-sm text-slate-700">
                    <p>
                      Numero de cotizacion:{" "}
                      <span className="font-semibold text-slate-950">
                        {resultado.numeroCotizacion}
                      </span>
                    </p>
                    <p className="text-slate-600">
                      Si necesitas complementar informacion, responde al correo de confirmacion.
                    </p>
                    <div className="flex flex-wrap gap-3 pt-2">
                      <Link
                        href="/catalogo"
                        className="text-sm font-semibold text-emerald-800 underline decoration-emerald-300 underline-offset-4 hover:text-emerald-900"
                      >
                        Volver al catalogo
                      </Link>
                    </div>
                  </div>
                }
              >
                <div className="rounded-[var(--radio-md)] border border-[color:var(--color-borde)] bg-white/70 px-4 py-4 text-sm leading-7 text-slate-700">
                  <p className="font-semibold text-slate-950">Resumen enviado</p>
                  <p className="mt-2">
                    {cotizacion.valores.solicitante.nombre}{" "}
                    {cotizacion.valores.solicitante.apellido} &middot;{" "}
                    {cotizacion.valores.solicitante.correo}
                  </p>
                  {cotizacion.valores.solicitante.telefono.trim().length ? (
                    <p className="mt-1 text-slate-600">
                      Telefono: {cotizacion.valores.solicitante.telefono}
                    </p>
                  ) : null}
                  {cotizacion.valores.mensaje.trim().length ? (
                    <p className="mt-3 whitespace-pre-line text-slate-600">
                      {cotizacion.valores.mensaje}
                    </p>
                  ) : null}
                </div>
              </Tarjeta>
            ) : (
              <Tarjeta
                variante="elevada"
                titulo="Datos de contacto"
                descripcion="Completa la informacion minima para que podamos responderte."
              >
                <form className="space-y-4" onSubmit={manejarEnvio}>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <CampoTexto
                      id={idsCamposFormularioCotizacion.nombre}
                      etiqueta="Nombre"
                      obligatorio
                      value={cotizacion.valores.solicitante.nombre}
                      onChange={(evento) =>
                        cotizacion.actualizarSolicitante("nombre", evento.target.value)
                      }
                      error={cotizacion.intentoEnvio ? cotizacion.errores.solicitante.nombre ?? undefined : undefined}
                      placeholder="Ej: Camila"
                      autoComplete="given-name"
                      disabled={cotizacion.estadoEnvio === "enviando"}
                    />

                    <CampoTexto
                      id={idsCamposFormularioCotizacion.apellido}
                      etiqueta="Apellido"
                      obligatorio
                      value={cotizacion.valores.solicitante.apellido}
                      onChange={(evento) =>
                        cotizacion.actualizarSolicitante("apellido", evento.target.value)
                      }
                      error={cotizacion.intentoEnvio ? cotizacion.errores.solicitante.apellido ?? undefined : undefined}
                      placeholder="Ej: Rojas"
                      autoComplete="family-name"
                      disabled={cotizacion.estadoEnvio === "enviando"}
                    />
                  </div>

                  <CampoTexto
                    id={idsCamposFormularioCotizacion.correo}
                    etiqueta="Correo"
                    obligatorio
                    type="email"
                    value={cotizacion.valores.solicitante.correo}
                    onChange={(evento) =>
                      cotizacion.actualizarSolicitante("correo", evento.target.value)
                    }
                    error={cotizacion.intentoEnvio ? cotizacion.errores.solicitante.correo ?? undefined : undefined}
                    placeholder="nombre@dominio.cl"
                    autoComplete="email"
                    disabled={cotizacion.estadoEnvio === "enviando"}
                  />

                  <CampoTexto
                    id={idsCamposFormularioCotizacion.telefono}
                    etiqueta="Telefono (opcional)"
                    value={cotizacion.valores.solicitante.telefono}
                    onChange={(evento) =>
                      cotizacion.actualizarSolicitante("telefono", evento.target.value)
                    }
                    error={cotizacion.intentoEnvio ? cotizacion.errores.solicitante.telefono ?? undefined : undefined}
                    placeholder="Ej: +56 9 1234 5678"
                    autoComplete="tel"
                    disabled={cotizacion.estadoEnvio === "enviando"}
                  />

                  <AreaTexto
                    id={idsCamposFormularioCotizacion.mensaje}
                    etiqueta="Mensaje (opcional)"
                    ayuda="Describe lo que necesitas cotizar (producto, servicio, cantidades, plazos, etc.)."
                    value={cotizacion.valores.mensaje}
                    onChange={(evento) => cotizacion.actualizarMensaje(evento.target.value)}
                    error={cotizacion.intentoEnvio ? cotizacion.errores.mensaje ?? undefined : undefined}
                    placeholder="Ej: Necesito imprimir una pieza PLA de 15cm, 2 unidades, color negro. Entrega en Santiago."
                    rows={6}
                    disabled={cotizacion.estadoEnvio === "enviando"}
                  />

                  {errorEnvio ? <MensajeError mensaje={errorEnvio} /> : null}

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs leading-6 text-slate-500">
                      Al enviar aceptas ser contactado por Rekun LAB para responder tu solicitud.
                    </p>

                    <Boton
                      type="submit"
                      disabled={!cotizacion.puedeEnviar}
                      variante="primario"
                    >
                      {cotizacion.estadoEnvio === "enviando" ? (
                        <span className="inline-flex items-center gap-2">
                          <Cargador tamanio="sm" />
                          {textoBoton}
                        </span>
                      ) : (
                        textoBoton
                      )}
                    </Boton>
                  </div>
                </form>
              </Tarjeta>
            )}
          </div>

          <aside className="space-y-4">
            <Tarjeta
              variante="base"
              titulo="Antes de enviar"
              descripcion="Detalles rapidos para mantener la solicitud clara y accionable."
            >
              <div className="grid gap-3">
                {itemsConfianzaCotizacion.map((item) => (
                  <div
                    key={item.titulo}
                    className="rounded-[var(--radio-md)] border border-[color:var(--color-borde)] bg-white/70 px-4 py-4"
                  >
                    <p className="text-sm font-semibold text-slate-900">{item.titulo}</p>
                    <p className="mt-1 text-sm leading-7 text-slate-600">
                      {item.descripcion}
                    </p>
                  </div>
                ))}
              </div>
            </Tarjeta>

            <Tarjeta
              variante="oscura"
              titulo="Tip para acelerar"
              descripcion="Incluye medidas, material esperado (PLA u otro) y ciudad de despacho."
            >
              <div className="rounded-[var(--radio-md)] bg-white/8 px-4 py-4 text-sm leading-7 text-white/80">
                Si ya tienes un modelo STL, mencionalo en el mensaje. En un siguiente paso podremos
                habilitar adjuntos o un canal dedicado para archivos.
              </div>
            </Tarjeta>
          </aside>
        </div>
      </ContenedorPrincipal>
    </section>
  );
}
