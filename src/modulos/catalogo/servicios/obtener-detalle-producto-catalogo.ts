import { productosCatalogoMock } from "../datos/productos-catalogo-mock";
import type {
  ProductoCatalogo,
  ProductoCatalogoPorSlug,
  RespuestaProductosRelacionadosCatalogo,
} from "../tipos/producto-catalogo";

type OpcionesProductosRelacionadosCatalogo = Readonly<{
  limite?: number;
}>;

function puntuarProductoRelacionado(
  productoActual: ProductoCatalogo,
  productoCandidato: ProductoCatalogo,
): number {
  let puntaje = 0;

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

  return puntaje;
}

export async function obtenerProductoCatalogoPorSlug(
  slug: string,
): Promise<ProductoCatalogoPorSlug> {
  return productosCatalogoMock.find((producto) => producto.slug === slug) ?? null;
}

export async function obtenerSlugsCatalogo(): Promise<readonly string[]> {
  return productosCatalogoMock.map((producto) => producto.slug);
}

export async function obtenerProductosRelacionadosCatalogo(
  slug: string,
  opciones: OpcionesProductosRelacionadosCatalogo = {},
): Promise<RespuestaProductosRelacionadosCatalogo> {
  const { limite = 3 } = opciones;
  const productoActual = await obtenerProductoCatalogoPorSlug(slug);

  if (!productoActual) {
    return [];
  }

  return productosCatalogoMock
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
