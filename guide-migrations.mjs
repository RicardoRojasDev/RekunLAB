#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const migrations = [
  {
    order: 1,
    name: "Modulo 14 - Base de datos",
    file: "supabase/migrations/20260419183000_modulo_14_base_datos.sql",
  },
  {
    order: 2,
    name: "Modulo 15 - Catalogo real",
    file: "supabase/migrations/20260419_modulo_15_catalogo_real.sql",
  },
  {
    order: 3,
    name: "Modulo 16 - Sistema de pedidos",
    file: "supabase/migrations/20260419213000_modulo_16_sistema_pedidos.sql",
  },
  {
    order: 4,
    name: "Auditoria - Catalogo y pedidos",
    file: "supabase/migrations/20260419233000_auditoria_catalogo_y_pedidos.sql",
  },
  {
    order: 5,
    name: "Modulo 18 - Integracion de pagos",
    file: "supabase/migrations/20260420003000_modulo_18_integracion_pagos.sql",
  },
];

console.log("\n=== Guia de migraciones para Supabase ===");

for (const migration of migrations) {
  const rutaAbsoluta = resolve(process.cwd(), migration.file);

  if (!existsSync(rutaAbsoluta)) {
    console.error(`No se encontro ${migration.file}`);
    continue;
  }

  const sql = readFileSync(rutaAbsoluta, "utf8");
  const totalLineas = sql.split(/\r?\n/).length;

  console.log(`\nPaso ${migration.order}: ${migration.name}`);
  console.log(`- Archivo: ${rutaAbsoluta}`);
  console.log(`- Lineas: ${totalLineas}`);
  console.log("- SQL Editor -> New query -> pegar contenido completo -> Run");
}

console.log("\nVerificacion sugerida despues de aplicar migraciones:");
console.log("- Ejecuta: npm run supabase:diagnostico");
console.log("- Revisa /catalogo y un detalle /catalogo/[slug]");
console.log("- Revisa que el RPC crear_pedido_desde_checkout ya no devuelva 42501");
