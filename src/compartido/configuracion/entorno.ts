import type { CredencialesPublicasSupabase } from "@/compartido/tipos/entorno";

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

export function obtenerVariableEntornoOpcional(nombre: string): string | null {
  const valor = process.env[nombre]?.trim();
  return valor ? valor : null;
}

export function obtenerCredencialesPublicasSupabase(): CredencialesPublicasSupabase {
  return {
    url: obtenerVariableEntorno("NEXT_PUBLIC_SUPABASE_URL"),
    claveAnonima: obtenerVariableEntorno("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
  };
}

export function obtenerCredencialesPublicasSupabaseOpcionales(): CredencialesPublicasSupabase | null {
  const url = obtenerVariableEntornoOpcional("NEXT_PUBLIC_SUPABASE_URL");
  const claveAnonima = obtenerVariableEntornoOpcional("NEXT_PUBLIC_SUPABASE_ANON_KEY");

  if (!url || !claveAnonima) {
    return null;
  }

  return {
    url,
    claveAnonima,
  };
}

export { variablesPublicasRequeridasSupabase };
