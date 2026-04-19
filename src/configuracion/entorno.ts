import type { CredencialesPublicasSupabase } from "@/tipos/entorno";

const variablesPublicasRequeridasSupabase = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
] as const;

export function obtenerVariableEntorno(nombre: string): string {
  const valor = process.env[nombre]?.trim();

  if (!valor) {
    throw new Error(
      `Falta la variable de entorno obligatoria: ${nombre}. Revisa el archivo .env.local.`,
    );
  }

  return valor;
}

export function obtenerCredencialesPublicasSupabase(): CredencialesPublicasSupabase {
  return {
    url: obtenerVariableEntorno("NEXT_PUBLIC_SUPABASE_URL"),
    claveAnonima: obtenerVariableEntorno("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
  };
}

export { variablesPublicasRequeridasSupabase };
