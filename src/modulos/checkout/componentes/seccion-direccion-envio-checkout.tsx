"use client";

import { AreaTexto, CampoTexto, Etiqueta, Tarjeta } from "@/compartido/componentes/ui";
import type {
  DireccionEnvioCheckout,
  ErroresDireccionEnvioCheckout,
} from "../tipos/checkout";

export const idsCamposDireccionEnvioCheckout = {
  region: "checkout-region",
  comuna: "checkout-comuna",
  calle: "checkout-calle",
  numero: "checkout-numero",
  departamento: "checkout-departamento",
  codigoPostal: "checkout-codigo-postal",
  referencias: "checkout-referencias",
} as const;

type PropiedadesSeccionDireccionEnvioCheckout = Readonly<{
  valores: DireccionEnvioCheckout;
  errores: ErroresDireccionEnvioCheckout;
  alCambiarCampo: <K extends keyof DireccionEnvioCheckout>(
    campo: K,
    valor: DireccionEnvioCheckout[K],
  ) => void;
}>;

export function SeccionDireccionEnvioCheckout({
  valores,
  errores,
  alCambiarCampo,
}: PropiedadesSeccionDireccionEnvioCheckout) {
  return (
    <Tarjeta
      variante="elevada"
      etiqueta={<Etiqueta variante="primaria">Envio</Etiqueta>}
      titulo="Direccion de envio"
      descripcion="Solo envios dentro de Chile segun las reglas actuales del ecommerce."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <CampoTexto
          id={idsCamposDireccionEnvioCheckout.region}
          etiqueta="Region"
          obligatorio
          value={valores.region}
          onChange={(evento) => alCambiarCampo("region", evento.target.value)}
          error={errores.region ?? undefined}
          autoComplete="address-level1"
          placeholder="Ej: Metropolitana"
        />

        <CampoTexto
          id={idsCamposDireccionEnvioCheckout.comuna}
          etiqueta="Comuna"
          obligatorio
          value={valores.comuna}
          onChange={(evento) => alCambiarCampo("comuna", evento.target.value)}
          error={errores.comuna ?? undefined}
          autoComplete="address-level2"
          placeholder="Ej: Providencia"
        />

        <CampoTexto
          id={idsCamposDireccionEnvioCheckout.calle}
          etiqueta="Calle"
          obligatorio
          value={valores.calle}
          onChange={(evento) => alCambiarCampo("calle", evento.target.value)}
          error={errores.calle ?? undefined}
          autoComplete="address-line1"
          placeholder="Ej: Av. Siempre Viva"
        />

        <CampoTexto
          id={idsCamposDireccionEnvioCheckout.numero}
          etiqueta="Numero"
          obligatorio
          value={valores.numero}
          onChange={(evento) => alCambiarCampo("numero", evento.target.value)}
          error={errores.numero ?? undefined}
          autoComplete="address-line2"
          placeholder="Ej: 742"
        />

        <CampoTexto
          id={idsCamposDireccionEnvioCheckout.departamento}
          etiqueta="Departamento / Casa (opcional)"
          value={valores.departamento}
          onChange={(evento) => alCambiarCampo("departamento", evento.target.value)}
          error={errores.departamento ?? undefined}
          placeholder="Ej: Depto 1203"
        />

        <CampoTexto
          id={idsCamposDireccionEnvioCheckout.codigoPostal}
          etiqueta="Codigo postal (opcional)"
          value={valores.codigoPostal}
          onChange={(evento) => alCambiarCampo("codigoPostal", evento.target.value)}
          error={errores.codigoPostal ?? undefined}
          inputMode="numeric"
          placeholder="Ej: 7500000"
        />
      </div>

      <AreaTexto
        id={idsCamposDireccionEnvioCheckout.referencias}
        etiqueta="Referencias (opcional)"
        value={valores.referencias}
        onChange={(evento) => alCambiarCampo("referencias", evento.target.value)}
        error={errores.referencias ?? undefined}
        placeholder="Ej: Timbre azul, porton negro, conserjeria, etc."
      />
    </Tarjeta>
  );
}

