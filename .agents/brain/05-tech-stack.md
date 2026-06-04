---
layer: constitutional
priority: 5
mutable: true
---

# 05 — Stack Técnico

## Runtime

| Componente | Versión | Notas |
|---|---|---|
| Node.js | **20+** | Backend y tooling. |
| npm | **10.x** | Package manager. |
| Bun | **1.2.x** | Instalación de deps en Docker. |

## Backend

| Tecnología | Versión | Propósito |
|---|---|---|
| TypeScript | ^5.1 | Lenguaje principal. |
| NestJS | ^11.x | Framework HTTP + DI + módulos. |
| Fastify | ^5.x | HTTP adapter (reemplaza Express). |
| @nestjs/cqrs | ^11.x | Patrón CQRS: CommandBus + QueryBus. |
| class-validator | ^0.14 | Validación de DTOs con decoradores. |
| class-transformer | ^0.5 | Transformación de entidades a ViewModels. |
| uuid | ^11.x | Generación de IDs. |
| axios | ^1.x | HTTP client (para comunicación inter-servicio). |
| reflect-metadata | ^0.2 | Decoradores TypeScript. |
| rxjs | ^7.8 | Observables (requerido por NestJS). |

## Build y Dev

| Tecnología | Versión | Propósito |
|---|---|---|
| SWC | ^1.x | Compilador rápido (reemplaza tsc). |
| Vite | ^7.x | Dev server con HMR. |
| vite-plugin-node | ^7.x | Integración Vite + NestJS. |

## Testing

| Tecnología | Versión | Propósito |
|---|---|---|
| Jest | ^29.x | Test runner. |
| ts-jest | ^29.x | Transformador TypeScript para Jest. |
| Supertest | ^6.x | Tests E2E HTTP. |
| @nestjs/testing | ^11.x | Utilidades de testing de NestJS. |

## Linting y formato

| Tecnología | Versión | Propósito |
|---|---|---|
| Biome | ^2.3 | Lint + format (reemplaza ESLint + Prettier). |
| commitlint | ^17.x | Conventional commits enforced. |
| Husky | ^9.x | Pre-commit hooks. |
| lint-staged | ^16.x | Lint solo en archivos staged. |

## Docker

- **Etapa 1**: Bun para instalar deps (rápido).
- **Etapa 2**: Node 20 para build con `nest build`.
- **Etapa 3**: `gcr.io/distroless/nodejs20-debian11` para prod (mínimo surface de ataque).

## Naming

| Elemento | Convención | Ejemplo |
|---|---|---|
| Archivos TS | `kebab-case` | `create-account.handler.ts` |
| Clases | `PascalCase` | `CreateAccountHandler` |
| Funciones / métodos | `camelCase` | `validateChildCode` |
| Constantes | `SCREAMING_SNAKE_CASE` | `ACCOUNT_REPOSITORY` |
| Enums | `PascalCase`, valores `SCREAMING_SNAKE_CASE` | `AccountType.ASSET` |
| DTOs | `PascalCase` + sufijo `Dto` | `CreateAccountDto` |
| ViewModels | `PascalCase` + sufijo `Vm` | `AccountVm` |
| Commands | `PascalCase` + sufijo `Command` | `CreateAccountCommand` |
| Queries | `PascalCase` + sufijo `Query` | `GetAccountsQuery` |
| Handlers | `PascalCase` + sufijo `Handler` | `CreateAccountHandler` |
