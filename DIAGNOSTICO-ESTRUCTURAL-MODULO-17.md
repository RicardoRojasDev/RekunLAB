# Diagnóstico Estructural - Integración Catálogo Real → Carrito → Checkout → Pedido

**Fecha:** 2026-04-19  
**Estado:** Pre-Módulo 17  
**Responsable:** Lead Fullstack Developer

---

## 1. RESUMEN EJECUTIVO

El sistema actual está **completamente basado en mocks hardcodeados**. Existe una **brecha crítica** entre:

- **BD Supabase**: Esquema completo y flexible listo para el catálogo real
- **Frontend**: Usa array mock de 6 productos con estructura incompleta
- **Carrito**: Captura solo 8 campos del producto (faltan 15+)
- **Pedido**: Snapshot incompleto, no captura datos críticos para auditoría/inteligencia

La corrección debe **eliminar todos los mocks** y **conectar directamente con Supabase**, manteniendo la arquitectura escalable ya implementada.

---

## 2. PROBLEMAS DETECTADOS

### 2.1 CATÁLOGO (CRÍTICO)

| Problema | Severidad | Ubicación | Impacto |
|----------|-----------|-----------|--------|
| Datos completamente hardcodeados | 🔴 CRÍTICA | `src/modulos/catalogo/datos/productos-catalogo-mock.ts` | No hay datos reales, solo 6 productos ficticios |
| No hay integración BD | 🔴 CRÍTICA | `src/modulos/catalogo/servicios/obtener-*.ts` | Funciones devuelven mocks, ignorar Supabase |
| Estructura incompleta de producto | 🔴 CRÍTICA | `src/modulos/catalogo/tipos/producto-catalogo.ts` | Faltan: nombreCompleto, marca, nivel, formato, pesoKg, etc. |
| Variantes forzadas para todo | 🟠 MAYOR | Mock + tipos | Productos sin variantes quedan incompatibles con la lógica |

### 2.2 CARRITO (MAYOR)

| Problema | Severidad | Ubicación | Impacto |
|----------|-----------|-----------|--------|
| Solo captura 8 campos de producto | 🟠 MAYOR | `src/modulos/carrito/tipos/carrito.ts` - `EntradaAgregarItemCarrito` | Snapshot incompleto en BD |
| No incluye idProducto (UUID) | 🟠 MAYOR | `panel-compra-producto-detalle.tsx:103` | Auditoría y trazabilidad débiles |
| Sin campos de atributos específicos | 🟠 MAYOR | Tipos carrito | Imposible guardar formato, peso, acabado al agregar |
| Pérdida de datos de marca/nivel | 🟠 MAYOR | Mapeo carrito → pedido | No persisten al pedido |

### 2.3 CHECKOUT (MAYOR)

| Problema | Severidad | Ubicación | Impacto |
|----------|-----------|-----------|--------|
| Mapeo manual incompleto | 🟠 MAYOR | `pagina-checkout-visual.tsx:134-151` | Campos hardcodeados, no escalable |
| Faltan campos esperados por BD | 🟠 MAYOR | SQL espera: `codigoReferenciaVariante`, `skuSnapshot`, `atributosSnapshot` | No pueden procesarse items con atributos |
| No se envía `atributosSnapshot` | 🟠 MAYOR | Solicitud → API | BD guarda jsonb vacío para atributos |

### 2.4 PEDIDO (MAYOR)

| Problema | Severidad | Ubicación | Impacto |
|----------|-----------|-----------|--------|
| Snapshot incompleto de item | 🟠 MAYOR | `src/modulos/pedidos/tipos/crear-pedido.ts` | ItemCrearPedido solo guarda: slug, nombre, resumen, categoria, tipoProducto, coleccion |
| Campos reales ausentes | 🟠 MAYOR | Tipos + SQL | No se guardan: marca, nivel, nombreCompleto, formato, peso, acabado, efecto, colorHex, compatiblePLA, esDestacado, estado |
| SQL espera metadatos pero frontend no envía | 🟠 MAYOR | `20260419213000_modulo_16_sistema_pedidos.sql:267-271` | `atributosSnapshot` se guarda como objeto vacío |
| No hay ID de producto en snapshot | 🟠 MAYOR | ItemCrearPedido.ts | Campo `idProducto` ausente, solo hay `slug` |

### 2.5 TIPOS Y CONTRATOS (MAYOR)

```typescript
// ACTUAL - EntradaAgregarItemCarrito (8 campos):
- productoId ✅
- slug ✅
- nombre ✅
- resumen ✅
- categoria ✅
- tipoProducto ✅
- coleccion ⚠️ (opcional)
- imagen ✅
- precioUnitarioIvaIncluido ✅
- cantidad ✅
- etiquetasComerciales ⚠️ (opcional)
- variante (compleja)

// REQUERIDO para snapshot completo:
- idProducto ❌ (falta)
- nombreCompleto ❌
- marca ❌
- nivel ❌
- formato ❌
- pesoKg ❌
- acabado ❌
- efecto ❌
- colorHex ❌
- compatiblePLA ❌
- coleccion ✅
- esDestacado ❌
- estado ❌
```

---

## 3. ESTRUCTURA ACTUAL VS. REQUERIDA

### 3.1 Campo: ProductoCatalogo Actual

```typescript
ResumenProductoCatalogo {
  id, slug, nombre, resumen, categoria, tipoProducto, 
  coleccion?, precioIvaIncluido, imagen, etiquetasComerciales
}

ProductoCatalogo extends ResumenProductoCatalogo {
  descripcion, imagenesGaleria, especificaciones, 
  configuracionVariantes?
}
```

**Falta:** marca, nivel, nombreCompleto, campos específicos de tipo

### 3.2 Tabla BD: producto (Supabase)

```sql
CREATE TABLE producto (
  id uuid, slug text, sku_base text, nombre text,
  modelo_comercial text, resumen text, descripcion text,
  precio_base_iva_incluido int,
  marca_id uuid, nivel_comercial_id uuid, 
  tecnologia_impresion_id uuid, estado_id uuid,
  vende_directo bool, permite_cotizacion bool,
  metadatos jsonb, ...
)
```

**Observación:** Marca y nivel son FK, no campos directos. Hay que resolver joins.

### 3.3 Snapshot Esperado por BD (item_pedido)

```sql
INSERT INTO item_pedido (
  ..., sku_snapshot, nombre_producto_snapshot, 
  descripcion_producto_snapshot, atributos_snapshot, ...
)
```

**Atributos_snapshot** debe ser JSONB con datos críticos para auditoría/inteligencia.

---

## 4. RAÍZ DE LOS PROBLEMAS

1. **Etapa de Diseño:** Sistema diseñado con datos mock simples, no anticipó campos reales
2. **Desconexión BD:** Supabase integrado pero nunca conectado al frontend
3. **Falta de Mapeo:** No hay función que traduzca BD → tipos TypeScript
4. **Tipado Incompleto:** Types no reflejan campos reales necesarios
5. **Hardcoding:** Cada componente mapea manualmente en lugar de usar funciones escalables

---

## 5. AUDITORÍA DE ARCHIVOS

### Archivos que Usan/Mantienen Mocks

```
🔴 ELIMINAR/REEMPLAZAR:
  src/modulos/catalogo/datos/productos-catalogo-mock.ts (670 líneas mock)

🟠 ACTUALIZAR TIPOS:
  src/modulos/catalogo/tipos/producto-catalogo.ts
  src/modulos/carrito/tipos/carrito.ts
  src/modulos/pedidos/tipos/crear-pedido.ts

🟠 ACTUALIZAR SERVICIOS:
  src/modulos/catalogo/servicios/obtener-productos-catalogo.ts
  src/modulos/catalogo/servicios/obtener-detalle-producto-catalogo.ts

🟠 ACTUALIZAR COMPONENTES:
  src/modulos/catalogo/componentes/detalle-producto/panel-compra-producto-detalle.tsx
  src/modulos/checkout/componentes/pagina-checkout-visual.tsx

✅ OK (No requieren cambios):
  src/modulos/carrito/utilidades/operaciones-carrito.ts
  src/modulos/carrito/contexto/proveedor-carrito.tsx
  src/app/api/pedidos/route.ts (validación está bien)
  supabase/migrations/* (esquema BD está completo)
```

---

## 6. CAMPOS FALTANTES POR TIPO DE PRODUCTO

### Filamentos PLA
- formato (ej: "Bobina de 750g", "Bobina de 1kg")
- pesoKg
- acabado (ej: "Mate", "Brillante")
- colorHex
- compatiblePLA

### Impresoras 3D
- tipoMaquina (ej: "FDM")
- volumenImpresion
- tecnologia

### Objetos Impresos
- material (ej: "PLA ecológico")
- acabado
- pesoKg
- dimensiones

### Accesorios
- compatibilidad
- especificacionesTecnicas

**Todos los Productos:**
- marca (relación)
- nivel (relación)
- nombreCompleto
- esDestacado
- estado (relación)
- coleccion (opcional)

---

## 7. RIESGOS DE NO CORREGIR

| Riesgo | Probabilidad | Impacto |
|--------|--------------|--------|
| Datos incorrectos en pedidos | 🔴 100% | Auditoría fallida, no hay trazabilidad real |
| No poder buscar por marca/nivel | 🔴 100% | Admin no puede filtrar productos |
| Imposible escalar a 100+ productos | 🔴 100% | Sistema queda atado a mock |
| Snapshot vacío impide inteligencia de datos | 🟠 95% | No se pueden analizar patrones de compra |
| Pérdida de datos al checkout | 🟠 90% | Retorno a cliente incompleto |

---

## 8. ESTRATEGIA DE CORRECCIÓN

### Fase 1: Actualizar Tipos (Low Risk, High Value)
1. Extender `ProductoCatalogo` con campos faltantes
2. Actualizar `EntradaAgregarItemCarrito` con todos los campos
3. Actualizar `ItemCrearPedido` con snapshot completo
4. Asegurar tipos sean `Readonly` y estructurados

### Fase 2: Crear Adaptadores BD → Frontend
1. Nueva función: `obtenerProductosDesdeBD()`
2. Mapear filas BD → tipos TypeScript
3. Resolver JOINs: marca, nivel, estado, categoria
4. Mantener estructura de variantes

### Fase 3: Reemplazar Servicios
1. `obtener-productos-catalogo.ts` → Query BD
2. `obtener-detalle-producto-catalogo.ts` → Query BD con relaciones
3. Mantener mismo contrato de retorno (RespuestaCatalogoProductos)

### Fase 4: Actualizar Componentes
1. Panel de compra: capturar TODOS los campos disponibles
2. Checkout: mapeo dinámico basado en tipos
3. Carrito: persistir campos adicionales en localStorage

### Fase 5: Validar Pedidos
1. Asegurar `atributosSnapshot` se envía como JSONB
2. Test end-to-end: agregar → carrito → checkout → pedido
3. Verificar BD: campos presentes en `item_pedido`

### Fase 6: Limpiar y Documentar
1. Eliminar `productos-catalogo-mock.ts`
2. Actualizar comentarios/docstrings
3. Documentar schema de `atributosSnapshot`

---

## 9. VALIDACIÓN FINAL

**Checklist de Aceptación:**

- [ ] Catálogo carga desde Supabase (sin mocks)
- [ ] Todos los campos reales aparecen en el frontend
- [ ] Carrito guarda snapshot completo de cada item
- [ ] Checkout mapea automáticamente todos los campos
- [ ] Pedido en BD tiene `atributosSnapshot` poblado
- [ ] Se pueden agregar 50+ productos sin problemas
- [ ] Admin puede filtrar por marca, nivel, estado
- [ ] Snapshot permite auditoría completa (id, nombre, precio, atributos)

---

## 10. PRÓXIMOS PASOS (Módulo 17)

Una vez completada esta corrección:

1. **Módulo 17A:** Sistema de administración de catálogo (CRUD productos)
2. **Módulo 17B:** Panel de control para marcas, niveles, categorías
3. **Módulo 17C:** Importación bulk de catálogo real
4. **Módulo 18:** Pagos, seguimiento, reportes

