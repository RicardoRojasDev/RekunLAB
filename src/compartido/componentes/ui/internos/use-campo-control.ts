import { useId } from "react";

type PropiedadesUseCampoControl = Readonly<{
  id?: string;
  ayuda?: string;
  error?: string;
}>;

export function useCampoControl({
  id,
  ayuda,
  error,
}: PropiedadesUseCampoControl) {
  const idReact = useId().replace(/:/g, "");
  const idControl = id ?? `campo-${idReact}`;
  const idAyuda = ayuda ? `${idControl}-ayuda` : undefined;
  const idError = error ? `${idControl}-error` : undefined;
  const ariaDescribedBy =
    [idAyuda, idError].filter(Boolean).join(" ") || undefined;

  return {
    idControl,
    idAyuda,
    idError,
    ariaDescribedBy,
  };
}
