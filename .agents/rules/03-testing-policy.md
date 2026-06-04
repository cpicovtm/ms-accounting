---
layer: operational
priority: 3
---

# 03 — Testing Policy

## Pirámide

```
        /\
       /E2E\         ← pocas (~10%), flujos críticos (Supertest)
      /─────\
     /  INT  \       ← moderadas (~30%), NestJS TestModule + repos reales
    /─────────\
   /   UNIT    \     ← muchas (~60%), rápidos, sin I/O
  /─────────────\
```

## Cobertura mínima

| Capa | Mínimo |
|---|---|
| Global | **80%** líneas + branches |
| `domain/` | **95%** (lógica de negocio pura) |
| `application/` | **85%** |
| `infrastructure/` | **70%** |

## Backend — Jest

Estructura:

```
src/modules/account/
├── domain/services/
│   └── account-validation.service.spec.ts     ← unit (junto al código)
├── application/commands/
│   └── create-account/
│       └── create-account.handler.spec.ts     ← unit con repos mockeados
└── test/
    └── account.e2e-spec.ts                    ← E2E con Supertest
```

Reglas:

- Tests **unitarios** de dominio: sin NestJS, sin repos reales.
- Tests de **handlers**: con NestJS TestModule, repos in-memory.
- Tests **E2E**: app completa, Supertest contra endpoints.
- Naming: `it('should <comportamiento> when <condición>')`.
- **AAA**: Arrange / Act / Assert.

## Critic Loop

Si un test falla **> 3 veces seguidas**:

1. **STOP**. No modificar el test para que pase.
2. Revisar diseño.
3. Escalar al arquitecto si el diseño es correcto.

## Reglas duras

- ❌ Sin `.skip` o `.only` en `main`.
- ❌ Sin tests "humo" sin assertions.
- ❌ Sin tests dependientes del orden de ejecución.
- ✅ Cada bug arreglado lleva un test que **falla antes** del fix.
