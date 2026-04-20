"use client";

import Link from "next/link";
import { ContenedorPrincipal } from "@/compartido/componentes/base/contenedor-principal";
import { Cargador, Etiqueta, Tarjeta } from "@/compartido/componentes/ui";
import { useCarrito } from "../hooks/use-carrito";
import { EstadoVacioCarrito } from "./estado-vacio-carrito";
import { ListaItemsCarrito } from "./lista-items-carrito";
import { ResumenCarrito } from "./resumen-carrito";

export function PaginaCarritoCompras() {
  const { hidratado, items, resumen } = useCarrito();

  return (
    <section aria-labelledby="titulo-carrito">
      <ContenedorPrincipal claseName="flex flex-col gap-[var(--espacio-xl)] pb-[var(--espacio-2xl)]">
        <nav
          aria-label="Ruta de navegacion"
          className="flex flex-wrap items-center gap-2 text-sm text-slate-500"
        >
          <Link href="/" className="hover:text-slate-900">
            Inicio
          </Link>
          <span aria-hidden="true">/</span>
          <Link href="/catalogo" className="hover:text-slate-900">
            Catalogo
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-slate-900">Carrito</span>
        </nav>

        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Etiqueta variante="primaria">Carrito activo</Etiqueta>
            <Etiqueta variante="suave">Persistencia local</Etiqueta>
            <Etiqueta variante="premium">IVA incluido</Etiqueta>
          </div>

          <div className="space-y-3">
            <h1
              id="titulo-carrito"
              className="font-[var(--fuente-titulos)] text-[clamp(2.4rem,5vw,4.4rem)] font-semibold leading-[0.96] tracking-[-0.05em] text-slate-950"
            >
              Tu seleccion de compra
            </h1>
            <p className="max-w-3xl text-base leading-8 text-slate-600 sm:text-[1.05rem]">
              Ajusta cantidades, elimina productos o sigue explorando el
              catalogo. Desde aqui puedes pasar al checkout para validar tus
              datos, direccion y registrar el pedido en Supabase.
            </p>
          </div>
        </div>

        {!hidratado ? (
          <div className="flex min-h-[24rem] flex-col items-center justify-center gap-4 rounded-[var(--radio-lg)] border border-[color:var(--color-borde)] bg-white/72 px-6 py-10 text-center shadow-[var(--sombra-panel)]">
            <Cargador tamanio="lg" />
            <p className="text-sm text-slate-500">
              Recuperando el carrito guardado en este dispositivo...
            </p>
          </div>
        ) : !items.length ? (
          <EstadoVacioCarrito
            accion={
              <Link
                href="/catalogo"
                className="boton-base boton-primario min-h-11 px-4 text-sm"
              >
                Ir al catalogo
              </Link>
            }
          />
        ) : (
          <div className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr] xl:items-start">
            <Tarjeta
              variante="elevada"
              etiqueta={<Etiqueta variante="primaria">Productos</Etiqueta>}
              titulo="Items agregados al carrito"
              descripcion="Cada linea mantiene su precio con IVA y, cuando corresponde, la variante seleccionada."
            >
              <ListaItemsCarrito items={items} modo="pagina" />
            </Tarjeta>

            <div className="xl:sticky xl:top-28">
              <ResumenCarrito
                resumen={resumen}
                pie={
                  <div className="grid gap-3">
                    <Link
                      href="/checkout"
                      className="boton-base boton-primario min-h-11 justify-center px-4 text-sm"
                    >
                      Ir al checkout
                    </Link>

                    <Link
                      href="/catalogo"
                      className="boton-base boton-secundario min-h-11 justify-center px-4 text-sm"
                    >
                      Seguir explorando
                    </Link>

                    <p className="text-xs leading-6 text-slate-500">
                      El checkout actual valida datos y crea el pedido. El pago
                      real y los correos transaccionales se integran en los
                      modulos siguientes.
                    </p>
                  </div>
                }
              />
            </div>
          </div>
        )}
      </ContenedorPrincipal>
    </section>
  );
}
