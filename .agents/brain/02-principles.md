---
layer: constitutional
priority: 2
mutable: false
---

# 02 — Principios No Negociables

Estos principios son **vinculantes** y no se relativizan por urgencia.

## Diseño

### SOLID
- **S**ingle Responsibility — una clase, una razón para cambiar.
- **O**pen/Closed — extensible sin modificar.
- **L**iskov — los subtipos sustituyen al tipo base sin romper.
- **I**nterface Segregation — interfaces pequeñas y específicas.
- **D**ependency Inversion — depender de abstracciones, no de implementaciones.

### Clean Code
- Nombres revelan intención (`validateChildCode`, no `valCode`).
- Funciones hacen **una cosa**.
- Sin código comentado, sin código muerto.
- Sin números mágicos — extraer a constantes con nombre.
- **DRY**, pero sin abstracción prematura (regla del 3).
- **YAGNI** — no construir para necesidades hipotéticas.

## Métricas duras

| Métrica | Límite |
|---|---|
| Líneas por método | ≤ 30 |
| Líneas por archivo | ≤ 300 (warning) |
| Complejidad ciclomática | ≤ 10 |
| Profundidad de anidación | ≤ 3 |
| Parámetros por función | ≤ 4 |

Si un método no cabe en 30 líneas → **refactorizar**, no maquillar.

## Tipado

- TypeScript — evitar `any` siempre que sea posible.
- Validación de boundaries con **class-validator** (DTOs en los controllers).
- Enums tipados para valores fijos del dominio.

## Testing

- Cobertura mínima **80%** global, **95%** en `domain/`.
- Tests **antes** o **junto** al código (TDD preferido).
- **Critic Loop**: si un test falla > 3 veces, **stop** y revisar diseño.

## Errores

- Errores tipados (NestJS HttpException con clases específicas) > genéricos.
- Nunca tragar errores en silencio (`catch {}` vacío).
- Mensaje orientado al humano que lo va a leer (en español para errores de negocio).

## Documentación

- Docs viven junto al código.
- **Comentar solo el "por qué"**, nunca el "qué".
- Specs en `specs/NNNN-*/` para todo cambio no trivial.

## Seguridad

- Cero secretos en código/git. `.env.example` siempre actualizado.
- Cero PII en logs.
- Validación + sanitización en cada boundary externo.

## Anti-principios (cosas que **NO** hacemos)

- ❌ "Lo arreglo después" sin issue creado.
- ❌ Commits con `WIP` que entran a `main` / `develop`.
- ❌ Tests deshabilitados con `.skip` sin issue.
- ❌ `console.log` en código de producción.
- ❌ Optimización prematura.
- ❌ Abstracciones especulativas (interfaces de un solo implementador sin razón).
