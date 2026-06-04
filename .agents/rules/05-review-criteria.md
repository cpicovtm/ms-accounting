---
layer: operational
priority: 5
---

# 05 — Review Criteria

Checklist obligatorio antes de aprobar un MR.

## 1. Diseño

- [ ] Cambios alineados con la **spec** referenciada (si aplica).
- [ ] SOLID respetado.
- [ ] Sin duplicación significativa.
- [ ] Lógica de negocio vive en `domain/` o `application/`, no en controllers.
- [ ] Dependencias respetan dirección Clean Architecture.

## 2. Código

- [ ] Métodos ≤ 30 líneas.
- [ ] Archivos ≤ 300 líneas.
- [ ] Complejidad ≤ 10, profundidad ≤ 3, parámetros ≤ 4.
- [ ] Sin `any` injustificado.
- [ ] Naming claro y consistente.
- [ ] Sin código comentado, sin `console.log`.

## 3. Tests

- [ ] Tests nuevos para el nuevo comportamiento.
- [ ] Test que **falla antes** del fix (para bugs).
- [ ] Cobertura ≥ 95% en `domain/` modificado.
- [ ] Sin `.skip` ni `.only`.

## 4. Seguridad

- [ ] Inputs validados con class-validator DTOs.
- [ ] Sin PII en logs.
- [ ] Sin secretos / URLs hardcodeadas.

## 5. Dominio contable

- [ ] Reglas de jerarquía respetadas (código hijo ⊂ padre).
- [ ] Naturaleza coherente padre → hijo.
- [ ] Campos protegidos validados contra movimientos.
- [ ] Auditoría registrada para toda operación de escritura.
- [ ] Inactivación lógica (nunca DELETE físico).

## 6. Performance

- [ ] Paginación en listados.
- [ ] Sin loops que llamen al repositorio individualmente.

## 7. Proceso

- [ ] Conventional commit en título.
- [ ] CI verde (lint, typecheck, tests, build).
