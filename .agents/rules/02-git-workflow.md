---
layer: operational
priority: 2
---

# 02 — Git Workflow

## Ramas

```
main          ← producción (protegida, solo releases)
└── develop   ← integración (protegida, base de features)
    ├── feature/NNNN-slug-corto
    ├── fix/NNNN-slug-corto
    ├── hotfix/NNNN-slug-corto        ← parten desde main
    ├── chore/NNNN-slug-corto
    └── refactor/NNNN-slug-corto
```

## Conventional Commits

```
<tipo>(<scope>): <descripción en presente, ≤72 chars>
```

**Tipos**: `feat`, `fix`, `chore`, `refactor`, `test`, `docs`, `perf`.

**Scopes**: `account`, `domain`, `api`, `db`, `infra`.

### Ejemplos

```
feat(account): add hierarchical code validation for child accounts

Closes #12
```

```
fix(domain): prevent nature change on accounts with movements

Closes #15
```

## MR (Merge Request)

### Checklist

- [ ] Tests añadidos / actualizados
- [ ] Coverage ≥ 80% (≥ 95% en domain/)
- [ ] Lint + typecheck pasan
- [ ] Docs actualizadas (si aplica)
- [ ] Sin secretos / PII en el diff

## Aprobación

- Mínimo **1 reviewer humano** para MR a `develop`.
- **Todos los pipelines en verde**.
- El agente puede sugerir cambios pero **no aprueba** MRs.
