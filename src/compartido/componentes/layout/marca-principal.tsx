import Link from "next/link";
import { configuracionSitio } from "@/compartido/configuracion/sitio";
import { unirClases } from "@/compartido/utilidades/unir-clases";

type VarianteMarca = "clara" | "oscura";

type PropiedadesMarcaPrincipal = Readonly<{
  claseName?: string;
  mostrarDescriptor?: boolean;
  variante?: VarianteMarca;
}>;

export function MarcaPrincipal({
  claseName,
  mostrarDescriptor = true,
  variante = "oscura",
}: PropiedadesMarcaPrincipal) {
  const esVarianteClara = variante === "clara";

  return (
    <Link
      href="/"
      className={unirClases("group inline-flex items-center gap-3", claseName)}
      aria-label={`Ir al inicio de ${configuracionSitio.nombre}`}
    >
      <span
        aria-hidden="true"
        className={unirClases(
          "relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl border shadow-[0_20px_50px_rgba(9,24,21,0.12)]",
          esVarianteClara
            ? "border-white/12 bg-[linear-gradient(145deg,rgba(10,120,96,0.8),rgba(8,31,27,0.9))]"
            : "border-[color:var(--color-borde-fuerte)] bg-[linear-gradient(145deg,#12352f,#0d7c66)]",
        )}
      >
        <span className="absolute inset-[7px] rounded-xl border border-white/20" />
        <span className="absolute h-3 w-3 rounded-full bg-[#c9f36a]" />
        <span className="absolute h-7 w-7 rounded-full border border-white/18" />
      </span>

      <span className="flex flex-col">
        <span
          style={{ fontFamily: "var(--fuente-titulos)" }}
          className={unirClases(
            "text-base font-semibold tracking-[0.16em] uppercase",
            esVarianteClara ? "text-white" : "text-slate-950",
          )}
        >
          {configuracionSitio.nombre}
        </span>

        {mostrarDescriptor ? (
          <span
            className={unirClases(
              "text-xs tracking-[0.18em] uppercase",
              esVarianteClara ? "text-white/58" : "text-slate-500",
            )}
          >
            {configuracionSitio.descriptorMarca}
          </span>
        ) : null}
      </span>
    </Link>
  );
}
