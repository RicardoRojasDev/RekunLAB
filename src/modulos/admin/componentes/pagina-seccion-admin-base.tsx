import Link from "next/link";
import { EstadoVacio, Etiqueta, Tarjeta } from "@/compartido/componentes/ui";
import { PanelPreparacionAdmin } from "./panel-preparacion-admin";

type ItemSeccionAdminBase = Readonly<{
  titulo: string;
  descripcion: string;
}>;

type PropiedadesPaginaSeccionAdminBase = Readonly<{
  etiqueta: string;
  titulo: string;
  descripcion: string;
  resumen: string;
  preparado: readonly ItemSeccionAdminBase[];
  siguientePaso: readonly ItemSeccionAdminBase[];
}>;

export function PaginaSeccionAdminBase({
  etiqueta,
  titulo,
  descripcion,
  resumen,
  preparado,
  siguientePaso,
}: PropiedadesPaginaSeccionAdminBase) {
  return (
    <section className="space-y-6">
      <Tarjeta
        variante="elevada"
        etiqueta={<Etiqueta variante="primaria">{etiqueta}</Etiqueta>}
        titulo={titulo}
        descripcion={descripcion}
      >
        <div className="rounded-[var(--radio-md)] border border-[color:var(--color-borde)] bg-white/80 px-4 py-4 text-sm leading-7 text-slate-700">
          {resumen}
        </div>
      </Tarjeta>

      <div className="grid gap-4 xl:grid-cols-[1.02fr_0.98fr]">
        <PanelPreparacionAdmin
          etiqueta="Base disponible"
          titulo="Lo que ya queda preparado"
          descripcion="La seccion ya tiene un punto de entrada claro dentro del backoffice."
          items={preparado}
        />

        <PanelPreparacionAdmin
          etiqueta="Siguiente modulo"
          titulo="Siguiente capa a implementar"
          descripcion="Esta base evita rehacer layout o navegacion cuando llegue el CRUD o la operacion real."
          items={siguientePaso}
          variante="base"
        />
      </div>

      <EstadoVacio
        titulo="Seccion preparada para crecer"
        descripcion="Todavia no hay herramientas activas en esta vista. La base ya esta lista para recibir formularios, tablas o conectores en el siguiente modulo correspondiente."
        accion={
          <Link
            href="/admin"
            className="boton-base boton-secundario min-h-11 px-4 text-sm"
          >
            Volver al dashboard admin
          </Link>
        }
        claseName="min-h-[18rem]"
      />
    </section>
  );
}
