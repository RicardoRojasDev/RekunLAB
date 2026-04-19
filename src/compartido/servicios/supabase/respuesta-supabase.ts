import type { PostgrestError } from "@supabase/supabase-js";

type RespuestaConErrorSupabase<T> = Readonly<{
  data: T | null;
  error: PostgrestError | null;
}>;

export function exigirRespuestaSupabase<T>(
  respuesta: RespuestaConErrorSupabase<T>,
  contexto: string,
): T {
  if (respuesta.error) {
    throw new Error(
      `Error al consultar Supabase (${contexto}): ${respuesta.error.message}`,
    );
  }

  if (respuesta.data === null) {
    throw new Error(
      `Supabase no devolvio datos (${contexto}). Revisa la consulta y RLS.`,
    );
  }

  return respuesta.data;
}

