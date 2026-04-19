"use client";

import { CampoTexto, Etiqueta, Tarjeta } from "@/compartido/componentes/ui";
import type { DatosClienteCheckout, ErroresDatosClienteCheckout } from "../tipos/checkout";

export const idsCamposDatosClienteCheckout = {
  nombre: "checkout-nombre",
  apellido: "checkout-apellido",
  correo: "checkout-correo",
  telefono: "checkout-telefono",
} as const;

type PropiedadesSeccionDatosClienteCheckout = Readonly<{
  valores: DatosClienteCheckout;
  errores: ErroresDatosClienteCheckout;
  alCambiarCampo: <K extends keyof DatosClienteCheckout>(
    campo: K,
    valor: DatosClienteCheckout[K],
  ) => void;
}>;

export function SeccionDatosClienteCheckout({
  valores,
  errores,
  alCambiarCampo,
}: PropiedadesSeccionDatosClienteCheckout) {
  return (
    <Tarjeta
      variante="elevada"
      etiqueta={<Etiqueta variante="primaria">Datos del cliente</Etiqueta>}
      titulo="Informacion de contacto"
      descripcion="Necesitamos estos datos para coordinar el envio y mantenerte informado."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <CampoTexto
          id={idsCamposDatosClienteCheckout.nombre}
          etiqueta="Nombre"
          obligatorio
          value={valores.nombre}
          onChange={(evento) => alCambiarCampo("nombre", evento.target.value)}
          error={errores.nombre ?? undefined}
          autoComplete="given-name"
        />

        <CampoTexto
          id={idsCamposDatosClienteCheckout.apellido}
          etiqueta="Apellido"
          obligatorio
          value={valores.apellido}
          onChange={(evento) => alCambiarCampo("apellido", evento.target.value)}
          error={errores.apellido ?? undefined}
          autoComplete="family-name"
        />

        <CampoTexto
          id={idsCamposDatosClienteCheckout.correo}
          etiqueta="Correo"
          obligatorio
          type="email"
          value={valores.correo}
          onChange={(evento) => alCambiarCampo("correo", evento.target.value)}
          error={errores.correo ?? undefined}
          autoComplete="email"
          inputMode="email"
          placeholder="nombre@dominio.cl"
        />

        <CampoTexto
          id={idsCamposDatosClienteCheckout.telefono}
          etiqueta="Telefono (opcional)"
          value={valores.telefono}
          onChange={(evento) => alCambiarCampo("telefono", evento.target.value)}
          error={errores.telefono ?? undefined}
          autoComplete="tel"
          inputMode="tel"
          placeholder="+56 9 1234 5678"
        />
      </div>
    </Tarjeta>
  );
}

