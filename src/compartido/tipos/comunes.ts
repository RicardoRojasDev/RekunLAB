import type { ReactNode } from "react";

export type ClaseAceptable = string | false | null | undefined;

export type PropiedadesConHijos = Readonly<{
  children: ReactNode;
}>;

export type PropiedadesConHijosOpcionales = Readonly<{
  children?: ReactNode;
}>;
