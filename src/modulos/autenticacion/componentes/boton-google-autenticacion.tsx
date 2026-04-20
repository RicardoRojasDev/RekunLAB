"use client";

import { Boton } from "@/compartido/componentes/ui";
import { useAutenticacion } from "../hooks/use-autenticacion";

type PropiedadesBotonGoogleAutenticacion = Readonly<{
  bloque?: boolean;
  tamanio?: "sm" | "md" | "lg";
  variante?: "primario" | "secundario" | "fantasma";
}>;

function IconoGoogle() {
  return (
    <span
      aria-hidden="true"
      className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-[color:var(--color-borde)] bg-white text-[11px] font-bold text-slate-800"
    >
      G
    </span>
  );
}

export function BotonGoogleAutenticacion({
  bloque = false,
  tamanio = "md",
  variante = "primario",
}: PropiedadesBotonGoogleAutenticacion) {
  const { accionActual, disponibilidad, iniciarSesionConGoogle } =
    useAutenticacion();

  const deshabilitado = disponibilidad === "no-configurada";
  const cargando = accionActual === "login-google";

  return (
    <Boton
      bloque={bloque}
      tamanio={tamanio}
      variante={variante}
      onClick={() => {
        void iniciarSesionConGoogle();
      }}
      cargando={cargando}
      disabled={deshabilitado}
      title={
        deshabilitado
          ? "El acceso con Google no esta disponible en este entorno"
          : "Iniciar sesion con Google"
      }
      inicio={cargando ? null : <IconoGoogle />}
    >
      {deshabilitado ? "Google no disponible" : "Entrar con Google"}
    </Boton>
  );
}
