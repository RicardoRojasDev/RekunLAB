"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { FormEvent } from "react";
import { useRef, useState, useTransition } from "react";
import {
  Boton,
  CampoTexto,
  EstadoVacio,
  Etiqueta,
  MensajeError,
  Selector,
  Tarjeta,
} from "@/compartido/componentes/ui";
import type { ProductoAdmin } from "@/modulos/admin-productos";
import type { ImagenProductoAdmin } from "../tipos/admin-imagenes";

type PropiedadesPaginaAdminImagenes = Readonly<{
  productos: readonly ProductoAdmin[];
  productoSeleccionado: ProductoAdmin | null;
  imagenes: readonly ImagenProductoAdmin[];
}>;

type EstadoFormularioSubida = Readonly<{
  alt: string;
  etiqueta: string;
  marcarComoPrincipal: boolean;
}>;

const tiposPermitidosTexto = "JPG, PNG, WEBP y AVIF";

function formatearFecha(fechaISO: string) {
  return new Intl.DateTimeFormat("es-CL", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "America/Santiago",
  }).format(new Date(fechaISO));
}

function varianteEstadoProducto(codigo: string) {
  if (codigo === "activo") {
    return "primaria";
  }

  if (codigo === "inactivo") {
    return "suave";
  }

  if (codigo === "eliminado") {
    return "critica";
  }

  return "oscura";
}

export function PaginaAdminImagenes({
  productos,
  productoSeleccionado,
  imagenes,
}: PropiedadesPaginaAdminImagenes) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const inputArchivoRef = useRef<HTMLInputElement | null>(null);
  const [formulario, setFormulario] = useState<EstadoFormularioSubida>({
    alt: "",
    etiqueta: "",
    marcarComoPrincipal: imagenes.length === 0,
  });
  const [errorVista, setErrorVista] = useState<string | null>(null);
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);
  const [subiendo, setSubiendo] = useState(false);
  const [imagenProcesandoId, setImagenProcesandoId] = useState<string | null>(null);
  const [navegando, startTransition] = useTransition();

  function cambiarProducto(productoId: string) {
    const query = new URLSearchParams(searchParams.toString());

    if (productoId) {
      query.set("producto", productoId);
    } else {
      query.delete("producto");
    }

    setErrorVista(null);
    setMensajeExito(null);

    startTransition(() => {
      router.replace(query.toString() ? `${pathname}?${query.toString()}` : pathname, {
        scroll: false,
      });
    });
  }

  async function recargarVista(mensaje?: string) {
    setErrorVista(null);

    if (mensaje) {
      setMensajeExito(mensaje);
    }

    router.refresh();
  }

  async function subirImagen(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();

    if (!productoSeleccionado) {
      setErrorVista("Debes seleccionar un producto antes de cargar imagenes.");
      return;
    }

    const archivo = inputArchivoRef.current?.files?.[0];

    if (!archivo) {
      setErrorVista("Debes seleccionar un archivo para subir.");
      return;
    }

    setSubiendo(true);
    setErrorVista(null);
    setMensajeExito(null);

    try {
      const data = new FormData();
      data.set("productoId", productoSeleccionado.id);
      data.set("archivo", archivo);
      data.set("alt", formulario.alt);
      data.set("etiqueta", formulario.etiqueta);
      data.set("marcarComoPrincipal", String(formulario.marcarComoPrincipal));

      const respuesta = await fetch("/api/admin/imagenes", {
        method: "POST",
        body: data,
      });
      const payload = (await respuesta.json()) as {
        ok: boolean;
        mensaje?: string;
        detalle?: string;
      };

      if (!respuesta.ok || !payload.ok) {
        throw new Error(payload.mensaje ?? "No pudimos subir la imagen.");
      }

      setFormulario({
        alt: "",
        etiqueta: "",
        marcarComoPrincipal: false,
      });

      if (inputArchivoRef.current) {
        inputArchivoRef.current.value = "";
      }

      await recargarVista(payload.mensaje ?? "Imagen subida correctamente.");
    } catch (error) {
      setErrorVista(
        error instanceof Error
          ? error.message
          : "No pudimos completar la subida de imagen.",
      );
    } finally {
      setSubiendo(false);
    }
  }

  async function marcarComoPrincipal(imagenId: string) {
    setImagenProcesandoId(imagenId);
    setErrorVista(null);
    setMensajeExito(null);

    try {
      const respuesta = await fetch(`/api/admin/imagenes/${imagenId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          accion: "marcar-principal",
        }),
      });
      const payload = (await respuesta.json()) as {
        ok: boolean;
        mensaje?: string;
      };

      if (!respuesta.ok || !payload.ok) {
        throw new Error(payload.mensaje ?? "No pudimos marcar la imagen como principal.");
      }

      await recargarVista(payload.mensaje ?? "Imagen principal actualizada.");
    } catch (error) {
      setErrorVista(
        error instanceof Error
          ? error.message
          : "No pudimos actualizar la imagen principal.",
      );
    } finally {
      setImagenProcesandoId(null);
    }
  }

  async function eliminarImagen(imagenId: string) {
    const confirmar = window.confirm(
      "Vas a eliminar la imagen del producto. Deseas continuar?",
    );

    if (!confirmar) {
      return;
    }

    setImagenProcesandoId(imagenId);
    setErrorVista(null);
    setMensajeExito(null);

    try {
      const respuesta = await fetch(`/api/admin/imagenes/${imagenId}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
        },
      });
      const payload = (await respuesta.json()) as {
        ok: boolean;
        mensaje?: string;
      };

      if (!respuesta.ok || !payload.ok) {
        throw new Error(payload.mensaje ?? "No pudimos eliminar la imagen.");
      }

      await recargarVista(payload.mensaje ?? "Imagen eliminada correctamente.");
    } catch (error) {
      setErrorVista(
        error instanceof Error
          ? error.message
          : "No pudimos eliminar la imagen seleccionada.",
      );
    } finally {
      setImagenProcesandoId(null);
    }
  }

  return (
    <section className="space-y-6">
      <Tarjeta
        variante="elevada"
        etiqueta={<Etiqueta variante="primaria">Imagenes</Etiqueta>}
        titulo="Gestion de imagenes"
        descripcion="Sube imagenes, asocialas a productos del catalogo y define cual debe verse como principal."
      >
        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-[var(--radio-md)] border border-[color:var(--color-borde)] bg-white/84 px-4 py-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Productos disponibles
            </p>
            <p className="mt-2 text-2xl font-semibold text-slate-950">{productos.length}</p>
          </div>
          <div className="rounded-[var(--radio-md)] border border-[color:var(--color-borde)] bg-white/84 px-4 py-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Producto seleccionado
            </p>
            <p className="mt-2 text-sm font-semibold text-slate-950">
              {productoSeleccionado?.nombreCompleto ??
                productoSeleccionado?.nombre ??
                "Sin seleccion"}
            </p>
          </div>
          <div className="rounded-[var(--radio-md)] border border-[color:var(--color-borde)] bg-white/84 px-4 py-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Imagenes asociadas
            </p>
            <p className="mt-2 text-2xl font-semibold text-slate-950">{imagenes.length}</p>
          </div>
        </div>
      </Tarjeta>

      {errorVista ? <MensajeError mensaje={errorVista} /> : null}

      {mensajeExito ? (
        <div className="rounded-[var(--radio-md)] border border-[rgba(14,124,103,0.18)] bg-[rgba(243,251,248,0.96)] px-4 py-4 text-sm leading-7 text-[color:var(--color-primario-800)]">
          {mensajeExito}
        </div>
      ) : null}

      <Tarjeta
        etiqueta={<Etiqueta variante="suave">Contexto</Etiqueta>}
        titulo="Producto para gestionar"
        descripcion="Selecciona el producto al que quieres asociar imagenes desde esta seccion o entra desde la administracion de productos."
        acciones={
          <Link
            href="/admin/productos"
            className="boton-base boton-secundario min-h-11 px-4 text-sm"
          >
            Ir a productos
          </Link>
        }
      >
        <div className="grid gap-4 xl:grid-cols-[1fr_1.1fr]">
          <Selector
            etiqueta="Producto"
            placeholder="Selecciona un producto"
            opciones={productos.map((producto) => ({
              valor: producto.id,
              etiqueta: producto.nombreCompleto ?? producto.nombre,
            }))}
            value={productoSeleccionado?.id ?? ""}
            onChange={(evento) => cambiarProducto(evento.target.value)}
          />

          {productoSeleccionado ? (
            <div className="rounded-[var(--radio-md)] border border-[color:var(--color-borde)] bg-white/84 px-4 py-4">
              <div className="flex flex-wrap gap-2">
                <Etiqueta variante={varianteEstadoProducto(productoSeleccionado.estado)}>
                  {productoSeleccionado.estadoNombre}
                </Etiqueta>
                <Etiqueta variante="suave">{productoSeleccionado.tipoProducto}</Etiqueta>
                <Etiqueta variante="suave">{productoSeleccionado.categoria}</Etiqueta>
              </div>
              <h2 className="mt-3 text-lg font-semibold text-slate-950">
                {productoSeleccionado.nombreCompleto ?? productoSeleccionado.nombre}
              </h2>
              <p className="mt-1 text-sm leading-7 text-slate-600">
                {productoSeleccionado.resumen}
              </p>
              <p className="mt-3 text-sm text-slate-500">
                Slug: {productoSeleccionado.slug}
              </p>
            </div>
          ) : (
            <EstadoVacio
              titulo="Aun no hay un producto seleccionado"
              descripcion="Selecciona un producto para ver sus imagenes y cargar nuevos archivos."
              claseName="min-h-[14rem]"
            />
          )}
        </div>

        {navegando ? (
          <p className="text-sm leading-7 text-slate-500">
            Cambiando el producto seleccionado...
          </p>
        ) : null}
      </Tarjeta>

      {productoSeleccionado ? (
        <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
          <Tarjeta
            etiqueta={<Etiqueta variante="suave">Carga</Etiqueta>}
            titulo="Subir nueva imagen"
            descripcion={`Archivos permitidos: ${tiposPermitidosTexto}. Tamano maximo: 5 MB.`}
          >
            <form className="space-y-4" onSubmit={subirImagen}>
              <div className="space-y-2">
                <label
                  htmlFor="archivo-producto"
                  className="text-sm font-semibold text-slate-950"
                >
                  Archivo de imagen
                </label>
                <input
                  id="archivo-producto"
                  ref={inputArchivoRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  className="block w-full rounded-[var(--radio-md)] border border-[color:var(--color-borde)] bg-white/84 px-4 py-3 text-sm text-slate-700 file:mr-4 file:rounded-full file:border-0 file:bg-[rgba(13,124,102,0.12)] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-[color:var(--color-primario-800)]"
                  disabled={subiendo}
                />
              </div>

              <CampoTexto
                etiqueta="Texto alternativo"
                obligatorio
                value={formulario.alt}
                onChange={(evento) =>
                  setFormulario((actual) => ({
                    ...actual,
                    alt: evento.target.value,
                  }))
                }
                placeholder={`Vista de ${productoSeleccionado.nombreCompleto ?? productoSeleccionado.nombre}`}
              />

              <CampoTexto
                etiqueta="Etiqueta interna"
                value={formulario.etiqueta}
                onChange={(evento) =>
                  setFormulario((actual) => ({
                    ...actual,
                    etiqueta: evento.target.value,
                  }))
                }
                placeholder="Ej. Vista frontal"
              />

              <label className="flex items-start gap-3 rounded-[var(--radio-md)] border border-[color:var(--color-borde)] bg-white/84 px-4 py-4">
                <input
                  type="checkbox"
                  checked={formulario.marcarComoPrincipal}
                  onChange={(evento) =>
                    setFormulario((actual) => ({
                      ...actual,
                      marcarComoPrincipal: evento.target.checked,
                    }))
                  }
                  className="mt-1 h-4 w-4 rounded border-[color:var(--color-borde-fuerte)]"
                />
                <span className="space-y-1">
                  <span className="block text-sm font-semibold text-slate-950">
                    Marcar como imagen principal
                  </span>
                  <span className="block text-sm leading-6 text-slate-600">
                    Si ya existe una principal, esta accion la reemplazara.
                  </span>
                </span>
              </label>

              <div className="flex justify-end">
                <Boton type="submit" cargando={subiendo}>
                  Subir imagen
                </Boton>
              </div>
            </form>
          </Tarjeta>

          <Tarjeta
            etiqueta={<Etiqueta variante="suave">Asociadas</Etiqueta>}
            titulo="Imagenes del producto"
            descripcion="Cada imagen queda asociada al producto seleccionado y puedes ajustar cual se muestra como principal."
          >
            {imagenes.length ? (
              <div className="grid gap-4 lg:grid-cols-2">
                {imagenes.map((imagen) => {
                  const estaProcesando = imagenProcesandoId === imagen.id;

                  return (
                    <article
                      key={imagen.id}
                      className="overflow-hidden rounded-[var(--radio-lg)] border border-[color:var(--color-borde)] bg-white/86 shadow-[var(--sombra-suave)]"
                    >
                      <div className="relative aspect-[4/4] bg-[linear-gradient(180deg,#eef3ef_0%,#f8faf8_100%)]">
                        <Image
                          src={imagen.url}
                          alt={imagen.alt}
                          fill
                          sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
                          className="object-cover"
                        />
                      </div>

                      <div className="space-y-3 px-4 py-4">
                        <div className="flex flex-wrap gap-2">
                          {imagen.esPrincipal ? (
                            <Etiqueta variante="premium">Principal</Etiqueta>
                          ) : (
                            <Etiqueta variante="suave">Secundaria</Etiqueta>
                          )}
                          {imagen.etiqueta ? (
                            <Etiqueta variante="suave">{imagen.etiqueta}</Etiqueta>
                          ) : null}
                        </div>

                        <div className="space-y-1">
                          <p className="text-sm font-semibold text-slate-950">{imagen.alt}</p>
                          <p className="text-sm leading-7 text-slate-600">
                            Orden visual {imagen.ordenVisual + 1}
                          </p>
                        </div>

                        <dl className="grid gap-2 text-sm text-slate-600">
                          <div className="flex items-center justify-between gap-3">
                            <dt>Subida</dt>
                            <dd>{formatearFecha(imagen.creadoEnISO)}</dd>
                          </div>
                          <div className="flex items-center justify-between gap-3">
                            <dt>Archivo</dt>
                            <dd>{imagen.nombreArchivoOriginal ?? "Sin nombre"}</dd>
                          </div>
                        </dl>

                        <div className="flex flex-wrap gap-2 pt-1">
                          <Boton
                            variante="secundario"
                            onClick={() => marcarComoPrincipal(imagen.id)}
                            disabled={estaProcesando || imagen.esPrincipal}
                          >
                            {imagen.esPrincipal ? "Imagen principal" : "Marcar principal"}
                          </Boton>
                          <Boton
                            variante="fantasma"
                            onClick={() => eliminarImagen(imagen.id)}
                            cargando={estaProcesando}
                          >
                            Eliminar
                          </Boton>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <EstadoVacio
                titulo="Este producto aun no tiene imagenes"
                descripcion="Carga la primera imagen para asociarla al catalogo y definir su vista principal."
                claseName="min-h-[20rem]"
              />
            )}
          </Tarjeta>
        </div>
      ) : (
        <EstadoVacio
          titulo="No hay productos disponibles para gestionar"
          descripcion="Primero necesitas al menos un producto en el catalogo para poder asociar imagenes."
          accion={
            <Link
              href="/admin/productos"
              className="boton-base boton-primario min-h-11 px-4 text-sm"
            >
              Ir a productos
            </Link>
          }
          claseName="min-h-[20rem]"
        />
      )}
    </section>
  );
}
