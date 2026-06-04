---
layer: operational
priority: 4
---

# 04 — Security Policy

## Validación de inputs

- **Todo input externo** pasa por DTOs con `class-validator`.
- Validación en el **boundary** (controller via `ValidationPipe`), no en domain.
- `whitelist: true` + `forbidNonWhitelisted: true` en ValidationPipe global.

## Secretos

- Cero secretos en código / git. `.env.example` con placeholders.
- `.env` siempre gitignored.

## Logging

- **PII redactada** siempre.
- Sin `console.log` en producción — usar NestJS Logger.

## Errores hacia el cliente

- Cliente recibe **error genérico** con statusCode.
- Stack traces solo en logs internos (via AllExceptionsFilter).
- Respuesta estandarizada: `{ data, message, statusCode, isError }`.

## Dependencias

- Sin paquetes con > 12 meses sin commits (revisar manualmente).
- Cada nueva dependencia debe justificarse.
