---
mode: developer
command: /test
---

# /test — Validar + Critic Loop

## Pasos

1. **Correr suite**: `npm test`.
2. **Si todo pasa**: reportar coverage + listo.
3. **Si fallan tests**:
   - Clasificar: `código incorrecto`, `test mal escrito`, `spec ambigua`.
   - **Critic Loop**: max 3 intentos, luego escalar.

## Anti-patrones

- ❌ Modificar el test para que pase sin entender por qué fallaba.
- ❌ Loop infinito de intentos > 3 sin escalar.
