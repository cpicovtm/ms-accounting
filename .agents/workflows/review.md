---
mode: architect
command: /review
---

# /review — Revisar antes de merge

## Pasos

1. Cargar spec + archivos modificados.
2. Diff completo.
3. Checklist de `rules/05-review-criteria.md`.
4. Análisis estático: `npm run lint && npm run check && npm test`.
5. Generar reporte clasificado: 🔴 Blocker, 🟡 Major, 🔵 Minor, 💬 Nit.

## Anti-patrones

- ❌ Aprobar el MR (solo humanos aprueban).
- ❌ Bloquear por preferencias sin respaldo en `rules/`.
