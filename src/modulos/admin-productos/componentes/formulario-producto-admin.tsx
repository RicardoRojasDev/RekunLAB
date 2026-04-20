"use client";

import type { FormEvent } from "react";
import { useId } from "react";
import {
  AreaTexto,
  Boton,
  CampoTexto,
  Etiqueta,
  Selector,
} from "@/compartido/componentes/ui";
import type {
  DatosFormularioProductoAdmin,
  OpcionesAdminProductos,
} from "../tipos/admin-productos";

type PropiedadesFormularioProductoAdmin = Readonly<{
  modo: "crear" | "editar";
  opciones: OpcionesAdminProductos;
  valores: DatosFormularioProductoAdmin;
  error: string | null;
  guardando: boolean;
  alCancelar: () => void;
  alEnviar: (evento: FormEvent<HTMLFormElement>) => void;
  alCambiarCampo: <Campo extends keyof DatosFormularioProductoAdmin>(
    campo: Campo,
    valor: DatosFormularioProductoAdmin[Campo],
  ) => void;
}>;

function CampoCasilla({
  etiqueta,
  ayuda,
  activado,
  alCambiar,
}: Readonly<{
  etiqueta: string;
  ayuda: string;
  activado: boolean;
  alCambiar: (valor: boolean) => void;
}>) {
  const id = useId().replace(/:/g, "");

  return (
    <label
      htmlFor={id}
      className="flex min-h-16 items-start gap-3 rounded-[var(--radio-md)] border border-[color:var(--color-borde)] bg-white/80 px-4 py-4 transition-colors hover:border-[color:var(--color-borde-fuerte)]"
    >
      <input
        id={id}
        type="checkbox"
        checked={activado}
        onChange={(evento) => alCambiar(evento.target.checked)}
        className="mt-1 h-4 w-4 rounded border-[color:var(--color-borde-fuerte)] text-[color:var(--color-primario-700)]"
      />

      <span className="space-y-1">
        <span className="block text-sm font-semibold text-slate-950">{etiqueta}</span>
        <span className="block text-sm leading-6 text-slate-600">{ayuda}</span>
      </span>
    </label>
  );
}

export function FormularioProductoAdmin({
  modo,
  opciones,
  valores,
  error,
  guardando,
  alCancelar,
  alEnviar,
  alCambiarCampo,
}: PropiedadesFormularioProductoAdmin) {
  return (
    <form className="space-y-6" onSubmit={alEnviar}>
      <section className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
              Base comercial
            </h3>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Datos principales del producto para catalogo, ficha publica y operacion
              interna.
            </p>
          </div>

          <Etiqueta variante="suave">
            {modo === "crear" ? "Nuevo producto" : "Edicion"}
          </Etiqueta>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <CampoTexto
            etiqueta="Nombre"
            obligatorio
            value={valores.nombre}
            onChange={(evento) => alCambiarCampo("nombre", evento.target.value)}
            placeholder="Ej. Rekun PLA Negro"
          />

          <CampoTexto
            etiqueta="Nombre completo"
            value={valores.nombreCompleto ?? ""}
            onChange={(evento) =>
              alCambiarCampo("nombreCompleto", evento.target.value || undefined)
            }
            placeholder="Ej. Mapu - Ocre Tierra"
          />

          <CampoTexto
            etiqueta="Slug"
            obligatorio
            ayuda="Usa minusculas, numeros y guiones."
            value={valores.slug}
            onChange={(evento) => alCambiarCampo("slug", evento.target.value)}
            placeholder="mapu-ocre-tierra"
          />

          <CampoTexto
            etiqueta="SKU base"
            obligatorio
            value={valores.skuBase}
            onChange={(evento) => alCambiarCampo("skuBase", evento.target.value)}
            placeholder="PROD-036"
          />

          <Selector
            etiqueta="Categoria"
            obligatorio
            placeholder="Selecciona una categoria"
            opciones={opciones.categorias.map((categoria) => ({
              valor: categoria.id,
              etiqueta: categoria.nombre,
            }))}
            value={valores.categoriaId}
            onChange={(evento) => alCambiarCampo("categoriaId", evento.target.value)}
          />

          <CampoTexto
            etiqueta="Subcategoria"
            value={valores.subcategoria ?? ""}
            onChange={(evento) =>
              alCambiarCampo("subcategoria", evento.target.value || undefined)
            }
            placeholder="Ej. Premium Tecnologia"
          />

          <CampoTexto
            etiqueta="Tipo de producto"
            obligatorio
            ayuda="Campo abierto para que el catalogo pueda evolucionar."
            value={valores.tipoProducto}
            onChange={(evento) =>
              alCambiarCampo("tipoProducto", evento.target.value)
            }
            placeholder="Filamento / Impresora / Pack"
          />

          <CampoTexto
            etiqueta="Precio CLP"
            obligatorio
            type="number"
            min={0}
            step={1}
            value={String(valores.precioCLP)}
            onChange={(evento) =>
              alCambiarCampo("precioCLP", Number(evento.target.value || 0))
            }
            placeholder="17990"
          />

          <Selector
            etiqueta="Marca"
            placeholder="Sin marca asociada"
            opciones={opciones.marcas.map((marca) => ({
              valor: marca.id,
              etiqueta: marca.nombre,
            }))}
            value={valores.marcaId ?? ""}
            onChange={(evento) =>
              alCambiarCampo("marcaId", evento.target.value || undefined)
            }
          />

          <Selector
            etiqueta="Nivel comercial"
            placeholder="Sin nivel asignado"
            opciones={opciones.niveles.map((nivel) => ({
              valor: nivel.id,
              etiqueta: nivel.nombre,
            }))}
            value={valores.nivelId ?? ""}
            onChange={(evento) =>
              alCambiarCampo("nivelId", evento.target.value || undefined)
            }
          />

          <Selector
            etiqueta="Estado"
            obligatorio
            opciones={opciones.estados.map((estado) => ({
              valor: estado.id,
              etiqueta: estado.nombre,
            }))}
            value={valores.estadoId}
            onChange={(evento) => alCambiarCampo("estadoId", evento.target.value)}
          />

          <CampoTexto
            etiqueta="Coleccion"
            value={valores.coleccion ?? ""}
            onChange={(evento) =>
              alCambiarCampo("coleccion", evento.target.value || undefined)
            }
            placeholder="Ej. Herencia ancestral"
          />
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
            Atributos tecnicos y visuales
          </h3>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            Completa solo los campos que apliquen al tipo de producto.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <CampoTexto
            etiqueta="Formato"
            value={valores.formato ?? ""}
            onChange={(evento) =>
              alCambiarCampo("formato", evento.target.value || undefined)
            }
            placeholder="Ej. 1KG"
          />

          <CampoTexto
            etiqueta="Peso (kg)"
            type="number"
            min={0}
            step="0.01"
            value={valores.pesoKg === undefined ? "" : String(valores.pesoKg)}
            onChange={(evento) =>
              alCambiarCampo(
                "pesoKg",
                evento.target.value.length
                  ? Number(evento.target.value.replace(",", "."))
                  : undefined,
              )
            }
            placeholder="1"
          />

          <CampoTexto
            etiqueta="Acabado"
            value={valores.acabado ?? ""}
            onChange={(evento) =>
              alCambiarCampo("acabado", evento.target.value || undefined)
            }
            placeholder="Mate / Satinado / Silk"
          />

          <CampoTexto
            etiqueta="Efecto"
            value={valores.efecto ?? ""}
            onChange={(evento) =>
              alCambiarCampo("efecto", evento.target.value || undefined)
            }
            placeholder="Profundidad / UV / Doble color"
          />

          <CampoTexto
            etiqueta="Color hexadecimal"
            value={valores.colorHex ?? ""}
            onChange={(evento) =>
              alCambiarCampo("colorHex", evento.target.value || undefined)
            }
            placeholder="#111111"
          />
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <CampoCasilla
            etiqueta="Compatible PLA"
            ayuda="Usa esta marca solo cuando corresponda al comportamiento real del producto."
            activado={Boolean(valores.compatiblePLA)}
            alCambiar={(valor) => alCambiarCampo("compatiblePLA", valor)}
          />

          <CampoCasilla
            etiqueta="Producto destacado"
            ayuda="Permite marcar el producto como destacado dentro de la operacion comercial."
            activado={valores.esDestacado}
            alCambiar={(valor) => alCambiarCampo("esDestacado", valor)}
          />
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
            Contenido de la ficha
          </h3>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            Estos textos alimentan el detalle publico del producto.
          </p>
        </div>

        <AreaTexto
          etiqueta="Resumen"
          obligatorio
          rows={3}
          value={valores.resumen}
          onChange={(evento) => alCambiarCampo("resumen", evento.target.value)}
          placeholder="Descripcion corta y clara del producto."
        />

        <AreaTexto
          etiqueta="Descripcion"
          obligatorio
          rows={6}
          value={valores.descripcion}
          onChange={(evento) =>
            alCambiarCampo("descripcion", evento.target.value)
          }
          placeholder="Ficha descriptiva con enfoque comercial y tecnico."
        />
      </section>

      {error ? (
        <div className="rounded-[var(--radio-md)] border border-[rgba(180,78,58,0.18)] bg-[rgba(255,248,246,0.95)] px-4 py-4 text-sm leading-7 text-[color:var(--color-error-700)]">
          {error}
        </div>
      ) : null}

      <div className="flex flex-col-reverse gap-3 border-t border-[color:var(--color-borde)] pt-4 sm:flex-row sm:justify-end">
        <Boton
          type="button"
          variante="secundario"
          onClick={alCancelar}
          disabled={guardando}
        >
          Cancelar
        </Boton>
        <Boton type="submit" cargando={guardando}>
          {modo === "crear" ? "Crear producto" : "Guardar cambios"}
        </Boton>
      </div>
    </form>
  );
}
