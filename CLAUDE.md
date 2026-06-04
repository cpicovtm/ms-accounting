## Proyecto

**ms-accounting** — Microservicio de Plan de Cuentas contable, parte del ecosistema
del broker de seguros ASUR.

- **Moneda**: USD
- **Locale**: `es-EC` (formato `dd/MM/yyyy`)
- **Modelo**: single-tenant
- **Organización**: polyrepo — este repo es el microservicio `ms-accounting`.

## Este repo: `ms-accounting`

Microservicio backend para la **administración del Plan de Cuentas contable**:
mantenimiento de la jerarquía de cuentas (árbol auto-referenciado), reglas de
validación contable, y auditoría de cambios.

---

## Arquitectura de gobernanza (SODA CLAUDE)

El agente carga **siempre y en este orden** antes de cualquier tarea:

1. **Capa Constitucional** → [.agents/brain/](.agents/brain/) (6 archivos)
2. **Capa Operativa** → [.agents/rules/](.agents/rules/) (5 archivos)
3. **Workflow específico** → [.agents/workflows/<comando>.md](.agents/workflows/)

Estas tres capas son **vinculantes**. En caso de conflicto, prevalece
`brain/` sobre `rules/` sobre `workflows/`.

---

## Modos operativos

### Modo Arquitecto — Claude Opus

| Comando | Propósito |
|---|---|
| `/spec <desc>` | Diseñar features y bugs (output: `specs/NNNN-*/`) |
| `/review` | Revisar antes de merge |

### Modo Desarrollador — Claude Sonnet

| Comando | Propósito |
|---|---|
| `/dev` | Implementar desde una Spec |
| `/test` | Validar + Critic Loop |
| `/hotfix` | Correcciones urgentes en producción |

---

## Stack técnico

- **Backend**: NestJS 11 + Fastify + CQRS + SWC (TypeScript strict).
- **Validación**: `class-validator` + `class-transformer` (DTOs).
- **Persistencia**: In-memory (dev) → BD real con repositorios inyectados vía Symbol.
- **Build**: Bun (deps) + SWC (build) + Vite (dev) + Distroless (prod).
- **Tests**: Jest.
- **Linter**: Biome.

Detalle completo en [.agents/brain/05-tech-stack.md](.agents/brain/05-tech-stack.md).

---

## Principios no negociables

- **SOLID** + **Clean Code**
- Métodos ≤ **30 líneas**
- Archivos ≤ **300 líneas** (warning)
- Complejidad ciclomática ≤ 10, profundidad ≤ 3, parámetros ≤ 4
- Cobertura de tests ≥ **80%** (≥ 95% en `domain/`)
- TypeScript sin `any` innecesarios
- Sin commits a `main` directamente, sin `--no-verify`

Detalle en [.agents/brain/02-principles.md](.agents/brain/02-principles.md).

---

## Comandos rápidos

```bash
npm install               # instalar dependencias
npm run start:vite        # dev con Vite (port 3020)
npm run start:dev         # dev con nest --watch
npm run build             # build de producción
npm test                  # tests
npm run lint              # Biome lint
npm run check             # Biome check
```

---

## Estructura del módulo

```
ms-accounting/
├── .agents/                 → Gobernanza SODA CLAUDE
├── src/
│   ├── main.ts              → Bootstrap Fastify, prefix ms-accounting
│   ├── app.module.ts        → Root module
│   ├── shared/              → Config, helpers, interceptors, filters
│   └── modules/account/
│       ├── account.module.ts
│       ├── domain/          → Entidades, enums, repos (interfaces), validación
│       ├── application/     → CQRS: commands + queries + handlers + DTOs
│       └── infrastructure/  → Controllers, persistencia (repositorios concretos)
├── specs/                   → Specs de features (output de /spec)
├── Dockerfile
├── vite.config.ts
└── package.json
```

---

## Antes de cada tarea, el agente debe

1. Leer la **spec** correspondiente en `specs/` (si existe).
2. Confirmar que la propuesta no viola principios en `brain/`.
3. Generar/actualizar **tests** antes o junto con el código.
4. Validar contra el checklist de `rules/05-review-criteria.md`.

---

## Lo que el agente nunca hace

Resumen — listado completo en [.agents/brain/06-guardrails.md](.agents/brain/06-guardrails.md):

- No commits directos a `main` / `develop`
- No PII en logs ni en respuestas
- No `any` para esquivar el tipado
- No `--no-verify`, no `git push --force` en ramas compartidas
- No `rm -rf`, no operaciones destructivas sin confirmación
