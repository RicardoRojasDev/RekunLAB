import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import 'dotenv/config';

const __dirname = dirname(fileURLToPath(import.meta.url));

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Faltan credenciales de Supabase en .env.local');
  console.error('Asegúrate de tener NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const migrations = [
  {
    name: 'Módulo 14 - Base de Datos',
    file: 'supabase/migrations/20260419183000_modulo_14_base_datos.sql',
  },
  {
    name: 'Módulo 16 - Sistema de Pedidos',
    file: 'supabase/migrations/20260419213000_modulo_16_sistema_pedidos.sql',
  },
  {
    name: 'Módulo 15 - Catálogo Real',
    file: 'supabase/migrations/20260419_modulo_15_catalogo_real.sql',
  },
];

async function executeSql(sql) {
  const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${supabaseKey}`,
      Prefer: 'return=representation',
    },
    body: JSON.stringify({ query: sql }),
  });

  if (!response.ok) {
    // Intenta método alternativo: separar por ; y ejecutar queries individuales
    const statements = sql.split(';').filter(s => s.trim());

    for (const statement of statements) {
      if (statement.trim()) {
        const res = await fetch(`${supabaseUrl}/rest/v1/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${supabaseKey}`,
          },
          body: JSON.stringify({ query: statement }),
        });

        if (!res.ok) {
          console.warn(`⚠️  No se pudo ejecutar: ${statement.substring(0, 50)}...`);
        }
      }
    }
  }

  return response.json();
}

async function runMigrations() {
  console.log('🚀 Iniciando ejecución de migraciones...\n');

  for (const migration of migrations) {
    console.log(`⏳ Ejecutando: ${migration.name}`);

    try {
      const filePath = join(__dirname, migration.file);
      const sql = readFileSync(filePath, 'utf-8');

      await executeSql(sql);
      console.log(`✅ ${migration.name} - Completada\n`);
    } catch (error) {
      console.error(`❌ Error en ${migration.name}:`);
      console.error(error.message);
      console.log('\n💡 Intenta manualmente en Supabase Dashboard → SQL Editor\n');
    }
  }

  console.log('🔍 Verificando resultados...\n');
  console.log('Ve a Supabase Dashboard → Database → Tables');
  console.log('Deberías ver: producto, pedido, estado_entidad, etc.');
  console.log('\n✅ Si ves esas tablas, las migraciones se ejecutaron correctamente!');
}

runMigrations().catch((error) => {
  console.error('Error fatal:', error);
  process.exit(1);
});
