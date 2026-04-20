import { createClient } from "@supabase/supabase-js";
import { cargarEntornoLocal } from "./utilidades/cargar-entorno-local.mjs";

function resumirError(error) {
  if (!error) {
    return null;
  }

  return {
    code: error.code ?? null,
    message: error.message ?? "Error desconocido",
    details: error.details ?? null,
    hint: error.hint ?? null,
  };
}

function esErrorPermisosSchemaPublic(error) {
  return (
    error?.code === "42501" ||
    error?.message === "permission denied for schema public"
  );
}

async function ejecutarDiagnosticoTabla(cliente, tabla, seleccion) {
  const respuesta = await cliente.from(tabla).select(seleccion).limit(1);

  return {
    tabla,
    ok: !respuesta.error,
    error: resumirError(respuesta.error),
    totalFilas: Array.isArray(respuesta.data) ? respuesta.data.length : 0,
  };
}

async function ejecutarDiagnosticoRpc(cliente) {
  const respuesta = await cliente.rpc("crear_pedido_desde_checkout", {
    p_solicitud: {},
  });

  return {
    rpc: "crear_pedido_desde_checkout",
    accesible: !esErrorPermisosSchemaPublic(respuesta.error),
    error: resumirError(respuesta.error),
  };
}

function imprimirBloque(titulo) {
  console.log(`\n=== ${titulo} ===`);
}

async function main() {
  cargarEntornoLocal();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const claveAnonima = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const claveServicio = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !claveAnonima || !claveServicio) {
    console.error("Faltan variables de entorno requeridas para diagnosticar Supabase.");
    console.error(
      "Necesitas NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY y SUPABASE_SERVICE_ROLE_KEY.",
    );
    process.exitCode = 1;
    return;
  }

  const opcionesCliente = {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  };

  const clienteAnonimo = createClient(url, claveAnonima, opcionesCliente);
  const clienteServicio = createClient(url, claveServicio, opcionesCliente);

  const [estadoAnonimo, productoAnonimo, estadoServicio, productoServicio, rpcPedido] =
    await Promise.all([
      ejecutarDiagnosticoTabla(
        clienteAnonimo,
        "estado_entidad",
        "id, codigo, entidad_objetivo",
      ),
      ejecutarDiagnosticoTabla(clienteAnonimo, "producto", "id, slug, nombre"),
      ejecutarDiagnosticoTabla(
        clienteServicio,
        "estado_entidad",
        "id, codigo, entidad_objetivo",
      ),
      ejecutarDiagnosticoTabla(clienteServicio, "producto", "id, slug, nombre"),
      ejecutarDiagnosticoRpc(clienteServicio),
    ]);

  imprimirBloque("Diagnostico de acceso a Supabase");
  console.log(`Proyecto: ${url}`);
  console.log("Contrato de entorno activo:");
  console.log("- NEXT_PUBLIC_SUPABASE_URL");
  console.log("- NEXT_PUBLIC_SUPABASE_ANON_KEY");
  console.log("- SUPABASE_SERVICE_ROLE_KEY");

  imprimirBloque("Cliente anonimo");
  console.log(JSON.stringify(estadoAnonimo, null, 2));
  console.log(JSON.stringify(productoAnonimo, null, 2));

  imprimirBloque("Cliente service_role");
  console.log(JSON.stringify(estadoServicio, null, 2));
  console.log(JSON.stringify(productoServicio, null, 2));

  imprimirBloque("RPC de pedidos");
  console.log(JSON.stringify(rpcPedido, null, 2));

  const accesoCatalogoReal = estadoServicio.ok && productoServicio.ok;
  const accesoPedidosReales = rpcPedido.accesible;

  imprimirBloque("Resultado");

  if (accesoCatalogoReal && accesoPedidosReales) {
    console.log(
      "Supabase ya responde con acceso real para catalogo y pedidos. La aplicacion deberia dejar de usar el respaldo local.",
    );
    return;
  }

  console.log(
    "Supabase todavia no esta listo como fuente de verdad desde este entorno. Aplica en SQL Editor:",
  );
  console.log(
    "- supabase/migrations/20260419233000_auditoria_catalogo_y_pedidos.sql",
  );
  console.log("Luego vuelve a ejecutar: npm run supabase:diagnostico");

  if (
    esErrorPermisosSchemaPublic(estadoServicio.error) ||
    esErrorPermisosSchemaPublic(productoServicio.error) ||
    esErrorPermisosSchemaPublic(rpcPedido.error)
  ) {
    console.log(
      "Diagnostico principal: el proyecto remoto sigue negando acceso al schema public (42501).",
    );
  }

  process.exitCode = 1;
}

main().catch((error) => {
  console.error("No fue posible completar el diagnostico de Supabase.");
  console.error(error);
  process.exitCode = 1;
});
