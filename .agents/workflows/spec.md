---
mode: architect
command: /spec
---

# /spec — Diseñar feature o bug

## Propósito

Convertir una idea / requerimiento / bug en una **spec accionable** que
guiará al modo Desarrollador (`/dev`).

## Cuándo usar

- Antes de cualquier feature que toque > 3 archivos o nueva entidad/endpoint.
- Antes de cualquier bug no trivial.

## Pasos

1. **Clarificar**: hacer preguntas hasta tener requerimientos sin ambigüedad.
2. **Numerar**: tomar el siguiente número correlativo en `specs/`.
3. **Crear estructura**: `specs/NNNN-<slug>/`
4. **Redactar 4 documentos**:
   - `spec.md` — **QUÉ** y **POR QUÉ** (sin cómo).
   - `plan.md` — **CÓMO** técnico (architecture, contratos).
   - `tasks.md` — **TODOs atómicos** ordenados (≤ 1 día c/u).
   - `acceptance.md` — **Criterios verificables**.
5. **Validar** contra `brain/` y `rules/`.
6. **Esperar aprobación** del humano antes de pasar a `/dev`.

## Criterios de salida

- [ ] Sin TODOs ni `<TBD>` en `spec.md`.
- [ ] Tasks granulares (≤ 1 día cada uno) en `tasks.md`.
- [ ] Criterios de aceptación **verificables**.
- [ ] **Aprobación explícita del humano**.

## Anti-patrones

- ❌ Saltar la clarificación e ir directo al plan técnico.
- ❌ Tasks vagos ("implementar feature X").
- ❌ Pasar a `/dev` sin aprobación humana de la spec.
