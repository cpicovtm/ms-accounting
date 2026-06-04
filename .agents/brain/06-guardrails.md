---
layer: constitutional
priority: 6
mutable: false
---

# 06 — Guardrails (Lo que NUNCA hago)

Estas restricciones son **absolutas**. Ante la duda, paro y pregunto al humano.

## Git

- ❌ **Commit directo a `main`** o `develop`. Siempre rama + MR.
- ❌ `git push --force` a ramas compartidas.
- ❌ `git reset --hard` sin confirmación explícita del humano.
- ❌ `--no-verify` para saltar hooks.
- ❌ Borrar ramas remotas sin confirmar.

## Base de datos

- ❌ `DROP`, `TRUNCATE` o `DELETE` masivo sin transaction + confirmación.
- ❌ Migraciones que pierdan datos sin script de backfill.
- ❌ Modificar migraciones ya aplicadas en remoto.
- ❌ Hardcodear el nombre del schema en queries.

## Código

- ❌ Usar `any` para esquivar el tipado sin justificación.
- ❌ Comentar tests con `.skip` o `.only` sin issue asociado.
- ❌ Suprimir errores con `try { ... } catch {}` vacíos.
- ❌ Métodos > 30 líneas (refactor obligatorio).
- ❌ Hardcodear secretos, URLs de producción, IDs mágicos.
- ❌ Dejar `console.log` o `debugger` en commits.

## Dominio contable

- ❌ DELETE físico de cuentas — siempre inactivación lógica.
- ❌ Permitir cambio de naturaleza en cuenta con movimientos.
- ❌ Permitir borrado de cuenta con hijas.
- ❌ Permitir hijas bajo cuenta de movimiento.
- ❌ Código de hijo que no empiece con código del padre.
- ❌ Saltar la auditoría en operaciones de escritura.

## Seguridad

- ❌ Logs con PII: cédula, email completo, teléfono.
- ❌ Inputs sin validación en el boundary (DTOs con class-validator).
- ❌ Errores internos (stack traces) expuestos al cliente.

## Operaciones destructivas

- ❌ `rm -rf` sobre rutas dinámicas o variables sin literal.
- ❌ Sobrescribir `.agents/brain/**`.
- ❌ Instalar dependencias sin revisar licencia y mantenimiento.

## Proceso

- ❌ Cerrar una tarea sin tests verdes.
- ❌ Implementar sin spec si el cambio toca > 3 archivos o introduce nueva entidad/endpoint.

## Comunicación

- ❌ Afirmar que algo funciona sin haberlo verificado.
- ❌ Esconder errores o trade-offs al humano.
- ❌ Asumir intención del humano sin confirmar en cambios irreversibles.

## Escalamiento

Cuando dude, **paro y pregunto** al humano. Es mejor un mensaje
"¿confirmas X?" que una operación destructiva difícil de revertir.

> Costo de pausar: bajo · Costo de error irreversible: muy alto.
