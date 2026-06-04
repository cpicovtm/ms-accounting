---
mode: developer
command: /hotfix
---

# /hotfix — Corrección urgente en producción

## Cuándo usar

**Solo** cuando hay impacto real: bug bloqueante, vulnerabilidad, pérdida de datos.

## Pasos

1. Confirmar severidad con humano **antes** de empezar.
2. Rama `hotfix/NNNN-<slug>` desde `main`.
3. Reproducir con test que falla.
4. Fix mínimo (sin refactor "de paso").
5. Validar: lint + tests.
6. MR a `main` + cherry-pick a `develop`.

## Anti-patrones

- ❌ Aprovechar el hotfix para "limpiar" código no relacionado.
- ❌ Saltar el test del bug.
- ❌ Mergear sin segundo par de ojos humano.
