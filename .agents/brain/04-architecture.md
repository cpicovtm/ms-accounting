---
layer: constitutional
priority: 4
mutable: true
---

# 04 — Arquitectura

## Visión

Microservicio **standalone** con arquitectura **Clean Architecture + CQRS**
basado en el patrón de `ms-template`.

- NestJS 11 + Fastify como framework HTTP.
- CQRS con `@nestjs/cqrs`: Commands (escritura) y Queries (lectura) separados.
- Inyección de dependencias con **Symbol tokens** para repositorios.
- Repositorios intercambiables (in-memory para dev, BD real para prod).

## Estructura interna

```
ms-accounting/src/
├── main.ts                           # Bootstrap Fastify, global pipes/filters
├── app.module.ts                     # Root module
├── shared/                           # Config, helpers, interceptors
│   ├── config/                       # Env validation, app config
│   ├── constants/                    # Messages, error constants
│   ├── helpers/                      # Pagination, exception filter, response interceptor
│   └── domain/ports/                 # HttpPort abstraction
└── modules/account/
    ├── account.module.ts             # NestJS module con CQRS
    ├── domain/                       # PURO — sin deps de framework
    │   ├── entities/                 # Account, AccountAuditLog
    │   ├── enums/                    # AccountType, AccountNature
    │   ├── repositories/             # Interfaces (Symbol tokens)
    │   └── services/                 # AccountValidationService (reglas puras)
    ├── application/                  # Casos de uso
    │   ├── commands/                 # Create, Update, ToggleStatus
    │   └── queries/                  # GetAccounts, GetTree, GetById
    └── infrastructure/               # Adaptadores concretos
        ├── controllers/              # AccountController (thin, dispatches to buses)
        └── persistence/repositories/ # InMemory → futuro: Prisma/TypeORM
```

## Reglas de dependencia (vinculantes)

```
infrastructure ──► application ──► domain
     │                                ▲
     └────► controllers ──────────────┘
```

- `domain` **no importa nada** de NestJS, class-validator ni persistencia.
- `application` solo conoce `domain` y abstracciones (interfaces de repos).
- `infrastructure` implementa los repos definidos en `domain/repositories/`.
- `controllers` son **thin**: reciben HTTP, despachan a CommandBus/QueryBus.

## Endpoints REST

| Método | Ruta | Handler |
|---|---|---|
| `GET` | `/account` | GetAccountsHandler (paginado + filtros) |
| `GET` | `/account/tree` | GetAccountTreeHandler (árbol jerárquico) |
| `GET` | `/account/:id` | GetAccountByIdHandler |
| `POST` | `/account` | CreateAccountHandler |
| `PUT` | `/account/:id` | UpdateAccountHandler |
| `PATCH` | `/account/:id/status` | ToggleAccountStatusHandler |

## Respuesta estandarizada

```json
{
  "data": { ... },
  "message": "Proceso exitoso",
  "statusCode": 200,
  "isError": false
}
```

Errores:
```json
{
  "data": "Mensaje descriptivo del error",
  "message": "Error de validación",
  "statusCode": 400,
  "isError": true
}
```

## Patrón CQRS

- **Commands** (escritura): cada handler recibe un Command object, ejecuta validaciones
  de negocio contra el repositorio, persiste y genera audit log.
- **Queries** (lectura): cada handler recibe un Query, consulta el repositorio y retorna
  un ViewModel (`*.vm.ts`) formateado con `class-transformer`.

## Persistencia

- **Fase actual**: InMemoryAccountRepository (dev/testing).
- **Futuro**: implementación con BD real (Prisma o TypeORM), swap transparente
  gracias a la inyección vía Symbol.
