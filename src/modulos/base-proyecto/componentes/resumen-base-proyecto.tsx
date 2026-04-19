"use client";

import { useState } from "react";
import { ContenedorPrincipal } from "@/compartido/componentes/base/contenedor-principal";
import {
  AreaTexto,
  Boton,
  CampoTexto,
  Cargador,
  Contenedor,
  EstadoVacio,
  Etiqueta,
  MensajeError,
  ModalBase,
  Selector,
  Tarjeta,
} from "@/compartido/componentes/ui";

const resumenComponentes = [
  "Boton",
  "CampoTexto",
  "AreaTexto",
  "Selector",
  "Etiqueta",
  "Tarjeta",
  "Contenedor",
  "Cargador",
  "EstadoVacio",
  "MensajeError",
  "ModalBase",
] as const;

const opcionesServicio = [
  { valor: "prototipo", etiqueta: "Prototipo funcional" },
  { valor: "produccion", etiqueta: "Produccion por lote" },
  { valor: "reciclaje", etiqueta: "Reciclaje de plastico" },
] as const;

export function ResumenBaseProyecto() {
  const [modalAbierto, setModalAbierto] = useState(false);

  return (
    <section>
      <ContenedorPrincipal claseName="flex flex-col gap-[var(--espacio-xl)] pb-[var(--espacio-xl)]">
        <header className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          <div className="space-y-6">
            <Etiqueta variante="primaria">Modulo 5 - Componentes UI base</Etiqueta>

            <div className="space-y-4">
              <h1 className="titulo-display max-w-5xl text-slate-950">
                Biblioteca UI inicial para acelerar el ecommerce sin duplicar
                estilos ni composicion
              </h1>

              <p className="texto-destacado max-w-3xl">
                La libreria base ya resuelve acciones, formularios, superficies
                y estados comunes con una API en espanol y consistente con el
                sistema de diseno de Rekun LAB.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Boton tamanio="lg">Primario</Boton>
              <Boton variante="secundario" tamanio="lg">
                Secundario
              </Boton>
              <Boton variante="fantasma" tamanio="lg">
                Fantasma
              </Boton>
              <Boton variante="secundario" tamanio="lg" onClick={() => setModalAbierto(true)}>
                Abrir modal base
              </Boton>
            </div>
          </div>

          <Contenedor variante="elevado" relleno="lg">
            <div className="space-y-4">
              <Etiqueta variante="premium">Cobertura del modulo</Etiqueta>

              <h2 className="titulo-seccion text-slate-950">
                Componentes reutilizables, props limpias y base lista para
                crecer
              </h2>

              <div className="flex flex-wrap gap-2">
                {resumenComponentes.map((item) => (
                  <Etiqueta key={item} variante="suave" tamanio="sm">
                    {item}
                  </Etiqueta>
                ))}
              </div>
            </div>
          </Contenedor>
        </header>

        <section className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
          <Tarjeta
            variante="elevada"
            etiqueta={<Etiqueta variante="primaria">Formulario base</Etiqueta>}
            titulo="Campos consistentes para futuras cotizaciones, contacto y flujos de compra"
            descripcion="Los campos comparten label, ayuda, error, focus y superficie para que no aparezcan variantes improvisadas en cada modulo."
          >
            <div className="grid gap-4 md:grid-cols-2">
              <CampoTexto
                etiqueta="Nombre del proyecto"
                placeholder="Ej. Soporte tecnico reciclado"
                ayuda="Usa una descripcion corta y clara."
              />

              <Selector
                etiqueta="Tipo de servicio"
                placeholder="Selecciona una opcion"
                opciones={opcionesServicio}
                ayuda="Selector reutilizable con placeholder y lista declarativa."
                defaultValue=""
              />
            </div>

            <AreaTexto
              etiqueta="Descripcion"
              placeholder="Resume el objetivo, material deseado y volumen aproximado."
              ayuda="Area de texto base con el mismo sistema visual del campo simple."
            />

            <CampoTexto
              etiqueta="Correo de contacto"
              placeholder="contacto@rekunlab.cl"
              error="Ejemplo de error visual para validar estados."
              defaultValue="correo-invalido"
            />
          </Tarjeta>

          <div className="grid gap-4">
            <Tarjeta
              etiqueta={<Etiqueta variante="premium">Etiquetas y estados</Etiqueta>}
              titulo="Microcomponentes listos para contexto, filtros y status"
              descripcion="Las etiquetas mantienen jerarquia y color controlado."
            >
              <div className="flex flex-wrap gap-2">
                <Etiqueta variante="suave">Base</Etiqueta>
                <Etiqueta variante="primaria">Primaria</Etiqueta>
                <Etiqueta variante="premium">Premium</Etiqueta>
                <Etiqueta variante="oscura">Oscura</Etiqueta>
                <Etiqueta variante="critica">Error</Etiqueta>
              </div>
            </Tarjeta>

            <Contenedor variante="base">
              <div className="space-y-4">
                <Etiqueta variante="suave">Cargador</Etiqueta>
                <Cargador etiqueta="Preparando biblioteca UI" />
              </div>
            </Contenedor>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          <Tarjeta
            etiqueta={<Etiqueta variante="primaria">Tarjeta</Etiqueta>}
            titulo="Superficie editorial"
            descripcion="Componente pensado para resumenes, destacados o bloques comerciales."
            acciones={<Boton variante="fantasma" tamanio="sm">Accion</Boton>}
            pie={
              <div className="flex items-center justify-between gap-3 text-sm text-slate-600">
                <span>Pie opcional</span>
                <Etiqueta variante="suave" tamanio="sm">
                  Reusable
                </Etiqueta>
              </div>
            }
          >
            <p className="texto-soporte">
              La tarjeta compone encabezado, acciones, cuerpo y pie sin forzar
              una estructura cerrada.
            </p>
          </Tarjeta>

          <EstadoVacio
            titulo="Nada configurado todavia"
            descripcion="Estado base para tablas, listados, favoritos o resultados sin contenido."
            accion={<Boton variante="secundario">Crear primer item</Boton>}
            icono={<span aria-hidden="true">O</span>}
          />

          <MensajeError
            titulo="Fallo controlado"
            mensaje="Este componente resume errores de red, respuestas fallidas o acciones no completadas."
            detalle="Se puede combinar con acciones de reintento o soporte sin mezclar logica de dominio."
            accion={<Boton variante="fantasma">Reintentar</Boton>}
          />
        </section>

        <section className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
          <Contenedor variante="oscuro" relleno="lg">
            <div className="space-y-4">
              <Etiqueta variante="oscura">Contenedor</Etiqueta>
              <h2 className="titulo-seccion text-white">
                Superficie base para bloques oscuros de alto contraste
              </h2>
              <p className="text-sm leading-8 text-white/66">
                El contenedor unifica radio, sombra, materialidad y relleno. Es
                la base compartida de tarjetas, estados y paneles especiales.
              </p>
            </div>
          </Contenedor>

          <Tarjeta
            variante="elevada"
            etiqueta={<Etiqueta variante="premium">Composicion</Etiqueta>}
            titulo="Buenas practicas de uso"
            descripcion="Los componentes aceptan contenido compuesto, pero mantienen API limpia y semantica visual estable."
          >
            <ul className="grid gap-3 text-sm leading-7 text-slate-700">
              <li className="rounded-[var(--radio-sm)] border border-[color:var(--color-borde)] bg-white/72 px-4 py-3">
                Usa `Tarjeta` para estructura editorial y `Contenedor` para superficies libres.
              </li>
              <li className="rounded-[var(--radio-sm)] border border-[color:var(--color-borde)] bg-white/72 px-4 py-3">
                Usa `CampoTexto`, `AreaTexto` y `Selector` para formularios con estados coherentes.
              </li>
              <li className="rounded-[var(--radio-sm)] border border-[color:var(--color-borde)] bg-white/72 px-4 py-3">
                Usa `Etiqueta`, `Cargador`, `EstadoVacio` y `MensajeError` para microestados comunes del ecommerce.
              </li>
            </ul>
          </Tarjeta>
        </section>

        <ModalBase
          abierto={modalAbierto}
          alCerrar={() => setModalAbierto(false)}
          titulo="Modal base"
          descripcion="Base reusable para confirmaciones, contenido contextual o acciones futuras del ecommerce."
          pie={
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Boton variante="fantasma" onClick={() => setModalAbierto(false)}>
                Cerrar
              </Boton>
              <Boton onClick={() => setModalAbierto(false)}>Entendido</Boton>
            </div>
          }
        >
          <div className="space-y-4">
            <p className="texto-soporte">
              Este modal no trae logica de negocio. Solo resuelve estructura,
              foco visual, cierre por escape y click fuera para futuras
              interacciones del proyecto.
            </p>

            <Contenedor variante="base">
              <div className="space-y-3">
                <Etiqueta variante="primaria">Uso recomendado</Etiqueta>
                <p className="text-sm leading-7 text-slate-700">
                  Confirmaciones de acciones, previews ligeros, contenido
                  contextual o formularios auxiliares.
                </p>
              </div>
            </Contenedor>
          </div>
        </ModalBase>
      </ContenedorPrincipal>
    </section>
  );
}
