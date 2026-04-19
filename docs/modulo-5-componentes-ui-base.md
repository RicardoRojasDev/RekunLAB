# Modulo 5 - Componentes UI base

## Objetivo

Construir una biblioteca inicial de componentes reutilizables para acelerar el desarrollo del ecommerce sin duplicar estilos, logica de presentacion ni patrones de composicion.

## Estructura recomendada

```text
src/compartido/componentes/ui/
  area-texto.tsx
  boton.tsx
  campo-texto.tsx
  cargador.tsx
  contenedor.tsx
  estado-vacio.tsx
  etiqueta.tsx
  index.ts
  mensaje-error.tsx
  modal-base.tsx
  selector.tsx
  tarjeta.tsx
  internos/
    campo-formulario-base.tsx
    use-campo-control.ts
```

## Componentes incluidos

- `Boton`: accion base con variantes, tamanos, estados de carga e iconos simples.
- `CampoTexto`: input reutilizable con label, ayuda, error y semantica accesible.
- `AreaTexto`: textarea alineada con el mismo sistema visual del campo simple.
- `Selector`: select con placeholder, opciones declarativas y chevron integrado.
- `Etiqueta`: badge reutilizable para contexto, estados y categorias.
- `Tarjeta`: superficie editorial con encabezado, acciones, cuerpo y pie opcional.
- `Contenedor`: wrapper visual generico para superficies base, elevadas u oscuras.
- `Cargador`: indicador de espera reutilizable.
- `EstadoVacio`: bloque listo para listas, tablas o consultas sin resultados.
- `MensajeError`: estado visual para errores de carga o acciones fallidas.
- `ModalBase`: overlay reutilizable para confirmaciones o contenido contextual.

## Criterios de props

### Regla general

- Las props usan nombres en espanol.
- `claseName` se mantiene como excepcion tecnica porque ya es convencion del ecosistema React.
- Los componentes aceptan composicion via `children`, `acciones`, `pie`, `inicio`, `fin` o `icono` cuando aporta claridad.

### Formularios

Todos los componentes de formulario comparten:

- `etiqueta`
- `ayuda`
- `error`
- `obligatorio`
- `contenidoComplementarioEtiqueta`
- `claseName`
- `claseNameContenedor`

Esto evita reimplementar labels, mensajes y estados en cada modulo.

### Superficies

`Contenedor` y `Tarjeta` usan variantes coherentes:

- `base`
- `elevado`
- `oscuro`

La idea es no repetir combinaciones manuales de borde, fondo y sombra en cada pantalla.

## Buenas practicas de composicion

- Usa `Contenedor` cuando necesitas una superficie flexible sin estructura editorial fija.
- Usa `Tarjeta` cuando necesitas encabezado, descripcion, acciones o pie.
- Usa `CampoTexto`, `AreaTexto` y `Selector` en lugar de inputs crudos cuando el contexto sea formulario.
- Usa `Etiqueta` para microestados y no para simular botones.
- Usa `MensajeError` y `EstadoVacio` para estados de interfaz antes de crear variantes ad hoc.
- Usa `ModalBase` solo para contenido contextual; no para reemplazar navegacion principal.

## Consistencia con el sistema de diseno

Los componentes UI heredan directamente:

- tokens globales desde `src/app/globals.css`
- espaciados y radios del sistema
- sombras definidas en el modulo de sistema de diseno
- paleta primaria, secundaria, neutra y de acento
- estados `hover`, `focus`, `active` y `disabled`

## Limite de este modulo

Esta biblioteca no incluye logica de catalogo, carrito, pedidos, autenticacion ni administracion. Solo entrega primitives y componentes base de interfaz para acelerar los modulos funcionales futuros.
