# Plan de Corrección Estructural - Implementación

**Prioridad:** ANTES DE MÓDULO 17  
**Scope:** Reemplazar mocks con datos reales de Supabase  
**Riesgo:** BAJO (cambios internos, sin romper UX)

---

## ARCHIVOS A MODIFICAR

### 1️⃣ TIPOS - Extender estructuras

#### `src/modulos/catalogo/tipos/producto-catalogo.ts`

**Cambios Requeridos:**

```typescript
// AGREGAR NUEVO TIPO: ProductoAtributosSnapshot
export type ProductoAtributosSnapshot = Readonly<{
  formato?: string;
  pesoKg?: number;
  acabado?: string;
  efecto?: string;
  colorHex?: string;
  compatiblePLA?: boolean;
  esDestacado?: boolean;
  estado?: string;
  // Flexible para otros tipos de producto
  [key: string]: unknown;
}>;

// EXTENDER ResumenProductoCatalogo
export type ResumenProductoCatalogo = Readonly<{
  id: string;
  slug: string;
  nombre: string;
  nombreCompleto?: string;  // ← NUEVO
  resumen: string;
  categoria: string;
  tipoProducto: string;
  marca?: string;           // ← NUEVO (nombre o código)
  nivel?: string;           // ← NUEVO (nombre o código)
  coleccion?: string;
  precioIvaIncluido: number;
  imagen: ImagenProductoCatalogo;
  etiquetasComerciales: readonly string[];
  atributosSnapshot?: ProductoAtributosSnapshot;  // ← NUEVO
}>;

// EXTENDER ProductoCatalogo (heredará lo anterior)
export type ProductoCatalogo = Readonly<
  ResumenProductoCatalogo & {
    descripcion: string;
    imagenesGaleria: readonly ImagenGaleriaProductoCatalogo[];
    especificaciones: readonly EspecificacionProductoCatalogo[];
    configuracionVariantes?: ConfiguracionVariantesProductoCatalogo;
    // Ya hereda: nombreCompleto, marca, nivel, atributosSnapshot
  }
>;
```

#### `src/modulos/carrito/tipos/carrito.ts`

**Cambios Requeridos:**

```typescript
import type { ProductoAtributosSnapshot } from "@/modulos/catalogo/tipos/producto-catalogo";

export type EntradaAgregarItemCarrito = Readonly<{
  productoId: string;                          // ← NUEVO: UUID del producto
  slug: string;
  nombre: string;
  nombreCompleto?: string;                     // ← NUEVO
  resumen: string;
  categoria: string;
  tipoProducto: string;
  marca?: string;                              // ← NUEVO
  nivel?: string;                              // ← NUEVO
  coleccion?: string;
  imagen: ImagenItemCarrito;
  precioUnitarioIvaIncluido: number;
  cantidad: number;
  etiquetasComerciales?: readonly string[];
  atributosSnapshot?: ProductoAtributosSnapshot;  // ← NUEVO
  variante?: VarianteItemCarrito | null;
}>;

// ItemCarrito hereda automáticamente
export type ItemCarrito = Readonly<
  EntradaAgregarItemCarrito & {
    idLinea: string;
  }
>;
```

#### `src/modulos/pedidos/tipos/crear-pedido.ts`

**Cambios Requeridos:**

```typescript
import type { ProductoAtributosSnapshot } from "@/modulos/catalogo/tipos/producto-catalogo";

export type ItemCrearPedido = Readonly<{
  idProducto: string;                          // ← NUEVO: UUID producto
  slug: string;
  nombre: string;
  nombreCompleto?: string;                     // ← NUEVO
  resumen: string;
  categoria: string;
  tipoProducto: string;
  marca?: string;                              // ← NUEVO
  nivel?: string;                              // ← NUEVO
  coleccion?: string;
  precioUnitarioIvaIncluidoSnapshot: number;
  cantidad: number;
  etiquetasComerciales?: readonly string[];
  atributosSnapshot?: ProductoAtributosSnapshot;  // ← NUEVO (JSONB en BD)
  variante?: VariantePedido | null;
}>;

// El resto de tipos (SolicitudCrearPedido, etc.) heredan automáticamente
```

---

### 2️⃣ SERVICIOS - Conectar a BD

#### `src/modulos/catalogo/servicios/obtener-productos-catalogo.ts`

**Cambiar de:**
```typescript
import { productosCatalogoMock } from "../datos/productos-catalogo-mock";

export async function obtenerProductosCatalogo(
  opciones: OpcionesObtencionCatalogo = {},
): Promise<RespuestaCatalogoProductos> {
  const { incluirEsperaSimulada = true } = opciones;
  if (incluirEsperaSimulada) {
    await esperar(demoraMockCatalogoMs);
  }
  return productosCatalogoMock;  // ← Mock
}
```

**A:**
```typescript
import { supabase } from "@/compartido/supabase/cliente";
import type { RespuestaCatalogoProductos } from "../tipos/producto-catalogo";

export async function obtenerProductosCatalogo(
  opciones: OpcionesObtencionCatalogo = {},
): Promise<RespuestaCatalogoProductos> {
  const { incluirEsperaSimulada = true } = opciones;

  // Query productos activos con relaciones
  const { data, error } = await supabase
    .from("producto")
    .select(`
      id,
      slug,
      nombre,
      resumen,
      descripcion,
      precio_base_iva_incluido,
      estado:estado_id(codigo, nombre),
      marca:marca_id(nombre),
      nivel:nivel_comercial_id(nombre),
      asignacion:asignacion_categoria_producto(
        categoria:categoria_id(slug, nombre)
      ),
      atributos:valor_atributo_producto(
        definicion:definicion_atributo_producto(codigo),
        valor_texto,
        valor_numero,
        valor_objeto
      ),
      variantes:variante_producto(
        id,
        codigo_referencia,
        nombre_comercial,
        precio_iva_incluido,
        sku_variante
      )
    `)
    .eq("estado_id.esta_activo", true)
    .eq("vende_directo", true);

  if (error) {
    console.error("Error cargando catálogo:", error);
    throw new Error("No se pudo cargar el catálogo");
  }

  // Mapear filas BD → tipos ProductoCatalogo
  return mapearProductosBD(data || []);
}

function mapearProductosBD(filas: unknown[]): RespuestaCatalogoProductos {
  return filas.map((fila: any) => ({
    id: fila.id,
    slug: fila.slug,
    nombre: fila.nombre,
    resumen: fila.resumen,
    descripcion: fila.descripcion,
    categoria: fila.asignacion?.[0]?.categoria?.nombre ?? "Sin categoría",
    tipoProducto: "Producto",  // Resolver desde atributos/metadata
    marca: fila.marca?.nombre,
    nivel: fila.nivel?.nombre,
    precioIvaIncluido: fila.precio_base_iva_incluido ?? 0,
    imagen: {
      src: "/imagenes/placeholder.svg",  // Habrá tabla de imágenes
      alt: fila.nombre,
      ancho: 800,
      alto: 960,
    },
    etiquetasComerciales: [],
    // Atributos específicos por tipo
    atributosSnapshot: construirAtributosSnapshot(fila),
    // Variantes
    configuracionVariantes: fila.variantes?.length
      ? construirConfiguracionVariantes(fila.variantes)
      : undefined,
    imagenesGaleria: [],  // De tabla separada
    especificaciones: [],  // De tabla separada
  }));
}

function construirAtributosSnapshot(producto: any): ProductoAtributosSnapshot {
  // Parsear atributos jsonb desde BD
  return {};  // Implementar según tipo de producto
}

function construirConfiguracionVariantes(
  variantes: any[],
): ConfiguracionVariantesProductoCatalogo {
  // Mapear variantes BD → ConfiguracionVariantes
  return {
    atributos: [],
    variantes: [],
  };
}
```

---

### 3️⃣ COMPONENTES - Capturar todos los campos

#### `src/modulos/catalogo/componentes/detalle-producto/panel-compra-producto-detalle.tsx`

**En función `agregarSeleccionLocal()` (línea 87+):**

**Cambiar de:**
```typescript
agregarItem(
  {
    productoId: producto.id,           // Ya está
    slug: producto.slug,               // Ya está
    nombre: producto.nombre,           // Ya está
    resumen: producto.resumen,         // Ya está
    categoria: producto.categoria,     // Ya está
    tipoProducto: producto.tipoProducto,
    coleccion: producto.coleccion,
    imagen: vistaDetalle.imagen,
    precioUnitarioIvaIncluido: vistaDetalle.precioIvaIncluido,
    cantidad,
    etiquetasComerciales: producto.etiquetasComerciales,
    variante: /* ... */
  },
  { abrirDrawer: true }
);
```

**A:**
```typescript
agregarItem(
  {
    productoId: producto.id,
    slug: producto.slug,
    nombre: producto.nombre,
    nombreCompleto: producto.nombreCompleto,           // ← NUEVO
    resumen: producto.resumen,
    categoria: producto.categoria,
    tipoProducto: producto.tipoProducto,
    marca: producto.marca,                             // ← NUEVO
    nivel: producto.nivel,                             // ← NUEVO
    coleccion: producto.coleccion,
    imagen: vistaDetalle.imagen,
    precioUnitarioIvaIncluido: vistaDetalle.precioIvaIncluido,
    cantidad,
    etiquetasComerciales: producto.etiquetasComerciales,
    atributosSnapshot: producto.atributosSnapshot,     // ← NUEVO
    variante: vistaDetalle.varianteSeleccionada
      ? {
          id: vistaDetalle.varianteSeleccionada.id,
          etiqueta: vistaDetalle.varianteSeleccionada.etiqueta,
          codigoReferencia: vistaDetalle.varianteSeleccionada.codigoReferencia,
          selecciones: seleccionesVariante,
        }
      : null,
  },
  { abrirDrawer: true }
);
```

---

### 4️⃣ CHECKOUT - Mapeo Dinámico

#### `src/modulos/checkout/componentes/pagina-checkout-visual.tsx`

**En función `manejarEnvio()` (línea 103+):**

**Cambiar de:** (líneas 134-151 actual)
```typescript
items: items.map((item) => ({
  slug: item.slug,
  nombre: item.nombre,
  resumen: item.resumen,
  categoria: item.categoria,
  tipoProducto: item.tipoProducto,
  coleccion: item.coleccion,
  precioUnitarioIvaIncluidoSnapshot: item.precioUnitarioIvaIncluido,
  cantidad: item.cantidad,
  etiquetasComerciales: item.etiquetasComerciales,
  variante: item.variante ? { /* ... */ } : null,
}))
```

**A:**
```typescript
items: items.map((item) => ({
  idProducto: item.productoId,                         // ← NUEVO
  slug: item.slug,
  nombre: item.nombre,
  nombreCompleto: item.nombreCompleto,                 // ← NUEVO
  resumen: item.resumen,
  categoria: item.categoria,
  tipoProducto: item.tipoProducto,
  marca: item.marca,                                   // ← NUEVO
  nivel: item.nivel,                                   // ← NUEVO
  coleccion: item.coleccion,
  precioUnitarioIvaIncluidoSnapshot: item.precioUnitarioIvaIncluido,
  cantidad: item.cantidad,
  etiquetasComerciales: item.etiquetasComerciales,
  atributosSnapshot: item.atributosSnapshot,           // ← NUEVO
  variante: item.variante
    ? {
        etiqueta: item.variante.etiqueta,
        codigoReferencia: item.variante.codigoReferencia,
        selecciones: item.variante.selecciones,
      }
    : null,
}))
```

---

### 5️⃣ PERSISTENCIA - LocalStorage

#### `src/modulos/carrito/servicios/persistencia-carrito-local.ts`

Sin cambios estructurales, ya que localStorage persiste el objeto completo. Solo validar que `atributosSnapshot` se incluya.

---

## ORDEN DE IMPLEMENTACIÓN

### PASO 1: Crear nuevos tipos (30 min)
1. Crear `ProductoAtributosSnapshot` en `producto-catalogo.ts`
2. Extender `ResumenProductoCatalogo`
3. Actualizar `EntradaAgregarItemCarrito`
4. Actualizar `ItemCrearPedido`
5. **Test:** Compilar sin errores

### PASO 2: Crear función BD (60 min)
1. Crear nueva función `mapearProductosBD()`
2. Implementar `obtenerProductosDesdeBD()` en obtener-productos-catalogo.ts
3. Mantener fallback a mocks si BD falla
4. **Test:** Conectar a Supabase en desarrollo

### PASO 3: Actualizar panel de compra (20 min)
1. Agregar campos nuevos en `agregarSeleccionLocal()`
2. Verificar que `atributosSnapshot` se captura
3. **Test:** Agregar producto al carrito, ver en DevTools

### PASO 4: Actualizar checkout (15 min)
1. Extender mapeo de items con nuevos campos
2. Asegurar `atributosSnapshot` se envía como JSONB
3. **Test:** Hacer pedido completo

### PASO 5: Validar BD (20 min)
1. Revisar tabla `item_pedido`: campos presentes
2. Verificar `atributosSnapshot` es jsonb
3. **Test:** Query a `item_pedido` para confirmar datos

### PASO 6: Limpiar (10 min)
1. Eliminar `productos-catalogo-mock.ts`
2. Remover imports del mock
3. Actualizar comentarios en servicios
4. **Test:** Build y deploy a staging

---

## VALIDACIÓN POR FASE

| Fase | Validación | Comando/Check |
|------|-----------|---------------|
| 1 | Tipos compilables | `npm run tsc --noEmit` |
| 2 | BD conectada | `SELECT COUNT(*) FROM producto;` en Supabase |
| 3 | Carrito persiste campos | localStorage → ItemCarrito con todos campos |
| 4 | Checkout mapea completo | Network tab → POST /api/pedidos con atributosSnapshot |
| 5 | Pedido guarda snapshot | SELECT * FROM item_pedido WHERE id='...'; |
| 6 | Sin mocks | grep -r "productosCatalogoMock" src/ → 0 resultados |

---

## RIESGOS Y MITIGACIÓN

| Riesgo | Mitigation |
|--------|-----------|
| BD sin datos reales | Usar trigger/seed con 5-10 productos de prueba |
| Variantes no existen en BD | Hacer variantes opcionales en tipos |
| Atributos incompletos | Usar jsonb flexible, permitir {}, expandir después |
| Pérdida de datos actuales | Backup de localStorage antes de cambios |
| Componentes usan datos mock aún | Buscar productosCatalogoMock en todo proyecto |

---

## ARCHIVOS NO MODIFICAR

✅ Ya están bien estructurados:
- `src/modulos/carrito/utilidades/operaciones-carrito.ts`
- `src/modulos/carrito/contexto/proveedor-carrito.tsx`
- `src/modulos/carrito/hooks/use-carrito.ts`
- `src/app/api/pedidos/route.ts`
- `supabase/migrations/` (esquema BD completo)
- Componentes UI base

---

## POST-CORRECCIÓN

Una vez completado:

1. **Documentar** en MEMORY.md cualquier decisión de mapeo
2. **Comunicar** al equipo cambios en tipos ProductoCatalogo
3. **Planificar** Módulo 17A: Admin CRUD de productos

