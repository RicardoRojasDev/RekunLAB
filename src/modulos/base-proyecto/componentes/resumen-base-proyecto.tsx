import type { CSSProperties, ReactNode } from "react";
import { BotonBase } from "@/compartido/componentes/base/boton-base";
import { ContenedorPrincipal } from "@/compartido/componentes/base/contenedor-principal";
import {
  escalaEspaciadosSistemaDiseno,
  escalaRadiosSistemaDiseno,
  escalaSombrasSistemaDiseno,
  escalaTipograficaSistemaDiseno,
  estadosInteractivosSistemaDiseno,
  gruposPaletaSistemaDiseno,
  lineamientosComponentesFuturos,
  narrativaSistemaDiseno,
} from "@/compartido/configuracion/sistema-diseno";

type PropiedadesMuestraColor = Readonly<{
  nombre: string;
  token: string;
  valor: string;
  uso: string;
}>;

type PropiedadesTarjetaToken = Readonly<{
  nombre: string;
  token: string;
  valor: string;
  uso: string;
  muestra: ReactNode;
}>;

function MuestraColor({
  nombre,
  token,
  valor,
  uso,
}: PropiedadesMuestraColor) {
  const estiloColor: CSSProperties = {
    backgroundColor: `var(${token})`,
  };

  return (
    <article className="panel-diseno rounded-[var(--radio-md)] p-4">
      <div
        aria-hidden="true"
        style={estiloColor}
        className="h-24 rounded-[var(--radio-sm)] border border-black/5"
      />

      <div className="mt-4 space-y-2">
        <p className="text-sm font-semibold text-slate-950">{nombre}</p>
        <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
          {token}
        </p>
        <p className="text-xs font-medium text-slate-700">{valor}</p>
        <p className="texto-soporte">{uso}</p>
      </div>
    </article>
  );
}

function TarjetaToken({
  nombre,
  token,
  valor,
  uso,
  muestra,
}: PropiedadesTarjetaToken) {
  return (
    <article className="panel-diseno rounded-[var(--radio-md)] p-4">
      <div className="flex min-h-24 items-center justify-center rounded-[var(--radio-sm)] border border-[color:var(--color-borde-suave)] bg-[rgba(255,255,255,0.68)]">
        {muestra}
      </div>

      <div className="mt-4 space-y-2">
        <p className="text-sm font-semibold text-slate-950">{nombre}</p>
        <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
          {token}
        </p>
        <p className="text-xs font-medium text-slate-700">{valor}</p>
        <p className="texto-soporte">{uso}</p>
      </div>
    </article>
  );
}

export function ResumenBaseProyecto() {
  return (
    <section>
      <ContenedorPrincipal claseName="flex flex-col gap-[var(--espacio-xl)] pb-[var(--espacio-xl)]">
        <header className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
          <div className="space-y-6">
            <span className="etiqueta-tecnica">Modulo 4 - Sistema de diseno</span>

            <div className="space-y-4">
              <h1 className="titulo-display max-w-5xl text-slate-950">
                Base visual premium, tecnologica y sustentable para el ecommerce
                de Rekun LAB
              </h1>

              <p className="texto-destacado max-w-3xl">
                {narrativaSistemaDiseno.identidad}
              </p>

              <p className="texto-soporte max-w-3xl">
                {narrativaSistemaDiseno.direccion}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <BotonBase variante="primario" tamanio="lg">
                Primario
              </BotonBase>
              <BotonBase variante="secundario" tamanio="lg">
                Secundario
              </BotonBase>
              <BotonBase variante="fantasma" tamanio="lg">
                Fantasma
              </BotonBase>
              <BotonBase variante="secundario" tamanio="lg" disabled>
                Disabled
              </BotonBase>
            </div>
          </div>

          <aside className="panel-diseno-elevado rounded-[var(--radio-xl)] p-6 sm:p-8">
            <div className="space-y-4">
              <p className="etiqueta-tecnica">Direccion visual</p>

              <h2 className="titulo-seccion text-slate-950">
                El sistema evita lo generico y usa materialidad, contraste y
                precision visual.
              </h2>

              <ul className="grid gap-3 text-sm text-slate-700">
                <li className="rounded-[var(--radio-sm)] border border-[color:var(--color-borde)] bg-white/72 px-4 py-3">
                  Verdes minerales profundos como base de confianza.
                </li>
                <li className="rounded-[var(--radio-sm)] border border-[color:var(--color-borde)] bg-white/72 px-4 py-3">
                  Grafitos tecnicos para sobriedad y lectura premium.
                </li>
                <li className="rounded-[var(--radio-sm)] border border-[color:var(--color-borde)] bg-white/72 px-4 py-3">
                  Acentos metalicos y vivos solo en puntos de valor.
                </li>
              </ul>
            </div>
          </aside>
        </header>

        <section className="space-y-5">
          <div className="space-y-3">
            <span className="etiqueta-tecnica">Paleta de colores</span>
            <h2 className="titulo-seccion text-slate-950">
              Una paleta con tension entre precision industrial y sostenibilidad
              contemporanea
            </h2>
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            {gruposPaletaSistemaDiseno.map((grupo) => (
              <article
                key={grupo.nombre}
                className="panel-diseno rounded-[var(--radio-lg)] p-5 sm:p-6"
              >
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-slate-950">
                    {grupo.nombre}
                  </h3>
                  <p className="texto-soporte">{grupo.descripcion}</p>
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-3">
                  {grupo.muestras.map((muestra) => (
                    <MuestraColor key={muestra.nombre} {...muestra} />
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
          <article className="panel-diseno rounded-[var(--radio-lg)] p-5 sm:p-6">
            <div className="space-y-3">
              <span className="etiqueta-tecnica">Tipografia y jerarquia</span>
              <h2 className="titulo-seccion text-slate-950">
                Space Grotesk para estructura y Manrope para lectura sostenida
              </h2>
            </div>

            <div className="mt-6 grid gap-4">
              {escalaTipograficaSistemaDiseno.map((item) => (
                <article
                  key={item.nombre}
                  className="rounded-[var(--radio-md)] border border-[color:var(--color-borde)] bg-white/70 p-4"
                >
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-slate-950">
                      {item.nombre}
                    </p>
                    <div className={item.claseVista}>{item.muestra}</div>
                    <p className="texto-soporte">{item.uso}</p>
                  </div>
                </article>
              ))}
            </div>
          </article>

          <div className="grid gap-4">
            <article className="panel-diseno rounded-[var(--radio-lg)] p-5 sm:p-6">
              <div className="space-y-3">
                <span className="etiqueta-tecnica">Espaciados</span>
                <h2 className="text-2xl font-semibold text-slate-950">
                  Ritmo respirable
                </h2>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {escalaEspaciadosSistemaDiseno.map((item) => (
                  <TarjetaToken
                    key={item.token}
                    {...item}
                    muestra={
                      <div className="flex w-full items-center gap-3 px-4">
                        <div
                          aria-hidden="true"
                          style={{ width: `var(${item.token})` }}
                          className="h-3 rounded-full bg-[color:var(--color-primario-500)]"
                        />
                        <span className="text-xs text-slate-500">
                          {item.valor}
                        </span>
                      </div>
                    }
                  />
                ))}
              </div>
            </article>

            <article className="panel-diseno rounded-[var(--radio-lg)] p-5 sm:p-6">
              <div className="space-y-3">
                <span className="etiqueta-tecnica">Radios y sombras</span>
                <h2 className="text-2xl font-semibold text-slate-950">
                  Bordes suaves, no blandos
                </h2>
              </div>

              <div className="mt-5 grid gap-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  {escalaRadiosSistemaDiseno.map((item) => (
                    <TarjetaToken
                      key={item.token}
                      {...item}
                      muestra={
                        <div
                          aria-hidden="true"
                          style={{ borderRadius: `var(${item.token})` }}
                          className="h-16 w-28 border border-[color:var(--color-borde-fuerte)] bg-[linear-gradient(135deg,rgba(13,124,102,0.14),rgba(179,134,49,0.12))]"
                        />
                      }
                    />
                  ))}
                </div>

                <div className="grid gap-4">
                  {escalaSombrasSistemaDiseno.map((item) => (
                    <TarjetaToken
                      key={item.token}
                      {...item}
                      muestra={
                        <div
                          aria-hidden="true"
                          style={{ boxShadow: `var(${item.token})` }}
                          className="h-[4.5rem] w-full max-w-[11rem] rounded-[var(--radio-md)] border border-[color:var(--color-borde)] bg-white"
                        />
                      }
                    />
                  ))}
                </div>
              </div>
            </article>
          </div>
        </section>

        <section className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
          <article className="panel-diseno rounded-[var(--radio-lg)] p-5 sm:p-6">
            <div className="space-y-3">
              <span className="etiqueta-tecnica">Estados interactivos</span>
              <h2 className="titulo-seccion text-slate-950">
                Hover, focus, active y disabled con reglas visibles
              </h2>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <BotonBase variante="primario">Hover premium</BotonBase>
              <BotonBase variante="secundario">Superficie clara</BotonBase>
              <BotonBase variante="fantasma">Accion sutil</BotonBase>
              <BotonBase variante="primario" disabled>
                No disponible
              </BotonBase>
            </div>

            <div className="mt-6 grid gap-3">
              {estadosInteractivosSistemaDiseno.map((estado) => (
                <article
                  key={estado.nombre}
                  className="rounded-[var(--radio-md)] border border-[color:var(--color-borde)] bg-white/72 p-4"
                >
                  <p className="text-sm font-semibold text-slate-950">
                    {estado.nombre}
                  </p>
                  <p className="texto-soporte mt-2">{estado.criterio}</p>
                </article>
              ))}
            </div>
          </article>

          <article className="panel-diseno-oscuro rounded-[var(--radio-lg)] p-5 sm:p-6">
            <div className="space-y-3">
              <span className="etiqueta-tecnica etiqueta-tecnica-oscura">
                Lineamientos futuros
              </span>
              <h2 className="titulo-seccion text-white">
                Reglas visuales para componentes que vengan despues
              </h2>
              <p className="max-w-2xl text-sm leading-8 text-white/64">
                El sistema esta pensado para que botones, cards, inputs,
                banners, bloques editoriales y modulos comerciales futuros
                compartan una misma logica visual.
              </p>
            </div>

            <ul className="mt-6 grid gap-3">
              {lineamientosComponentesFuturos.map((lineamiento) => (
                <li
                  key={lineamiento}
                  className="rounded-[var(--radio-md)] border border-white/10 bg-white/5 px-4 py-4 text-sm leading-7 text-white/72"
                >
                  {lineamiento}
                </li>
              ))}
            </ul>
          </article>
        </section>
      </ContenedorPrincipal>
    </section>
  );
}
