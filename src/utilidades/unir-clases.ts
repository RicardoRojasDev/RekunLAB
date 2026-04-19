import type { ClaseAceptable } from "@/tipos/comunes";

export function unirClases(...clases: ClaseAceptable[]): string {
  return clases.filter(Boolean).join(" ");
}
