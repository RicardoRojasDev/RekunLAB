import type { ReactNode } from "react";
import { Contenedor, Etiqueta } from "@/compartido/componentes/ui";
import { formatearPrecioClp } from "@/compartido/utilidades/formatear-precio-clp";
import type { ResumenCarrito as TipoResumenCarrito } from "../tipos/carrito";

type ModoResumenCarrito = "pagina" | "drawer";

type PropiedadesResumenCarrito = Readonly<{
  resumen: TipoResumenCarrito;
  modo?: ModoResumenCarrito;
  pie?: ReactNode;
}>;

function FilaResumenCarrito({
  etiqueta,
  valor,
  destacado = false,
}: Readonly<{
  etiqueta: string;
  valor: string;
  destacado?: boolean;
}>) {
  return (
    <div className="flex items-end justify-between gap-4 rounded-[var(--radio-md)] border border-[color:var(--color-borde)] bg-white/78 px-4 py-4">
      <dt className="text-sm text-slate-600">{etiqueta}</dt>
      <dd
        className={
          destacado
            ? "font-[var(--fuente-titulos)] text-2xl font-semibold tracking-[-0.04em] text-slate-950"
            : "text-sm font-semibold text-slate-950"
        }
      >
        {valor}
      </dd>
    </div>
  );
}

export function ResumenCarrito({
  resumen,
  modo = "pagina",
  pie,
}: PropiedadesResumenCarrito) {
  return (
    <Contenedor
      variante={modo === "pagina" ? "elevado" : "base"}
      relleno={modo === "pagina" ? "lg" : "md"}
    >
      <div className="space-y-5">
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <Etiqueta variante="primaria">Resumen</Etiqueta>
            <Etiqueta variante="suave">IVA incluido</Etiqueta>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-slate-950">
              Subtotal del carrito
            </h2>
            <p className="texto-soporte">
              Esta capa ya conversa con checkout y conserva los datos
              comerciales necesarios para registrar pedidos reales.
            </p>
          </div>
        </div>

        <dl className="grid gap-3">
          <FilaResumenCarrito
            etiqueta="Productos distintos"
            valor={String(resumen.cantidadLineas)}
          />
          <FilaResumenCarrito
            etiqueta="Unidades"
            valor={String(resumen.cantidadUnidades)}
          />
          <FilaResumenCarrito
            etiqueta="Subtotal"
            valor={formatearPrecioClp(resumen.subtotalIvaIncluido)}
            destacado
          />
        </dl>

        <p className="text-xs leading-6 text-slate-500">
          Todos los precios mostrados consideran IVA incluido segun la regla
          comercial definida para Rekun LAB.
        </p>

        {pie ? (
          <div className="border-t border-[color:var(--color-borde)] pt-4">
            {pie}
          </div>
        ) : null}
      </div>
    </Contenedor>
  );
}
