# RESUMEN EJECUTIVO - Corrección Estructural Pre-Módulo 17

## El Problema en 30 Segundos

```
┌─────────────────┐
│   SUPABASE      │  ✅ Esquema completo, 15+ tablas
│   (Módulo 14)   │  ✅ Relaciones: marca, nivel, estado
└────────┬────────┘
         │
         X  DESCONEXIÓN CRÍTICA
         │
┌────────▼────────┐
│  FRONTEND       │  🔴 Usa array hardcodeado con 6 productos ficticios
│  (Módulo 16)    │  🔴 Solo 8 campos de 25+ disponibles
└─────────────────┘  🔴 Snapshot incompleto al pedido
```

---

## Impacto por Componente

### 🔴 CATÁLOGO (Crítico)
- **Hoy:** 6 productos mock, hardcodeados en TypeScript
- **Requiere:** Conectar a tabla `producto` en Supabase
- **Datos Perdidos:** marca, nivel, nombreCompleto, estado, categoría (relación)

### 🟠 CARRITO (Mayor)
- **Hoy:** Captura 8 campos de entrada
- **Requiere:** Capturar 18+ campos (nuevo: idProducto, marca, nivel, atributosSnapshot)
- **Riesgo:** Snapshot incompleto en BD

### 🟠 CHECKOUT (Mayor)
- **Hoy:** Mapeo manual incompleto de 8 campos
- **Requiere:** Mapeo automático de 18+ campos
- **Riesgo:** atributosSnapshot vacío en BD

### 🟠 PEDIDO (Mayor)
- **Hoy:** Guarda snapshot mínimo (5 campos)
- **Requiere:** Guardar snapshot completo (18+ campos en jsonb)
- **Riesgo:** Imposible auditoría/inteligencia de datos

---

## Campos Faltantes (Críticos)

```
ItemCarrito & ItemCrearPedido ACTUAL
├─ productoId ❌
├─ nombreCompleto ❌
├─ marca ❌
├─ nivel ❌
├─ formato ❌
├─ pesoKg ❌
├─ acabado ❌
├─ efecto ❌
├─ colorHex ❌
├─ compatiblePLA ❌
├─ esDestacado ❌
├─ estado ❌
├─ atributosSnapshot ❌
└─ ... (otros específicos por tipo)
```

---

## Línea de Tiempo

| Fase | Tiempo | Componentes | Riesgo |
|------|--------|-------------|--------|
| **1. Tipos** | 30 min | 3 archivos tipos | ✅ BAJO |
| **2. BD** | 60 min | 1 servicio nuevo | ✅ BAJO |
| **3. Componentes** | 40 min | 2 componentes | ✅ BAJO |
| **4. Validación** | 20 min | Tests E2E | ✅ BAJO |
| **5. Cleanup** | 10 min | Eliminar mock | ✅ BAJO |
| **TOTAL** | **160 min** | **~2.5 horas** | **BAJO** |

---

## Archivos Específicos

### 🔴 CREAR (Nuevo)
- `src/modulos/catalogo/servicios/mapear-productos-bd.ts` (función auxiliar)

### 🟠 MODIFICAR (17 cambios pequeños)
```
src/modulos/catalogo/tipos/producto-catalogo.ts          (+15 líneas)
src/modulos/carrito/tipos/carrito.ts                     (+8 líneas)
src/modulos/pedidos/tipos/crear-pedido.ts                (+8 líneas)
src/modulos/catalogo/servicios/obtener-productos-*.ts    (+50 líneas)
src/modulos/catalogo/.../panel-compra-producto-*.tsx     (+6 líneas)
src/modulos/checkout/.../pagina-checkout-visual.tsx      (+6 líneas)
```

### 🟢 ELIMINAR (1 archivo)
```
src/modulos/catalogo/datos/productos-catalogo-mock.ts    (-670 líneas)
```

---

## Decisiones de Arquitectura

### ✅ SE MANTIENE
- Estructura relacional flexible (relaciones FK)
- JSONB para metadatos/atributos extensibles
- Tipos `Readonly` e inmutables
- Patrón de mapeo BD → Frontend

### ✅ SE AGREGA
- Nuevo tipo `ProductoAtributosSnapshot` para flexible
- Función `mapearProductosBD()` para traducir BD → TS
- Campos `nombreCompleto`, `marca`, `nivel`, `atributosSnapshot`

### ❌ SE ELIMINA
- Array hardcodeado de mocks
- Filas SQL como comentarios educativos

---

## Garantías de Calidad

✅ **No se rompe nada:**
- Mismos tipos de retorno (RespuestaCatalogoProductos)
- Misma firma de funciones públicas
- Componentes UI sin cambios visuales
- LocalStorage compatible (objeto con más campos)

✅ **Se gana:**
- Datos reales desde BD
- Snapshot completo en auditoría
- Escalable a 1000+ productos
- Admin puede gestionar catálogo

---

## Dependencias

### BD Requerida
- ✅ Tablas: `producto`, `variante_producto`, `marca_producto`, etc.
- ✅ Estado: Migración Módulo 14 aplicada
- ⚠️ Datos: Mínimo 1 producto real en BD (o fallback a mocks)

### Liberías Requeridas
- ✅ Existentes: `@supabase/supabase-js`, `typescript`, `react`
- ❌ Nuevas: Ninguna

---

## Plan B (Fallback)

Si BD falla:

```typescript
// obtener-productos-catalogo.ts
try {
  const productos = await obtenerProductosDesdeBD();
  return productos;
} catch (error) {
  console.warn("BD no disponible, usando fallback mock");
  return productosCatalogoMock;  // Temporal, durante dev
}
```

---

## Validación Final

```bash
# 1. Compila sin errores
npm run tsc --noEmit

# 2. BD responde
SELECT COUNT(*) FROM producto;  # > 0

# 3. App inicia
npm run dev

# 4. Carrito guarda
→ localStorage → ItemCarrito con 18+ campos ✅

# 5. Pedido se crea
POST /api/pedidos → item_pedido.atributos_snapshot es jsonb ✅

# 6. Sin mocks
grep -r "productosCatalogoMock" src/  # 0 resultados ✅
```

---

## Próximas Fases (Módulo 17+)

1. **17A - Admin CRUD:** Crear/editar productos desde panel
2. **17B - Importación:** Bulk upload de catálogo real (CSV/JSON)
3. **17C - Inteligencia:** Reportes de ventas basados en atributos_snapshot
4. **18 - Pagos:** Integración con pasarelas

---

## Documentación Generada

Revisar:
1. **DIAGNOSTICO-ESTRUCTURAL-MODULO-17.md** (Problemas + Contexto)
2. **PLAN-CORRECCION-ESTRUCTURAL.md** (Implementación + Código)

