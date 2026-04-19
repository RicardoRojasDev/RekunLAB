# Modulo 4 - Sistema de diseno

## Objetivo

Definir una base visual premium, tecnologica y sustentable para el ecommerce de Rekun LAB, de manera que futuras pantallas comerciales compartan una identidad consistente sin depender de decisiones esteticas improvisadas.

## Idea rectora

La identidad visual no busca parecer "eco generica" ni "tech fria".

- Lo sustentable aparece en la materialidad cromatica y en la respiracion visual.
- Lo tecnologico aparece en la precision tipografica, los contrastes y la estructura.
- Lo premium aparece en la profundidad, los neutros limpios y el control del acento.

## Paleta principal

### Primario

Verdes minerales para marca y accion principal.

- `--color-primario-900`: `#0b322e`
- `--color-primario-700`: `#0d5448`
- `--color-primario-500`: `#0d7c66`
- `--color-primario-100`: `#d5f3ea`

Uso:

- acciones principales
- encabezados con peso de marca
- anillos de foco y detalles de confianza

### Secundario

Grafitos tecnicos para balance y sobriedad.

- `--color-secundario-900`: `#131b1f`
- `--color-secundario-700`: `#2d373d`
- `--color-secundario-500`: `#50606a`
- `--color-secundario-100`: `#e1e6e8`

Uso:

- tipografia estructural
- iconografia neutra
- fondos tecnicos y detalles de soporte

### Neutros

Piedras claras y oscuras para fondos, paneles y legibilidad.

- `--color-neutral-0`: `#ffffff`
- `--color-neutral-50`: `#f7faf8`
- `--color-neutral-100`: `#eef3ef`
- `--color-neutral-700`: `#4e5a56`
- `--color-neutral-900`: `#18211e`

Uso:

- canvas general
- superficies elevadas
- texto secundario y bloques de contraste

### Acentos

Metal calido y destello vivo para detalles de valor.

- `--color-acento-500`: `#b38631`
- `--color-acento-100`: `#f4edd3`
- `--color-acento-vivo`: `#c9f36a`

Uso:

- badges premium
- microdestellos de tecnologia limpia
- detalles que necesitan memoria visual sin competir con el primario

## Tipografia

- Titulares: `Space Grotesk`
- Cuerpo: `Manrope`

Jerarquias base:

- `.titulo-display`: heroes y mensajes de alto impacto
- `.titulo-seccion`: encabezados de bloque
- `.texto-destacado`: parrafos introductorios
- `.texto-soporte`: contenido explicativo y microcopy
- `.etiqueta-tecnica`: badges, labels y microestados

## Espaciado

Escala recomendada:

- `--espacio-2xs`: `0.5rem`
- `--espacio-xs`: `0.75rem`
- `--espacio-sm`: `1rem`
- `--espacio-md`: `1.5rem`
- `--espacio-lg`: `2rem`
- `--espacio-xl`: `3rem`

Regla:

- componentes compactos usan `2xs`, `xs` y `sm`
- cards y bloques base usan `md`
- cortes entre secciones usan `lg` y `xl`

## Bordes y radios

- `--radio-sm`: `1rem`
- `--radio-md`: `1.5rem`
- `--radio-lg`: `2rem`
- `--radio-pill`: `999px`

Regla:

- inputs, chips y microcomponentes: `sm`
- tarjetas y paneles: `md` o `lg`
- botones y etiquetas: `pill`

## Sombras

- `--sombra-suave`: microelevacion
- `--sombra-panel`: superficie principal
- `--sombra-elevada`: bloques protagonistas

Regla:

- la elevacion comunica jerarquia, no decoracion
- no combinar sombras fuertes con color intenso en exceso

## Estados interactivos

- `hover`: mayor contraste y elevacion leve
- `focus`: anillo obligatorio visible
- `active`: menos elevacion, mas densidad
- `disabled`: sin sombra, sin hover, sin ambiguedad

## Tokens y clases reutilizables

Base implementada en [src/app/globals.css](</C:/Users/Casa/Documents/GitHub/RekunLAB/src/app/globals.css>):

- tokens de color
- tokens de espaciado
- tokens de radio
- tokens de sombra
- clases semanticas como `.panel-diseno`, `.panel-diseno-elevado`, `.boton-base`, `.boton-primario`, `.boton-secundario`, `.boton-fantasma`

Base de boton implementada en [src/compartido/componentes/ui/boton.tsx](</C:/Users/Casa/Documents/GitHub/RekunLAB/src/compartido/componentes/ui/boton.tsx>).

## Lineamientos para componentes futuros

- todo componente debe sentirse claro, preciso y respirable
- usar una sola familia cromatica dominante por componente
- priorizar superficies claras y reservar fondos oscuros para contraste estrategico
- mantener coherencia de radios, sombras y alturas
- evitar adornos gratuitos, brillos innecesarios y gradientes sin funcion

## Criterio de calidad visual

Un componente nuevo entra al sistema solo si:

- se puede leer rapido en mobile
- mantiene contraste suficiente
- no rompe la escala de espacios y radios
- se reconoce como parte de la misma familia visual del sitio
