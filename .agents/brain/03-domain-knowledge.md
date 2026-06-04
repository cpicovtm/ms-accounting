---
layer: constitutional
priority: 3
mutable: true
---

# 03 — Conocimiento de Dominio: Plan de Cuentas Contable

## Glosario

| Término | Definición |
|---|---|
| **Plan de Cuentas** | Catálogo jerárquico de todas las cuentas contables de la organización. |
| **Cuenta Contable** | Nodo del plan de cuentas. Puede ser sumarizadora o de movimiento. |
| **Cuenta Sumarizadora** | Cuenta de grupo que NO recibe asientos. Agrupa cuentas hijas. (`isDetail = false`) |
| **Cuenta de Movimiento** | Cuenta imputable que SÍ recibe asientos contables. (`isDetail = true`) |
| **Código de Cuenta** | Código numérico segmentado que define la posición jerárquica (ej: `1` → `11` → `1101` → `110101`). |
| **Nivel** | Profundidad en el árbol (1 = raíz, 2 = segundo nivel, etc.). Auto-calculado. |
| **Naturaleza** | Clasificación contable: `DEBIT` (deudora) o `CREDIT` (acreedora). |
| **Tipo de Cuenta** | Clasificación: `ASSET`, `LIABILITY`, `EQUITY`, `INCOME`, `EXPENSE`, `CONTINGENT`. |
| **Asiento Contable** | Registro de un movimiento contable (débito/crédito) en una cuenta de movimiento. |
| **Inactivación Lógica** | Soft-delete: la cuenta se marca como `isActive = false` pero no se elimina físicamente. |

## Reglas de negocio clave

### Jerarquía de cuentas

- El plan de cuentas es un **árbol** modelado con auto-referencia (`parentId`).
- El **código del hijo** debe comenzar con el **código del padre**: padre `11` → hijos `1101`, `1102`. No `1201`.
- La **naturaleza** del hijo debe coincidir con la del padre (herencia de naturaleza).
- Una cuenta de **movimiento** (`isDetail = true`) no puede tener hijas.

### Convención de código segmentado

| Nivel | Dígitos | Ejemplo | Descripción |
|---|---|---|---|
| 1 | 1 | `1` | Activo |
| 2 | 2 | `11` | Activo Corriente |
| 3 | 4 | `1101` | Caja y Bancos |
| 4 | 6 | `110101` | Caja General |
| 5 | 8 | `11010101` | Caja Chica Oficina Central |

### Mantenimiento de cuentas

- **No borrar** cuenta con hijas (activas o no) → error 409.
- **No borrar** cuenta con movimientos contables → error 409.
- **No cambiar naturaleza** si la cuenta ya tiene movimientos → error 422.
- **No cambiar tipo de cuenta** si la cuenta ya tiene movimientos → error 422.
- **No cambiar** de movimiento a sumarizadora si tiene movimientos → error 422.
- **No convertir** sumarizadora a movimiento si tiene hijas → error 409.
- **No desactivar** cuenta con hijas activas → error 409.
- **Inactivación lógica** siempre (nunca DELETE físico).

### Auditoría

- Todo CREATE, UPDATE, DEACTIVATE, REACTIVATE genera registro en `account_audit_log`.
- Cada cambio registra: campo modificado, valor anterior, valor nuevo, quién y cuándo.
- Audit log es **append-only**: sin updates ni deletes.

## Tipos de cuenta y naturaleza por defecto

| Tipo | Naturaleza esperada |
|---|---|
| ASSET (Activo) | DEBIT (Deudora) |
| EXPENSE (Gasto) | DEBIT (Deudora) |
| LIABILITY (Pasivo) | CREDIT (Acreedora) |
| EQUITY (Patrimonio) | CREDIT (Acreedora) |
| INCOME (Ingreso) | CREDIT (Acreedora) |
| CONTINGENT (Orden) | DEBIT o CREDIT (según uso) |

## Estados

### Cuenta
`activa` → `inactiva` (reversible)

## Restricciones operativas

- **Moneda**: USD.
- **Locale**: `es-EC`.
- **Single-tenant**.
