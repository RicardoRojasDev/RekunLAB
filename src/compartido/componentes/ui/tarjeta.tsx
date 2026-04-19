import type { HTMLAttributes, ReactNode } from "react";
import { Contenedor } from "./contenedor";

type VarianteTarjeta = "base" | "elevada" | "oscura";

export type PropiedadesTarjeta = Readonly<
  Omit<HTMLAttributes<HTMLElement>, "className" | "children"> & {
    claseName?: string;
    etiqueta?: ReactNode;
    titulo?: string;
    descripcion?: string;
    acciones?: ReactNode;
    pie?: ReactNode;
    children?: ReactNode;
    variante?: VarianteTarjeta;
  }
>;

export function Tarjeta({
  claseName,
  etiqueta,
  titulo,
  descripcion,
  acciones,
  pie,
  children,
  variante = "base",
  ...propiedadesTarjeta
}: PropiedadesTarjeta) {
  const varianteContenedor =
    variante === "elevada" ? "elevado" : variante === "oscura" ? "oscuro" : "base";

  return (
    <Contenedor
      etiquetaHtml="article"
      variante={varianteContenedor}
      claseName={claseName}
      {...propiedadesTarjeta}
    >
      <div className="flex flex-col gap-5">
        {etiqueta || titulo || descripcion || acciones ? (
          <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-2">
              {etiqueta}
              {titulo ? (
                <h2 className="text-xl font-semibold text-current">{titulo}</h2>
              ) : null}
              {descripcion ? (
                <p
                  className={
                    variante === "oscura" ? "text-sm leading-7 text-white/68" : "texto-soporte"
                  }
                >
                  {descripcion}
                </p>
              ) : null}
            </div>

            {acciones ? <div className="shrink-0">{acciones}</div> : null}
          </header>
        ) : null}

        {children ? <div className="space-y-4">{children}</div> : null}

        {pie ? <footer className="border-t border-[color:var(--color-borde)] pt-4">{pie}</footer> : null}
      </div>
    </Contenedor>
  );
}
