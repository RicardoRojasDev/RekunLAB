# CORRECCIONES REQUERIDAS PARA MÓDULO 16 - Antes de Módulo 17

**Estado:** BLOQUEADOR  
**Criticidad:** ALTA  
**Tiempo Estimado:** 2-3 horas

---

## CAMBIOS OBLIGATORIOS (5 Correcciones)

### ✅ CORRECCIÓN 1: Ampliar Snapshot de Item Pedido

**Archivo:** `src/modulos/pedidos/repositorios/crear-pedido-supabase.ts`

**Cambiar líneas 26-40:**

```typescript
// ANTES:
function construirAtributosSnapshotItem(item: ItemCrearPedido): Record<string, unknown> {
  return {
    categoria: item.categoria,
    tipoProducto: item.tipoProducto,
    coleccion: item.coleccion ?? null,
    etiquetasComerciales: item.etiquetasComerciales ?? [],
    variante: item.variante
      ? {
          etiqueta: item.variante.etiqueta,
          codigoReferencia: item.variante.codigoReferencia,
          selecciones: item.variante.selecciones,
        }
      : null,
  };
}

// DESPUÉS:
function construirAtributosSnapshotItem(item: ItemCrearPedido): Record<string, unknown> {
  return {
    // Campos básicos
    categoria: item.categoria,
    tipoProducto: item.tipoProducto,
    coleccion: item.coleccion ?? null,
    etiquetasComerciales: item.etiquetasComerciales ?? [],
    
    // Campos NUEVOS para auditoría
    idProducto: item.idProducto ?? null,              // ← NUEVO
    nombreCompleto: item.nombreCompleto ?? null,      // ← NUEVO
    marca: item.marca ?? null,                         // ← NUEVO
    nivel: item.nivel ?? null,                         // ← NUEVO
    
    // Campos NUEVOS específicos por tipo
    formato: item.formato ?? null,                     // ← NUEVO
    pesoKg: item.pesoKg ?? null,                       // ← NUEVO
    acabado: item.acabado ?? null,                     // ← NUEVO
    efecto: item.efecto ?? null,                       // ← NUEVO
    colorHex: item.colorHex ?? null,                   // ← NUEVO
    compatiblePLA: item.compatiblePLA ?? null,         // ← NUEVO
    esDestacado: item.esDestacado ?? null,             // ← NUEVO
    estado: item.estado ?? null,                       // ← NUEVO
    
    // Variante (si aplica)
    variante: item.variante
      ? {
          etiqueta: item.variante.etiqueta,
          codigoReferencia: item.variante.codigoReferencia,
          selecciones: item.variante.selecciones,
        }
      : null,
  };
}
```

**Validación:**
```bash
# Verificar tipos compilables
npm run tsc --noEmit

# Buscar si se usa esta función en otros lados
grep -r "construirAtributosSnapshotItem" src/
# Resultado: solo en crear-pedido-supabase.ts (ok)
```

---

### ✅ CORRECCIÓN 2: Extender ItemCrearPedido Type

**Archivo:** `src/modulos/pedidos/tipos/crear-pedido.ts`

**Cambiar línea 32-43:**

```typescript
// ANTES:
export type ItemCrearPedido = Readonly<{
  slug: string;
  nombre: string;
  resumen: string;
  categoria: string;
  tipoProducto: string;
  coleccion?: string;
  precioUnitarioIvaIncluidoSnapshot: number;
  cantidad: number;
  etiquetasComerciales?: readonly string[];
  variante?: VariantePedido | null;
}>;

// DESPUÉS:
export type ItemCrearPedido = Readonly<{
  // Campos básicos (existentes)
  slug: string;
  nombre: string;
  resumen: string;
  categoria: string;
  tipoProducto: string;
  coleccion?: string;
  precioUnitarioIvaIncluidoSnapshot: number;
  cantidad: number;
  etiquetasComerciales?: readonly string[];
  
  // Campos NUEVOS para snapshot completo
  idProducto?: string;                  // ← NUEVO: UUID del producto
  nombreCompleto?: string;              // ← NUEVO: Descripción completa
  marca?: string;                       // ← NUEVO: Nombre de marca
  nivel?: string;                       // ← NUEVO: Nivel comercial
  formato?: string;                     // ← NUEVO: Formato/tamaño
  pesoKg?: number;                      // ← NUEVO: Peso en kg
  acabado?: string;                     // ← NUEVO: Acabado superficial
  efecto?: string;                      // ← NUEVO: Efecto visual
  colorHex?: string;                    // ← NUEVO: Color en hex
  compatiblePLA?: boolean;              // ← NUEVO: Compatible con PLA
  esDestacado?: boolean;                // ← NUEVO: Producto destacado
  estado?: string;                      // ← NUEVO: Estado en catálogo
  
  // Variante (existente)
  variante?: VariantePedido | null;
}>;
```

**Validación:**
```bash
npm run tsc --noEmit
# Debe pasar sin errores
```

---

### ✅ CORRECCIÓN 3: Extender Parseo de ItemCrearPedido

**Archivo:** `src/modulos/pedidos/validaciones/parsear-solicitud-crear-pedido.ts`

**Cambiar función `parsearItemCrearPedido` (línea 61-89):**

```typescript
// ANTES:
function parsearItemCrearPedido(valor: unknown): ItemCrearPedido | null {
  if (!esRegistro(valor)) {
    return null;
  }

  const etiquetasComerciales = obtenerArreglo(valor, "etiquetasComerciales").filter(
    (etiqueta) => typeof etiqueta === "string",
  ) as string[];

  const variante = parsearVariantePedido(valor.variante);

  const coleccion = obtenerTexto(valor, "coleccion");

  return {
    slug: obtenerTexto(valor, "slug"),
    nombre: obtenerTexto(valor, "nombre"),
    resumen: obtenerTexto(valor, "resumen"),
    categoria: obtenerTexto(valor, "categoria"),
    tipoProducto: obtenerTexto(valor, "tipoProducto"),
    coleccion: coleccion.length ? coleccion : undefined,
    precioUnitarioIvaIncluidoSnapshot: obtenerNumero(
      valor,
      "precioUnitarioIvaIncluidoSnapshot",
    ),
    cantidad: obtenerNumero(valor, "cantidad"),
    etiquetasComerciales: etiquetasComerciales.length ? etiquetasComerciales : undefined,
    variante,
  };
}

// DESPUÉS:
function parsearItemCrearPedido(valor: unknown): ItemCrearPedido | null {
  if (!esRegistro(valor)) {
    return null;
  }

  const etiquetasComerciales = obtenerArreglo(valor, "etiquetasComerciales").filter(
    (etiqueta) => typeof etiqueta === "string",
  ) as string[];

  const variante = parsearVariantePedido(valor.variante);

  const coleccion = obtenerTexto(valor, "coleccion");
  const idProducto = obtenerTexto(valor, "idProducto");          // ← NUEVO
  const nombreCompleto = obtenerTexto(valor, "nombreCompleto");  // ← NUEVO
  const marca = obtenerTexto(valor, "marca");                    // ← NUEVO
  const nivel = obtenerTexto(valor, "nivel");                    // ← NUEVO
  const formato = obtenerTexto(valor, "formato");                // ← NUEVO
  const acabado = obtenerTexto(valor, "acabado");                // ← NUEVO
  const efecto = obtenerTexto(valor, "efecto");                  // ← NUEVO
  const colorHex = obtenerTexto(valor, "colorHex");              // ← NUEVO
  const estado = obtenerTexto(valor, "estado");                  // ← NUEVO

  const pesoKg = obtenerNumero(valor, "pesoKg");                 // ← NUEVO
  const compatiblePLA = valor["compatiblePLA"] === true;         // ← NUEVO
  const esDestacado = valor["esDestacado"] === true;             // ← NUEVO

  return {
    slug: obtenerTexto(valor, "slug"),
    nombre: obtenerTexto(valor, "nombre"),
    resumen: obtenerTexto(valor, "resumen"),
    categoria: obtenerTexto(valor, "categoria"),
    tipoProducto: obtenerTexto(valor, "tipoProducto"),
    coleccion: coleccion.length ? coleccion : undefined,
    precioUnitarioIvaIncluidoSnapshot: obtenerNumero(
      valor,
      "precioUnitarioIvaIncluidoSnapshot",
    ),
    cantidad: obtenerNumero(valor, "cantidad"),
    etiquetasComerciales: etiquetasComerciales.length ? etiquetasComerciales : undefined,
    
    // Campos NUEVOS
    idProducto: idProducto.length ? idProducto : undefined,
    nombreCompleto: nombreCompleto.length ? nombreCompleto : undefined,
    marca: marca.length ? marca : undefined,
    nivel: nivel.length ? nivel : undefined,
    formato: formato.length ? formato : undefined,
    pesoKg: Number.isFinite(pesoKg) ? pesoKg : undefined,
    acabado: acabado.length ? acabado : undefined,
    efecto: efecto.length ? efecto : undefined,
    colorHex: colorHex.length ? colorHex : undefined,
    compatiblePLA: compatiblePLA ? true : undefined,
    esDestacado: esDestacado ? true : undefined,
    estado: estado.length ? estado : undefined,
    
    variante,
  };
}
```

**Validación:**
```bash
npm run tsc --noEmit
# Debe pasar sin errores
```

---

### ✅ CORRECCIÓN 4: Validación de Campos Nuevos

**Archivo:** `src/modulos/pedidos/validaciones/crear-pedido.ts`

**Cambiar función `validarItemCrearPedido` (línea 145-170):**

```typescript
// ANTES:
function validarItemCrearPedido(item: ItemCrearPedido) {
  const errores: string[] = [];

  if (!normalizarTexto(item.slug).length) {
    errores.push("Falta slug del producto.");
  }

  if (!normalizarTexto(item.nombre).length) {
    errores.push("Falta nombre del producto.");
  }

  const errorCantidad = validarEnteroPositivo(item.cantidad, "cantidad");
  if (errorCantidad) {
    errores.push(errorCantidad);
  }

  const errorPrecio = validarMontoNoNegativo(
    item.precioUnitarioIvaIncluidoSnapshot,
    "precio unitario",
  );
  if (errorPrecio) {
    errores.push(errorPrecio);
  }

  return errores.length ? errores.join(" ") : null;
}

// DESPUÉS:
function validarItemCrearPedido(item: ItemCrearPedido) {
  const errores: string[] = [];

  // Campos requeridos
  if (!normalizarTexto(item.slug).length) {
    errores.push("Falta slug del producto.");
  }

  if (!normalizarTexto(item.nombre).length) {
    errores.push("Falta nombre del producto.");
  }

  const errorCantidad = validarEnteroPositivo(item.cantidad, "cantidad");
  if (errorCantidad) {
    errores.push(errorCantidad);
  }

  const errorPrecio = validarMontoNoNegativo(
    item.precioUnitarioIvaIncluidoSnapshot,
    "precio unitario",
  );
  if (errorPrecio) {
    errores.push(errorPrecio);
  }

  // Validaciones opcionales para snapshot (no bloquean)
  // Los campos NUEVOS son opcionales (?) y no causan error
  // Solo se validan si están presentes:
  
  if (item.pesoKg !== undefined && (typeof item.pesoKg !== "number" || item.pesoKg < 0)) {
    errores.push("Peso debe ser un numero positivo.");
  }

  // El resto de campos se validan a nivel de tipo TypeScript
  // (eslint + tsc verifican que sean string | number | boolean | undefined)

  return errores.length ? errores.join(" ") : null;
}
```

**Validación:**
```bash
npm run tsc --noEmit
# Debe pasar sin errores
```

---

### ✅ CORRECCIÓN 5: Actualizar Checkout para Enviar Campos Nuevos

**Archivo:** `src/modulos/checkout/componentes/pagina-checkout-visual.tsx`

**Cambiar línea 134-151 (en función manejarEnvio):**

```typescript
// ANTES:
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
  variante: item.variante
    ? {
        etiqueta: item.variante.etiqueta,
        codigoReferencia: item.variante.codigoReferencia,
        selecciones: item.variante.selecciones,
      }
    : null,
})),

// DESPUÉS:
items: items.map((item) => ({
  // Campos existentes
  slug: item.slug,
  nombre: item.nombre,
  resumen: item.resumen,
  categoria: item.categoria,
  tipoProducto: item.tipoProducto,
  coleccion: item.coleccion,
  precioUnitarioIvaIncluidoSnapshot: item.precioUnitarioIvaIncluido,
  cantidad: item.cantidad,
  etiquetasComerciales: item.etiquetasComerciales,
  
  // Campos NUEVOS (si existen en item, se envían)
  idProducto: item.productoId,                    // ← NUEVO
  nombreCompleto: item.nombreCompleto,           // ← NUEVO
  marca: item.marca,                             // ← NUEVO
  nivel: item.nivel,                             // ← NUEVO
  formato: item.formato,                         // ← NUEVO
  pesoKg: item.pesoKg,                           // ← NUEVO
  acabado: item.acabado,                         // ← NUEVO
  efecto: item.efecto,                           // ← NUEVO
  colorHex: item.colorHex,                       // ← NUEVO
  compatiblePLA: item.compatiblePLA,             // ← NUEVO
  esDestacado: item.esDestacado,                 // ← NUEVO
  estado: item.estado,                           // ← NUEVO
  
  variante: item.variante
    ? {
        etiqueta: item.variante.etiqueta,
        codigoReferencia: item.variante.codigoReferencia,
        selecciones: item.variante.selecciones,
      }
    : null,
})),
```

**Nota:** ItemCarrito YA TIENE estos campos, solo faltan hacerlos visibles en el carrito. Ver siguiente sección.

---

## CAMBIOS SECUNDARIOS (Mejora - No Bloquean)

### ✅ CAMBIO SECUNDARIO 1: Hacer Visibles Campos en Carrito (Opcional)

**Archivo:** `src/modulos/carrito/tipos/carrito.ts`

Ya tienen los tipos. Si quieres que se capturen al agregar producto:

```typescript
// En panel-compra-producto-detalle.tsx:101-126
// Ya se pasan todos los campos necesarios, solo revisar que lleguen
```

---

## CHECKLIST DE VALIDACIÓN

### Pre-Implementación
- [ ] Leí AUDITORIA-MODULO-16.md completo
- [ ] Entiendo los 5 cambios necesarios
- [ ] Entiendo el impacto de cada cambio

### Implementación
- [ ] Cambio 1: crear-pedido-supabase.ts - construirAtributosSnapshotItem ✅
- [ ] Cambio 2: crear-pedido.ts - ItemCrearPedido type ✅
- [ ] Cambio 3: parsear-solicitud-crear-pedido.ts - función parsear ✅
- [ ] Cambio 4: crear-pedido.ts - función validar ✅
- [ ] Cambio 5: pagina-checkout-visual.tsx - items mapping ✅

### Validación
- [ ] `npm run tsc --noEmit` → 0 errores
- [ ] `grep -r "productosCatalogoMock" src/` → solo en catalogo/
- [ ] Crear producto en BD (local)
- [ ] Test: Agregar → Carrito → Checkout → Pedido
- [ ] Verificar item_pedido.atributos_snapshot en BD (debe tener 18 campos)

### Post-Cambios
- [ ] Commit: "Ampliar snapshot de pedido con 13 campos adicionales"
- [ ] Documentar cambios en team
- [ ] **ENTONCES** proceder a Módulo 17

---

## TIEMPO ESTIMADO

```
Cambio 1 (crear-pedido-supabase.ts):   15 min
Cambio 2 (crear-pedido.ts types):      10 min
Cambio 3 (parsear-solicitud):          15 min
Cambio 4 (validaciones):               10 min
Cambio 5 (checkout):                   10 min
Validación + Testing:                  30 min
─────────────────────────────────────
TOTAL:                                  90 min (1.5 horas)
```

---

## ¿QUÉ PASA DESPUÉS?

Una vez completadas estas 5 correcciones:

1. ✅ Módulo 16 queda sin deuda técnica
2. ✅ Snapshot es completo para auditoría
3. ✅ Pedido guarda información real (no mocks)
4. ✅ Listo para conectar a BD en Módulo 17

**SOLO ENTONCES** puedes proceder a:
- Módulo 17A: Admin CRUD de productos
- Módulo 17B: Importación bulk de catálogo

