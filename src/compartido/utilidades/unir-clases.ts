import type { ClaseAceptable } from "@/compartido/tipos/comunes";

export function unirClases(...clases: ClaseAceptable[]): string {
  return clases.filter(Boolean).join(" ");
}
