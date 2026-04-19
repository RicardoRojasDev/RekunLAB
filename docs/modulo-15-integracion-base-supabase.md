# Modulo 15 - Integracion base con Supabase

## Objetivo

Conectar el proyecto Next.js (App Router) con Supabase de forma desacoplada y mantenible, separando clientes de navegador/servidor, manejo de entorno y helpers reutilizables para construir repositorios sin meter queries en componentes.

## Alcance

- Cliente Supabase para navegador (singleton, opcional si faltan variables).
- Cliente Supabase para servidor (anonimo y service role) con `server-only`.
- Manejo correcto de variables de entorno publicas y opcionales.
- Helper para normalizar manejo de errores/respuestas de Supabase.
- Base lista para crear repositorios en `modulos/<dominio>/repositorios`.

## Estructura

```text
src/
  compartido/
    configuracion/
      entorno.ts
    servicios/
      supabase/
        cliente-navegador.ts
        cliente-publico.ts
        cliente-servidor.ts
        index.ts
        index-servidor.ts
        respuesta-supabase.ts
```

## Variables de entorno

En `.env.local`:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

En servidor (solo backend/SSR):

- `SUPABASE_SERVICE_ROLE_KEY` (solo para operaciones privilegiadas; nunca debe usarse en cliente)

## Uso recomendado

### Navegador

- `obtenerClienteSupabaseNavegador()` devuelve `SupabaseClient | null` y no rompe la app si las variables no estan configuradas.
- `crearClienteSupabaseNavegador()` es estricto y se usa cuando la funcion depende si o si de Supabase.

### Servidor

- Importar desde `@/compartido/servicios/supabase/index-servidor`.
- `crearClienteSupabaseServidorAnonimo()` para lecturas/escrituras bajo RLS.
- `crearClienteSupabaseServidorServicio()` solo para tareas administrativas internas.

## Patrones para acceso a datos

- Los componentes y rutas no deben importar `@supabase/supabase-js`.
- Crear repositorios en `src/modulos/<dominio>/repositorios/` y consumirlos desde `servicios/`.

Ejemplo (repositorio, server-side):

```ts
import { crearClienteSupabaseServidorAnonimo } from "@/compartido/servicios/supabase/index-servidor";
import { exigirRespuestaSupabase } from "@/compartido/servicios/supabase";

export async function listarCategoriasPublicas() {
  const cliente = crearClienteSupabaseServidorAnonimo();
  const respuesta = await cliente
    .from("categoria_producto")
    .select("id, slug, nombre")
    .limit(50);

  return exigirRespuestaSupabase(respuesta, "listarCategoriasPublicas");
}
```

