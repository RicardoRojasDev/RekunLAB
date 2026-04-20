import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const rutaMigracion = resolve(
  process.cwd(),
  "supabase/migrations/20260419233000_auditoria_catalogo_y_pedidos.sql",
);

if (!existsSync(rutaMigracion)) {
  console.error("No se encontro la migracion de remediacion esperada.");
  console.error(rutaMigracion);
  process.exit(1);
}

const contenido = readFileSync(rutaMigracion, "utf8");
const totalLineas = contenido.split(/\r?\n/).length;

console.log("\n=== Remediacion de acceso real a Supabase ===");
console.log("1. Abre Supabase Dashboard.");
console.log("2. Entra a SQL Editor.");
console.log('3. Crea una nueva query con "New query".');
console.log(`4. Abre este archivo local y copia todo su contenido:\n   ${rutaMigracion}`);
console.log("5. Pega el SQL completo en el editor y ejecutalo una sola vez.");
console.log("6. Espera confirmacion de exito en el dashboard.");
console.log("7. Revalida el acceso desde este repo con:\n   npm run supabase:diagnostico");
console.log("\nDetalles de la migracion:");
console.log(`- Lineas: ${totalLineas}`);
console.log("- Objetivo: restaurar permisos de service_role sobre schema public, catalogo y pedidos.");
console.log("- Alcance: grant usage/select/insert/update y grant execute del RPC de pedidos.");
