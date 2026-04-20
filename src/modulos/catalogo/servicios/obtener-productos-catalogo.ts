import "server-only";

import { crearClienteSupabaseServidorAnonimo } from "@/compartido/servicios/supabase/index-servidor";
import type {
  ImagenProductoCatalogo,
  ProductoCatalogo,
  RespuestaCatalogoProductos,
} from "../tipos/producto-catalogo";

export type OpcionesObtencionCatalogo = Readonly<{
  incluirEsperaSimulada?: boolean;
}>;

// Función para transformar datos de BD a ProductoCatalogo
function construirProductoCatalogoDesdeBaseDatos(fila: any): ProductoCatalogo {
  // Imagen por defecto (placeholder)
  const imagenPorDefecto: ImagenProductoCatalogo = {
    src: "/placeholder-producto.jpg",
    alt: fila.nombre || "Producto",
    ancho: 800,
    alto: 960,
  };

  return {
    id: fila.id,
    slug: fila.slug,
    nombre: fila.nombre,
    resumen: fila.resumen || "",
    categoria: fila.categoria || "Sin categoría",
    tipoProducto: fila.tipo_producto || "Producto",
    coleccion: fila.coleccion || undefined,
    precioIvaIncluido: fila.precio_base_iva_incluido || 0,
    imagen: imagenPorDefecto,
    descripcion: fila.descripcion || fila.resumen || "",
    imagenesGaleria: [
      {
        ...imagenPorDefecto,
        etiqueta: "Vista principal",
        posicionObjeto: "center 46%",
      },
    ],
    especificaciones: fila.metadatos
      ? [
          ...(fila.metadatos.nombre_completo
            ? [
                {
                  etiqueta: "Descripción completa",
                  valor: fila.metadatos.nombre_completo,
                },
              ]
            : []),
          ...(fila.metadatos.acabado
            ? [{ etiqueta: "Acabado", valor: fila.metadatos.acabado }]
            : []),
          ...(fila.metadatos.formato
            ? [{ etiqueta: "Formato", valor: fila.metadatos.formato }]
            : []),
          ...(fila.metadatos.peso_kg
            ? [
                { etiqueta: "Peso", valor: `${fila.metadatos.peso_kg} kg` },
              ]
            : []),
        ]
      : [],
    configuracionVariantes: undefined,
    etiquetasComerciales: fila.es_destacado ? ["Destacado"] : [],
  };
}

export async function obtenerProductosCatalogo(
  opciones: OpcionesObtencionCatalogo = {},
): Promise<RespuestaCatalogoProductos> {
  const { incluirEsperaSimulada = true } = opciones;

  try {
    const supabase = crearClienteSupabaseServidorAnonimo();

    // Query a la tabla producto con estado activo
    const { data, error } = await supabase
      .from("producto")
      .select(
        `
        id,
        slug,
        nombre,
        resumen,
        descripcion,
        precio_base_iva_incluido,
        tipo_producto,
        coleccion,
        formato,
        peso_kg,
        es_destacado,
        metadatos,
        asignacion_categoria_producto(categoria_producto(nombre))
      `
      )
      .eq("estado", "activo")
      .order("nombre");

    if (error) {
      console.error("Error obteniendo productos de Supabase:", error);
      // En caso de error, retornar array vacío (no usar mocks)
      return [];
    }

    if (!data || !Array.isArray(data)) {
      return [];
    }

    // Transformar datos de BD a formato ProductoCatalogo
    const productos = data.map((fila: any) => {
      // Extraer categoría del M-to-M
      const categoria =
        fila.asignacion_categoria_producto?.[0]?.categoria_producto?.nombre ||
        "Sin categoría";

      return construirProductoCatalogoDesdeBaseDatos({
        ...fila,
        categoria,
      });
    });

    // Opcional: agregar delay para simular latencia de red (para testing)
    if (incluirEsperaSimulada && process.env.NODE_ENV === "development") {
      await new Promise((resolve) => setTimeout(resolve, 300));
    }

    return productos;
  } catch (error) {
    console.error("Error en obtenerProductosCatalogo:", error);
    // En caso de error, retornar array vacío
    return [];
  }
}
