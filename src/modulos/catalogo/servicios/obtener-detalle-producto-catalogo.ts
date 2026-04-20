import type {
  ProductoCatalogo,
  ProductoCatalogoPorSlug,
  RespuestaProductosRelacionadosCatalogo,
} from "../tipos/producto-catalogo";
import { consultarProductosCatalogoSupabase } from "./catalogo-supabase";

type OpcionesProductosRelacionadosCatalogo = Readonly<{
  limite?: number;
}>;

function puntuarProductoRelacionado(
  productoActual: ProductoCatalogo,
  productoCandidato: ProductoCatalogo,
): number {
  let puntaje = 0;

  if (
    productoActual.subcategoria &&
    productoCandidato.subcategoria === productoActual.subcategoria
  ) {
    puntaje += 4;
  }

  if (
    productoActual.coleccion &&
    productoCandidato.coleccion === productoActual.coleccion
  ) {
    puntaje += 4;
  }

  if (productoCandidato.categoria === productoActual.categoria) {
    puntaje += 3;
  }

  if (productoCandidato.tipoProducto === productoActual.tipoProducto) {
    puntaje += 2;
  }

  if (productoActual.marca && productoCandidato.marca === productoActual.marca) {
    puntaje += 2;
  }

  if (productoActual.nivel && productoCandidato.nivel === productoActual.nivel) {
    puntaje += 1;
  }

  return puntaje;
}

export async function obtenerProductoCatalogoPorSlug(
  slug: string,
): Promise<ProductoCatalogoPorSlug> {
  const productos = await consultarProductosCatalogoSupabase({ slug });
  return productos[0] ?? null;
}

export async function obtenerSlugsCatalogo(): Promise<readonly string[]> {
  const productos = await consultarProductosCatalogoSupabase();
  return productos.map((producto) => producto.slug);
}

export async function obtenerProductosRelacionadosCatalogo(
  slug: string,
  opciones: OpcionesProductosRelacionadosCatalogo = {},
): Promise<RespuestaProductosRelacionadosCatalogo> {
  const { limite = 3 } = opciones;
  const [productoActual, productosCatalogo] = await Promise.all([
    obtenerProductoCatalogoPorSlug(slug),
    consultarProductosCatalogoSupabase(),
  ]);

  if (!productoActual) {
    return [];
  }

  return productosCatalogo
    .filter((producto) => producto.slug !== slug)
    .sort((productoA, productoB) => {
      const puntajeA = puntuarProductoRelacionado(productoActual, productoA);
      const puntajeB = puntuarProductoRelacionado(productoActual, productoB);

      if (puntajeA !== puntajeB) {
        return puntajeB - puntajeA;
      }

      return productoA.precioIvaIncluido - productoB.precioIvaIncluido;
    })
    .slice(0, limite);
}
