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
        descripcion="Puedes usar tus datos como base y ajustarlos antes de confirmar la compra."
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
            Tu informacion de contacto puede editarse manualmente antes de pasar
            a pago.
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
      descripcion="No necesitas iniciar sesion para completar este checkout. Si prefieres hacerlo, puedes entrar con Google cuando este disponible."
      acciones={<BotonGoogleAutenticacion variante="secundario" tamanio="sm" />}
    >
      <div className="space-y-4">
        <p className="texto-soporte">
          La compra sigue disponible como invitado y puedes continuar sin perder
          el ritmo del checkout.
        </p>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/acceso"
            className="boton-base boton-secundario min-h-11 px-4 text-sm"
          >
            Ir a acceso
          </Link>
          {disponibilidad === "no-configurada" ? (
            <span className="inline-flex items-center rounded-full border border-[color:var(--color-borde)] bg-white/72 px-3 py-2 text-xs text-slate-500">
              Acceso con Google no disponible por ahora
            </span>
          ) : null}
        </div>
      </div>
    </Tarjeta>
  );
}
