import { Etiqueta } from "@/compartido/componentes/ui";
import { unirClases } from "@/compartido/utilidades/unir-clases";
import type {
  ConfiguracionVariantesProductoCatalogo,
  MapaOpcionesDisponiblesVariantesProductoCatalogo,
  SeleccionVarianteProductoCatalogo,
} from "../../tipos/producto-catalogo";

type PropiedadesSelectorVariantesProducto = Readonly<{
  configuracionVariantes: ConfiguracionVariantesProductoCatalogo;
  seleccion: SeleccionVarianteProductoCatalogo;
  opcionesDisponibles: MapaOpcionesDisponiblesVariantesProductoCatalogo;
  alSeleccionarOpcion: (codigoAtributo: string, opcionId: string) => void;
}>;

export function SelectorVariantesProducto({
  configuracionVariantes,
  seleccion,
  opcionesDisponibles,
  alSeleccionarOpcion,
}: PropiedadesSelectorVariantesProducto) {
  return (
    <section className="space-y-5" aria-label="Selector de variantes">
      {configuracionVariantes.atributos.map((atributo) => {
        const opciones =
          opcionesDisponibles[atributo.codigo] ??
          atributo.opciones.map((opcion) => ({
            ...opcion,
            disponible: true,
            seleccionada: seleccion[atributo.codigo] === opcion.id,
          }));
        const opcionSeleccionada = configuracionVariantes.atributos
          .find((item) => item.codigo === atributo.codigo)
          ?.opciones.find((opcion) => opcion.id === seleccion[atributo.codigo]);

        return (
          <div key={atributo.codigo} className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                {atributo.etiqueta}
              </p>
              {opcionSeleccionada ? (
                <Etiqueta variante="suave" tamanio="sm">
                  {opcionSeleccionada.etiqueta}
                </Etiqueta>
              ) : null}
            </div>

            <div className="flex flex-wrap gap-2">
              {opciones.map((opcion) => (
                <button
                  key={`${atributo.codigo}-${opcion.id}`}
                  type="button"
                  onClick={() =>
                    opcion.disponible
                      ? alSeleccionarOpcion(atributo.codigo, opcion.id)
                      : undefined
                  }
                  disabled={!opcion.disponible}
                  aria-pressed={opcion.seleccionada}
                  className={unirClases(
                    "inline-flex min-h-11 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition",
                    opcion.seleccionada
                      ? "border-[color:var(--color-borde-fuerte)] bg-white text-slate-950 shadow-[0_14px_30px_rgba(10,22,20,0.12)]"
                      : "border-[color:var(--color-borde)] bg-white/74 text-slate-700 hover:border-[color:var(--color-borde-fuerte)] hover:bg-white",
                    !opcion.disponible
                      ? "cursor-not-allowed border-[color:var(--color-borde-suave)] bg-[color:var(--color-disabled-fondo)] text-[color:var(--color-disabled-texto)] shadow-none"
                      : undefined,
                  )}
                >
                  {atributo.tipoPresentacion === "color" ? (
                    <span
                      aria-hidden="true"
                      className="h-4 w-4 rounded-full border border-black/8"
                      style={{
                        backgroundColor: opcion.colorHex ?? "#d9e1dc",
                      }}
                    />
                  ) : null}
                  <span>{opcion.etiqueta}</span>
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </section>
  );
}
