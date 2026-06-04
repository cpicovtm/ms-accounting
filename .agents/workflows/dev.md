---
mode: developer
command: /dev
---

# /dev — Implementar desde Spec

## Propósito

Ejecutar la implementación de una spec aprobada, task por task.

## Pre-flight checks

- [ ] `spec.md`, `plan.md`, `tasks.md`, `acceptance.md` existen y están aprobados.
- [ ] `develop` actualizado localmente.

## Pasos

1. **Cargar** spec completa.
2. **Pedir nombre de la rama al humano** (NO crearla automáticamente).
3. **Por cada task**:
   1. Escribir test que falla (red).
   2. Implementar código mínimo que hace pasar el test (green).
   3. Refactorizar manteniendo tests verdes.
   4. Commit con conventional commit.
4. **Validar acceptance**.
5. **Auto-revisión** con checklist de `rules/05-review-criteria.md`.
6. Reportar rama lista para que el **arquitecto** abra el MR manualmente.

## Anti-patrones

- ❌ Implementar varios tasks sin commits intermedios.
- ❌ Saltar TDD por "ya está claro".
- ❌ Subir sin correr test suite completo localmente.
- ❌ Refactorizar código fuera del scope de la spec.
