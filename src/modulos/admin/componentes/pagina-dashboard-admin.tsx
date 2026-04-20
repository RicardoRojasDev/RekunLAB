import Link from "next/link";
import { EstadoVacio, Etiqueta, Tarjeta } from "@/compartido/componentes/ui";
import { enlacesNavegacionAdmin } from "../configuracion/navegacion-admin";
import { PanelPreparacionAdmin } from "./panel-preparacion-admin";

const itemsBaseDashboard = [
  {
    titulo: "Acceso administrado",
    descripcion:
      "El ingreso al panel queda separado de la tienda publica y validado antes de renderizar la zona interna.",
  },
  {
    titulo: "Navegacion lista para crecer",
    descripcion:
      "Productos, pedidos e imagenes ya tienen punto de entrada propio para sumar modulos sin rehacer el layout.",
  },
  {
    titulo: "Shell reutilizable",
    descripcion:
      "Sidebar, encabezado y superficies comparten el mismo sistema visual para mantener consistencia operativa.",
  },
] as const;

const itemsSiguientesModulos = [
  {
    titulo: "Modulo 20",
    descripcion: "Administracion de productos y categorias.",
  },
  {
    titulo: "Modulo 21",
    descripcion: "Operacion diaria y gestion de pedidos.",
  },
  {
    titulo: "Modulo 22",
    descripcion: "Gestion de imagenes y storage sobre Supabase.",
  },
] as const;

export function PaginaDashboardAdmin() {
  return (
    <section className="space-y-6">
      <div className="grid gap-4 xl:grid-cols-[1.08fr_0.92fr]">
        <Tarjeta
          variante="elevada"
          etiqueta={<Etiqueta variante="primaria">Resumen</Etiqueta>}
          titulo="Base del panel administrador"
          descripcion="Este dashboard concentra la entrada al backoffice y deja preparada la navegacion interna para seguir construyendo operacion real."
        >
          <div className="grid gap-3 md:grid-cols-2">
            {enlacesNavegacionAdmin.map((enlace) => (
              <Link
                key={enlace.href}
                href={enlace.href}
                className="rounded-[var(--radio-md)] border border-[color:var(--color-borde)] bg-white/80 px-4 py-4 transition-colors hover:border-[color:var(--color-borde-fuerte)] hover:bg-white"
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  {enlace.claveVisual}
                </p>
                <p className="mt-2 text-sm font-semibold text-slate-950">
                  {enlace.etiqueta}
                </p>
                <p className="mt-1 text-sm leading-7 text-slate-600">
                  {enlace.descripcion}
                </p>
              </Link>
            ))}
          </div>
        </Tarjeta>

        <PanelPreparacionAdmin
          etiqueta="Base operativa"
          titulo="Lo que ya queda resuelto"
          descripcion="El panel nace liviano, separado del frontend publico y sin meter CRUD antes de tiempo."
          items={itemsBaseDashboard}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[0.94fr_1.06fr]">
        <PanelPreparacionAdmin
          etiqueta="Roadmap inmediato"
          titulo="Siguientes capas del backoffice"
          descripcion="Esta base ya deja ubicadas las tres secciones que siguen en el roadmap interno."
          items={itemsSiguientesModulos}
          variante="base"
        />

        <EstadoVacio
          titulo="Panel listo para empezar a operar"
          descripcion="Todavia no hay formularios ni tablas administrativas activas en este modulo. Desde aqui parte una base limpia para sumar catalogo, pedidos e imagenes sin mezclar responsabilidades."
          accion={
            <Link
              href="/admin/productos"
              className="boton-base boton-primario min-h-11 px-4 text-sm"
            >
              Revisar seccion de productos
            </Link>
          }
          claseName="min-h-[20rem]"
        />
      </div>
    </section>
  );
}
