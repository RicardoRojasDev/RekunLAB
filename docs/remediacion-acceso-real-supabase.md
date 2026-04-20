# Remediacion de acceso real a Supabase

## Objetivo

Restaurar el acceso real a catalogo y pedidos desde este ecommerce cuando Supabase responde `42501 permission denied for schema public`.

## Contexto actual

- El frontend mantiene un respaldo local para no romper `/catalogo`.
- Ese respaldo no debe transformarse en fuente de verdad.
- El proyecto debe volver a leer desde Supabase antes de seguir con flujo comercial real y correos.

## Paso unico de remediacion remota

1. Abrir `Supabase Dashboard`.
2. Entrar a `SQL Editor`.
3. Crear una query nueva.
4. Copiar y pegar completo el archivo:

`supabase/migrations/20260419233000_auditoria_catalogo_y_pedidos.sql`

5. Ejecutarlo una sola vez.

## Que corrige esa migracion

- `grant usage on schema public to service_role`
- `grant select` para tablas de catalogo
- `grant insert, update, select` para tablas de pedidos
- `grant execute` para `public.crear_pedido_desde_checkout(jsonb)`

## Validacion desde el repo

Ejecutar:

```bash
npm run supabase:diagnostico
```

Resultado esperado:

- `estado_entidad` accesible
- `producto` accesible
- RPC `crear_pedido_desde_checkout` accesible
- sin `42501 permission denied for schema public`

## Validacion funcional en la app

1. Abrir `/catalogo`
2. Abrir un `/catalogo/[slug]`
3. Confirmar que ya no aparece el warning de respaldo local
4. Validar un flujo `carrito -> checkout -> pedido`
5. Recien despues verificar el envio de correos transaccionales con un pedido real
