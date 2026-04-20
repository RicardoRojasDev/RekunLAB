import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { cargarEntornoLocal } from "./scripts/utilidades/cargar-entorno-local.mjs";

cargarEntornoLocal();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Error: faltan credenciales de Supabase en .env.local.");
  console.error("Necesitas NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY.");
  process.exit(1);
}

const migrations = [
  {
    name: "Modulo 14 - Base de datos",
    file: "supabase/migrations/20260419183000_modulo_14_base_datos.sql",
  },
  {
    name: "Modulo 15 - Catalogo real",
    file: "supabase/migrations/20260419_modulo_15_catalogo_real.sql",
  },
  {
    name: "Modulo 16 - Sistema de pedidos",
    file: "supabase/migrations/20260419213000_modulo_16_sistema_pedidos.sql",
  },
  {
    name: "Auditoria - Catalogo y pedidos",
    file: "supabase/migrations/20260419233000_auditoria_catalogo_y_pedidos.sql",
  },
];

async function executeSql(sql) {
  const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${supabaseKey}`,
      Prefer: "return=representation",
    },
    body: JSON.stringify({ query: sql }),
  });

  if (!response.ok) {
    throw new Error(
      "Supabase no permitio ejecutar SQL por API. Usa SQL Editor con la migracion indicada.",
    );
  }

  return response.json();
}

async function runMigrations() {
  console.log("Iniciando ejecucion de migraciones...\n");

  for (const migration of migrations) {
    console.log(`Ejecutando: ${migration.name}`);

    try {
      const filePath = resolve(process.cwd(), migration.file);
      const sql = readFileSync(filePath, "utf8");

      await executeSql(sql);
      console.log(`${migration.name} - Completada\n`);
    } catch (error) {
      console.error(`Error en ${migration.name}:`);
      console.error(error.message);
      console.log(
        `\nAplica manualmente el archivo ${migration.file} en Supabase Dashboard -> SQL Editor.\n`,
      );
    }
  }

  console.log("Verificacion sugerida:\n");
  console.log("1. Ejecuta: npm run supabase:diagnostico");
  console.log("2. Revisa que catalogo y pedidos ya no reporten 42501.");
}

runMigrations().catch((error) => {
  console.error("Error fatal:", error);
  process.exit(1);
});
