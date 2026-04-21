import "server-only";

import { crearClienteSupabaseServidorServicio } from "@/compartido/servicios/supabase/index-servidor";
import type {
  ItemPedidoCorreoTransaccional,
  PedidoCorreoTransaccional,
} from "../tipos/correos-transaccionales";

type RelacionSimple<T> = T | readonly T[] | null;

type FilaDireccionPedidoSupabase = Readonly<{
  region: string;
  comuna: string;
  calle: string;
  numero: string;
  departamento: string | null;
  referencias: string | null;
  codigo_postal: string | null;
}>;

type FilaItemPedidoSupabase = Readonly<{
  nombre_producto_snapshot: string;
  atributos_snapshot: Record<string, unknown> | null;
  precio_unitario_iva_incluido: number;
  cantidad: number;
  subtotal_linea_iva_incluido: number;
}>;

type FilaPedidoCorreoSupabase = Readonly<{
  id: string;
  numero_pedido: string;
  creado_en: string;
  subtotal_iva_incluido: number;
  total_iva_incluido: number;
  nombre_cliente_snapshot: string;
  apellido_cliente_snapshot: string;
  correo_cliente_snapshot: string;
  telefono_cliente_snapshot: string | null;
  direccion: RelacionSimple<FilaDireccionPedidoSupabase>;
  items: readonly FilaItemPedidoSupabase[] | null;
}>;

const seleccionPedidoCorreoTransaccional = `
  id,
  numero_pedido,
  creado_en,
  subtotal_iva_incluido,
  total_iva_incluido,
  nombre_cliente_snapshot,
  apellido_cliente_snapshot,
  correo_cliente_snapshot,
  telefono_cliente_snapshot,
  direccion:direccion_pedido(
    region,
    comuna,
    calle,
    numero,
    departamento,
    referencias,
    codigo_postal
  ),
  items:item_pedido(
    nombre_producto_snapshot,
    atributos_snapshot,
    precio_unitario_iva_incluido,
    cantidad,
    subtotal_linea_iva_incluido
  )
`;

function extraerRelacionSimple<T>(valor: RelacionSimple<T>) {
  if (Array.isArray(valor)) {
    return valor[0] ?? null;
  }

  return valor ?? null;
}

function esRegistro(valor: unknown): valor is Record<string, unknown> {
  return typeof valor === "object" && valor !== null && !Array.isArray(valor);
}

function limpiarTextoOpcional(valor: string | null | undefined) {
  if (!valor) {
    return null;
  }

  const texto = valor.trim();
  return texto.length ? texto : null;
}

function obtenerTextoAtributo(
  atributos: Record<string, unknown> | null,
  clave: string,
) {
  const valor = atributos?.[clave];
  return typeof valor === "string" && valor.trim().length ? valor.trim() : null;
}

function mapearItemPedidoCorreo(
  fila: FilaItemPedidoSupabase,
): ItemPedidoCorreoTransaccional {
  const atributos = esRegistro(fila.atributos_snapshot) ? fila.atributos_snapshot : null;
  const nombreProducto =
    obtenerTextoAtributo(atributos, "nombreProducto") ??
    fila.nombre_producto_snapshot;
  const nombreCompleto =
    obtenerTextoAtributo(atributos, "nombreCompletoProducto") ??
    obtenerTextoAtributo(atributos, "nombreCompleto") ??
    nombreProducto;
  const marca =
    obtenerTextoAtributo(atributos, "marcaProducto") ??
    obtenerTextoAtributo(atributos, "marca") ??
    "Sin marca";
  const tipoProducto =
    obtenerTextoAtributo(atributos, "tipoProducto") ??
    obtenerTextoAtributo(atributos, "tipoProductoLegacy") ??
    "Producto";

  return {
    nombreProducto,
    nombreCompleto,
    marca,
    tipoProducto,
    precioUnitarioCLP: fila.precio_unitario_iva_incluido,
    cantidad: fila.cantidad,
    subtotalCLP: fila.subtotal_linea_iva_incluido,
  };
}

function mapearPedidoCorreoTransaccional(
  fila: FilaPedidoCorreoSupabase,
): PedidoCorreoTransaccional {
  const direccion = extraerRelacionSimple(fila.direccion);

  return {
    pedidoId: fila.id,
    numeroPedido: fila.numero_pedido,
    fechaISO: fila.creado_en,
    subtotalCLP: fila.subtotal_iva_incluido,
    totalCLP: fila.total_iva_incluido,
    datosCliente: {
      nombreCompleto: [
        fila.nombre_cliente_snapshot.trim(),
        fila.apellido_cliente_snapshot.trim(),
      ]
        .filter(Boolean)
        .join(" "),
      correo: fila.correo_cliente_snapshot,
      telefono: limpiarTextoOpcional(fila.telefono_cliente_snapshot) ?? "",
    },
    direccionDespacho: {
      region: direccion?.region ?? "",
      comuna: direccion?.comuna ?? "",
      calle: direccion?.calle ?? "",
      numero: direccion?.numero ?? "",
      departamento: limpiarTextoOpcional(direccion?.departamento) ?? "",
      referencias: limpiarTextoOpcional(direccion?.referencias) ?? "",
      codigoPostal: limpiarTextoOpcional(direccion?.codigo_postal) ?? "",
    },
    items: (fila.items ?? []).map((item) => mapearItemPedidoCorreo(item)),
  };
}

export async function obtenerPedidoCorreoTransaccionalPorId(
  pedidoId: string,
): Promise<PedidoCorreoTransaccional | null> {
  const cliente = crearClienteSupabaseServidorServicio();
  const { data, error } = await cliente
    .from("pedido")
    .select(seleccionPedidoCorreoTransaccional)
    .eq("id", pedidoId)
    .maybeSingle();

  if (error) {
    throw new Error(
      `No pudimos cargar el pedido para correos transaccionales: ${error.message}`,
    );
  }

  if (!data) {
    return null;
  }

  return mapearPedidoCorreoTransaccional(data as unknown as FilaPedidoCorreoSupabase);
}
