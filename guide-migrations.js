#!/usr/bin/env node
import { readFileSync } from 'fs';
import { join } from 'path';

const migrations = [
  {
    order: 1,
    name: 'Módulo 14 - Base de Datos',
    file: './supabase/migrations/20260419183000_modulo_14_base_datos.sql',
  },
  {
    order: 2,
    name: 'Módulo 16 - Sistema de Pedidos',
    file: './supabase/migrations/20260419213000_modulo_16_sistema_pedidos.sql',
  },
  {
    order: 3,
    name: 'Módulo 15 - Catálogo Real (35 productos)',
    file: './supabase/migrations/20260419_modulo_15_catalogo_real.sql',
  },
];

console.log('\n╔════════════════════════════════════════════════════════════════╗');
console.log('║     INSTRUCCIONES PARA EJECUTAR MIGRACIONES EN SUPABASE        ║');
console.log('╚════════════════════════════════════════════════════════════════╝\n');

for (const migration of migrations) {
  try {
    const sql = readFileSync(migration.file, 'utf-8');
    const lines = sql.split('\n').length;

    console.log(`\n📋 PASO ${migration.order}: ${migration.name}`);
    console.log(`   Archivo: ${migration.file}`);
    console.log(`   Líneas: ${lines}`);
    console.log('\n   INSTRUCCIONES:');
    console.log('   1. Ve a: https://app.supabase.com → SQL Editor');
    console.log('   2. Haz click en "New query"');
    console.log(`   3. Abre el archivo: ${migration.file}`);
    console.log('   4. Copia TODO el contenido (Ctrl+A, Ctrl+C)');
    console.log('   5. Pégalo en el SQL Editor de Supabase (Ctrl+V)');
    console.log('   6. Haz click en "RUN" (triángulo azul)');
    console.log('   7. Espera a que aparezca ✅ "Success"');
    console.log(`   8. Luego procede al PASO ${migration.order + 1}\n`);
  } catch (error) {
    console.error(`❌ Error leyendo ${migration.file}`);
  }
}

console.log('\n╔════════════════════════════════════════════════════════════════╗');
console.log('║                    VERIFICACIÓN FINAL                         ║');
console.log('╚════════════════════════════════════════════════════════════════╝\n');

console.log('Una vez completadas las 3 migraciones:');
console.log('\n1. Ve a Supabase Dashboard → Database → Tables');
console.log('   Deberías ver estas tablas:');
console.log('   ✓ producto (debe tener 35 productos)');
console.log('   ✓ pedido');
console.log('   ✓ item_pedido');
console.log('   ✓ estado_entidad');
console.log('   ✓ y muchas otras...\n');

console.log('2. Ejecuta esta query en SQL Editor para verificar:');
console.log('   ────────────────────────────────────────────');
console.log('   SELECT tipo_producto, COUNT(*) FROM producto GROUP BY tipo_producto;');
console.log('   ────────────────────────────────────────────');
console.log('   Resultado esperado:');
console.log('   • Filamento: 18');
console.log('   • Impresora: 12');
console.log('   • Pack: 5\n');

console.log('3. Si ves esos números, ¡ÉXITO! ✅\n');

console.log('⏰ Tiempo estimado: 5-10 minutos\n');
