# Modulo 2 - Arquitectura y convenciones del proyecto

## Objetivo

Definir una arquitectura interna consistente para que el ecommerce crezca por dominios, con bajo acoplamiento y sin deuda tecnica temprana.

## Regla base del proyecto

En este proyecto usaremos `src/compartido/` como equivalente tecnico de una carpeta `shared/`.

- `compartido` contiene codigo transversal, agnostico de dominio y reutilizable.
- `modulos` contiene codigo de dominio y casos de uso especificos.
- `app` solo compone rutas, layouts, metadata y puntos de entrada del App Router.

## Estructura oficial

```text
src/
  app/
    (rutas, layouts, metadata, loading, error)
  compartido/
    componentes/
    configuracion/
    servicios/
    tipos/
    utilidades/
  modulos/
    <dominio>/
      componentes/
      hooks/
      repositorios/
      servicios/
      tipos/
      utilidades/
      validaciones/
      index.ts
```

## Convencion de carpetas

### `src/app`

Responsabilidad:

- Declarar rutas, `layout.tsx`, `page.tsx`, metadata y composicion de modulos.
- Resolver parametros de ruta y pasar datos a los modulos.

No debe:

- Contener logica de negocio compleja.
- Consultar Supabase directamente.
- Duplicar validaciones o transformaciones que pertenecen a un modulo.

### `src/compartido`

Responsabilidad:

- Albergar piezas reutilizables sin semantica de dominio.

Subcarpetas oficiales:

- `componentes/`: componentes visuales compartidos y contenedores base.
- `configuracion/`: lectura de entorno, configuracion del sitio y constantes tecnicas.
- `servicios/`: clientes o adaptadores de infraestructura.
- `tipos/`: contratos compartidos entre varios modulos.
- `utilidades/`: funciones puras y genericas.

### `src/modulos/<dominio>`

Cada modulo representa un dominio funcional del negocio, por ejemplo:

- `catalogo`
- `cotizaciones`
- `pedidos`
- `carrito`
- `admin-productos`

Subcarpetas recomendadas por modulo:

- `componentes/`: UI especifica del dominio.
- `hooks/`: hooks del dominio.
- `repositorios/`: acceso a datos del dominio.
- `servicios/`: casos de uso y orquestacion.
- `tipos/`: contratos del dominio.
- `utilidades/`: helpers del dominio.
- `validaciones/`: validacion de entradas y salidas del dominio.
- `index.ts`: superficie publica del modulo.

Crear solo las carpetas que el modulo necesite. No agregar carpetas vacias por anticipacion.

## Convenciones de naming

### Regla general

- Archivos y carpetas: `kebab-case` en espanol.
- Variables y funciones: `camelCase` en espanol.
- Componentes y tipos: `PascalCase` en espanol.
- Constantes globales de solo lectura: `SCREAMING_SNAKE_CASE` solo si representan un valor inmutable de bajo nivel. En la mayoria de los casos preferir `camelCase`.

### Variables

Formato:

- `precioConIva`
- `pedidoActual`
- `estadoFormulario`

Evitar:

- `data`
- `item`
- `temp`
- abreviaturas opacas como `prd`, `usr`, `cfg`

### Funciones

Formato:

- Deben comenzar con verbo y expresar intencion.
- Usar `camelCase`.

Ejemplos:

- `obtenerPedidoPorId`
- `calcularTotalConIva`
- `mapearProductoParaTarjeta`
- `validarDatosCotizacion`

### Componentes

Formato:

- `PascalCase`.
- Nombre de archivo en `kebab-case`.
- Nombre semantico, no tecnico.

Ejemplos:

- Archivo: `formulario-cotizacion.tsx`
- Componente: `FormularioCotizacion`

### Hooks

Regla especial:

- Deben mantener el prefijo tecnico obligatorio `use` por compatibilidad con React.
- El resto del nombre va en espanol y en `PascalCase`.

Ejemplos:

- `useCarrito`
- `useEstadoCotizacion`
- `useFiltrosCatalogo`

Archivo recomendado:

- `use-carrito.ts`
- `use-estado-cotizacion.ts`

### Utilidades

Formato:

- Nombre corto, generico y sin semantica de negocio.
- Deben ser funciones puras.

Ejemplos:

- `unirClases`
- `formatearPrecioClp`
- `normalizarTexto`

### Servicios

Formato:

- Nombrar por caso de uso o infraestructura real.
- Evitar archivos genericos como `helpers.ts` o `service.ts`.

Ejemplos:

- `registrar-pedido.ts`
- `obtener-productos-publicos.ts`
- `cliente-publico.ts`

### Tipos

Formato:

- `PascalCase`, singular cuando represente una entidad.
- Sufijos solo cuando agregan claridad real.

Ejemplos:

- `Pedido`
- `ProductoCatalogo`
- `DatosFormularioCotizacion`
- `RespuestaPaginada<T>`

## Separacion de responsabilidades

### Componentes

- Renderizan UI.
- Reciben datos ya preparados.
- No consultan Supabase ni contienen reglas de acceso a datos.

### Hooks

- Manejan estado derivado, interaccion del usuario y coordinacion de UI.
- No deben esconder consultas directas a infraestructura si eso dificulta trazabilidad.

### Repositorios

- Ejecutan acceso a datos.
- Conocen Supabase, SQL o proveedor externo.
- No renderizan ni formatean para interfaz.

### Servicios

- Orquestan casos de uso.
- Combinan validaciones, repositorios y mapeos.
- Devuelven datos listos para consumo de UI o rutas.

### Utilidades

- Son funciones puras.
- No dependen de React, `window`, `cookies` ni clientes externos.

## Politica de imports

### Regla de alias

- Usar `@/` para cualquier import fuera de la carpeta local.
- Reservar imports relativos para archivos del mismo contexto inmediato.

Ejemplo recomendado:

```ts
import { ContenedorPrincipal } from "@/compartido/componentes/base/contenedor-principal";
import { obtenerPedidoPorId } from "@/modulos/pedidos";
import { mapearResumenPedido } from "../utilidades/mapear-resumen-pedido";
```

### Orden recomendado

1. Librerias externas
2. Imports desde `@/compartido`
3. Imports desde `@/modulos`
4. Imports relativos locales

### Regla de acoplamiento

- Un modulo puede importar desde `compartido`.
- Un modulo puede importar desde su propia carpeta interna.
- Un modulo no debe importar archivos internos de otro modulo.
- Si un modulo necesita algo de otro, debe consumir solo su `index.ts`.

Ejemplo correcto:

```ts
import { obtenerResumenPedido } from "@/modulos/pedidos";
```

Ejemplo incorrecto:

```ts
import { obtenerResumenPedido } from "@/modulos/pedidos/servicios/obtener-resumen-pedido";
```

## Organizacion de modulos por dominio

Cada modulo se disena por lenguaje de negocio, no por tipo tecnico.

Correcto:

- `modulos/catalogo`
- `modulos/cotizaciones`
- `modulos/pedidos`

Incorrecto:

- `modulos/formularios`
- `modulos/tablas`
- `modulos/componentes-producto`

Ejemplo recomendado:

```text
src/modulos/cotizaciones/
  componentes/
    formulario-cotizacion.tsx
    tarjeta-respuesta-cotizacion.tsx
  repositorios/
    guardar-cotizacion.ts
  servicios/
    registrar-cotizacion.ts
  tipos/
    cotizacion.ts
  validaciones/
    cotizacion.ts
  index.ts
```

## Convencion para codigo compartido

Algo pertenece a `compartido` solo si cumple estas condiciones:

- No contiene lenguaje de negocio exclusivo de un dominio.
- Puede ser reutilizado por dos o mas modulos reales.
- Su mantenimiento no depende de decisiones especificas de catalogo, carrito o pedidos.

Algo debe quedarse dentro del modulo si:

- Tiene reglas o nombres propios del dominio.
- Su reutilizacion aun es hipotetica.
- Moverlo a `compartido` lo vuelve ambiguo o demasiado generico.

Regla para evitar deuda tecnica:

- Primero mantener local en el modulo.
- Promover a `compartido` solo despues de una segunda reutilizacion real o cuando sea claramente transversal desde el inicio.

Ejemplos:

- `formatearPrecioClp` -> `compartido/utilidades`
- `mapearProductoParaTarjeta` -> `modulos/catalogo/utilidades`
- `FormularioCotizacion` -> `modulos/cotizaciones/componentes`
- `ContenedorPrincipal` -> `compartido/componentes`

## Reglas para estilos reutilizables

- `src/app/globals.css` se usa solo para tokens globales, reset minimo y estilos base.
- Los estilos de un componente deben vivir junto al componente via clases de Tailwind.
- Si un patron visual se repite en varios modulos y no tiene semantica de dominio, se extrae a `compartido/componentes`.
- Si un patron visual solo existe en un dominio, se mantiene dentro del modulo.
- No crear componentes "wrapper" demasiado genericos solo para esconder clases si aun no existe reutilizacion real.
- No mezclar decisiones visuales de un dominio dentro de componentes compartidos.

Regla practica:

- Primera repeticion: copiar con criterio.
- Segunda repeticion similar: evaluar extraccion.
- Tercera repeticion estable: extraer.

## Reglas para acceso a datos

- La creacion de clientes de infraestructura vive en `compartido/servicios`.
- El acceso directo a Supabase solo puede vivir dentro de repositorios o adaptadores de infraestructura.
- `page.tsx`, `layout.tsx` y componentes no deben importar `@supabase/supabase-js`.
- Los servicios del modulo coordinan validacion, repositorio y transformacion.
- Nunca devolver respuestas crudas del proveedor a la UI si requieren adaptacion.

Flujo recomendado:

```text
Ruta o server action
  -> servicio del modulo
  -> validacion
  -> repositorio
  -> mapeo de salida
  -> componente
```

Ejemplo recomendado:

```ts
// src/modulos/pedidos/servicios/obtener-resumen-pedido.ts
import { buscarPedidoPorId } from "../repositorios/buscar-pedido-por-id";
import { validarIdPedido } from "../validaciones/pedido";

export async function obtenerResumenPedido(idPedido: string) {
  const idValido = validarIdPedido(idPedido);
  const pedido = await buscarPedidoPorId(idValido);

  return {
    id: pedido.id,
    total: pedido.total,
    estado: pedido.estado,
  };
}
```

## Reglas para validaciones

- Toda entrada externa debe validarse en el borde de entrada.
- Las validaciones del dominio van en `modulos/<dominio>/validaciones`.
- Las validaciones genericas y transversales pueden vivir en `compartido` solo si realmente son compartidas.
- No repetir validaciones iguales en componentes, hooks y servicios.
- Validar una vez y propagar datos ya normalizados.

Entradas que siempre se validan:

- formularios
- `searchParams`
- `params`
- variables de entorno
- payloads externos
- respuestas de terceros si no controlamos su contrato

Nota:

- La libreria concreta de validacion aun no esta definida en el proyecto. Esta convencion aplica sin forzar una herramienta todavia.

## Recomendaciones para evitar deuda tecnica temprana

- Mantener cada modulo pequeno y autocontenido.
- No crear carpetas genericas como `helpers`, `misc`, `common` o `services` sin criterio.
- Evitar barrels globales gigantes. Usar `index.ts` solo como API publica del modulo.
- No mover codigo a `compartido` por intuicion; moverlo por reutilizacion real.
- No mezclar transformaciones de datos con renderizado.
- No esconder acceso a datos dentro de componentes o hooks de UI.
- Nombrar por lenguaje de negocio, no por implementacion tecnica.
