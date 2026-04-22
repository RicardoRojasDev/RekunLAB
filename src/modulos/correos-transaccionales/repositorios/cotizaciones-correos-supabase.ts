import "server-only";

import { crearClienteSupabaseServidorServicio } from "@/compartido/servicios/supabase/index-servidor";
import type { CotizacionCorreoTransaccional } from "../tipos/correos-cotizacion";

type FilaCotizacionCorreoSupabase = Readonly<{
  id: string;
  numero_cotizacion: string;
  creado_en: string;
  nombre_solicitante: string;
  apellido_solicitante: string;
  correo_solicitante: string;
  telefono_solicitante: string | null;
  mensaje_solicitud: string | null;
}>;

const seleccionCotizacionCorreoTransaccional = `
  id,
  numero_cotizacion,
  creado_en,
  nombre_solicitante,
  apellido_solicitante,
  correo_solicitante,
  telefono_solicitante,
  mensaje_solicitud
`;

function limpiarTextoOpcional(valor: string | null | undefined) {
  if (!valor) {
    return "";
  }

  const texto = valor.trim();
  return texto.length ? texto : "";
}

function mapearCotizacionCorreoTransaccional(
  fila: FilaCotizacionCorreoSupabase,
): CotizacionCorreoTransaccional {
  return {
    cotizacionId: fila.id,
    numeroCotizacion: fila.numero_cotizacion,
    fechaISO: fila.creado_en,
    solicitante: {
      nombreCompleto: [fila.nombre_solicitante.trim(), fila.apellido_solicitante.trim()]
        .filter(Boolean)
        .join(" "),
      correo: fila.correo_solicitante,
      telefono: limpiarTextoOpcional(fila.telefono_solicitante),
    },
    mensaje: limpiarTextoOpcional(fila.mensaje_solicitud),
  };
}

export async function obtenerCotizacionCorreoTransaccionalPorId(
  cotizacionId: string,
): Promise<CotizacionCorreoTransaccional | null> {
  const cliente = crearClienteSupabaseServidorServicio();
  const { data, error } = await cliente
    .from("cotizacion")
    .select(seleccionCotizacionCorreoTransaccional)
    .eq("id", cotizacionId)
    .maybeSingle();

  if (error) {
    throw new Error(
      `No pudimos cargar la cotizacion para correos transaccionales: ${error.message}`,
    );
  }

  if (!data) {
    return null;
  }

  return mapearCotizacionCorreoTransaccional(data as unknown as FilaCotizacionCorreoSupabase);
}

