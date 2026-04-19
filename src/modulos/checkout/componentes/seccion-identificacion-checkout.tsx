"use client";

import Link from "next/link";
import { Boton, Etiqueta, Tarjeta } from "@/compartido/componentes/ui";
import {
  BotonGoogleAutenticacion,
  useAutenticacion,
} from "@/modulos/autenticacion";

export function SeccionIdentificacionCheckout() {
  const {
    accionActual,
    disponibilidad,
    estadoSesion,
    usuario,
    cerrarSesion,
  } = useAutenticacion();

  if (estadoSesion === "autenticado" && usuario) {
    return (
      <Tarjeta
        variante="elevada"
        etiqueta={<Etiqueta variante="premium">Cuenta conectada</Etiqueta>}
        titulo="Checkout con sesion activa"
        descripcion="Tu sesion y la compra siguen desacopladas. Puedes editar tus datos de envio y contacto antes de continuar."
        acciones={
          <Boton
            variante="secundario"
            tamanio="sm"
            cargando={accionActual === "cerrar-sesion"}
            onClick={() => {
              void cerrarSesion();
            }}
          >
            Cerrar sesion
          </Boton>
        }
      >
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-[var(--radio-md)] border border-[color:var(--color-borde)] bg-white/78 px-4 py-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Nombre
              </p>
              <p className="text-sm font-semibold text-slate-950">
                {usuario.nombreCompleto}
              </p>
            </div>

            <div className="rounded-[var(--radio-md)] border border-[color:var(--color-borde)] bg-white/78 px-4 py-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Correo
              </p>
              <p className="text-sm font-semibold text-slate-950">
                {usuario.correo ?? "Sin correo disponible"}
              </p>
            </div>
          </div>

          <p className="texto-soporte">
            Usamos estos datos solo como base del formulario. La compra sigue
            permitiendo cambios manuales y no depende de un inicio de sesion
            obligatorio.
          </p>
        </div>
      </Tarjeta>
    );
  }

  return (
    <Tarjeta
      variante="elevada"
      etiqueta={<Etiqueta variante="primaria">Cuenta</Etiqueta>}
      titulo="Compra como invitado o accede con Google"
      descripcion="No necesitas iniciar sesion para completar este checkout. Si prefieres hacerlo, la capa frontend ya queda preparada para Supabase Auth."
      acciones={<BotonGoogleAutenticacion variante="secundario" tamanio="sm" />}
    >
      <div className="space-y-4">
        <p className="texto-soporte">
          Seguimos una estrategia frontend-first: el flujo comercial no depende
          de la sesion. Puedes comprar como invitado ahora mismo y, si luego
          decides autenticarte, la arquitectura ya lo soporta sin rehacer el
          checkout.
        </p>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/acceso"
            className="boton-base boton-secundario min-h-11 px-4 text-sm"
          >
            Ver modulo de acceso
          </Link>
          {disponibilidad === "no-configurada" ? (
            <span className="inline-flex items-center rounded-full border border-[color:var(--color-borde)] bg-white/72 px-3 py-2 text-xs text-slate-500">
              Supabase Auth aun no esta configurado en este entorno
            </span>
          ) : null}
        </div>
      </div>
    </Tarjeta>
  );
}
