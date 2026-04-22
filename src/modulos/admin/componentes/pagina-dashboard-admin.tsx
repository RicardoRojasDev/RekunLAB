import Link from "next/link";
import { Etiqueta, Tarjeta } from "@/compartido/componentes/ui";
import { enlacesNavegacionAdmin } from "../configuracion/navegacion-admin";

export function PaginaDashboardAdmin() {
  return (
    <section className="space-y-6">
      <Tarjeta
        variante="elevada"
        etiqueta={<Etiqueta variante="primaria">Admin</Etiqueta>}
        titulo="Panel administrador"
        descripcion="Gestiona productos, pedidos e imagenes desde un panel separado de la tienda publica."
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

      <Tarjeta
        etiqueta={<Etiqueta variante="suave">Acceso rapido</Etiqueta>}
        titulo="Acciones"
        descripcion="Selecciona una seccion para comenzar."
      >
        <div className="grid gap-3 sm:grid-cols-3">
          <Link
            href="/admin/productos"
            className="boton-base boton-primario min-h-11 justify-center px-4 text-sm"
          >
            Productos
          </Link>
          <Link
            href="/admin/pedidos"
            className="boton-base boton-secundario min-h-11 justify-center px-4 text-sm"
          >
            Pedidos
          </Link>
          <Link
            href="/admin/imagenes"
            className="boton-base boton-secundario min-h-11 justify-center px-4 text-sm"
          >
            Imagenes
          </Link>
        </div>
      </Tarjeta>
    </section>
  );
}

