---
layer: operational
priority: 1
---

# 01 — Coding Standards

## Naming

| Elemento | Convención | Ejemplo |
|---|---|---|
| Archivos TS | `kebab-case` | `create-account.handler.ts` |
| Clases | `PascalCase` | `CreateAccountHandler` |
| Funciones / métodos | `camelCase` (verbo + sustantivo) | `validateChildCode` |
| Constantes | `SCREAMING_SNAKE_CASE` | `ACCOUNT_REPOSITORY` |
| Enums | `PascalCase` singular, valores `SCREAMING_SNAKE_CASE` | `AccountType.ASSET` |

## Tamaño y complejidad

- **Métodos**: ≤ 30 líneas.
- **Archivos**: ≤ 300 líneas (warning).
- **Complejidad ciclomática**: ≤ 10.
- **Profundidad de anidación**: ≤ 3.
- **Parámetros**: ≤ 4. Más → objeto de parámetros.

## Estructura de funciones

```ts
// ✅ BIEN — pequeña, una responsabilidad, return temprano
static validateChildCode(parentCode: string, childCode: string): void {
  if (!childCode.startsWith(parentCode)) {
    throw new BadRequestException(`Código hijo inválido`);
  }
}

// ❌ MAL — múltiples responsabilidades, anidación profunda
function processAccount(account: Account) {
  if (account.parentId) {
    if (account.isDetail) {
      // valida + calcula + persiste + audita...
    }
  }
}
```

## TypeScript

- Evitar `any`. Usar `unknown` + narrowing cuando sea necesario.
- `readonly` por defecto en propiedades de entidades.
- Discriminated unions sobre flags booleanas donde aplique.

## Imports

Orden (separados por línea en blanco):

1. Externos (`@nestjs/common`, `uuid`, ...).
2. Internos del proyecto (`../../shared/...`).
3. Relativos del mismo módulo (`./...`).

## Formato

- Indentación: **2 espacios**.
- Comillas: **simples** (`'`) excepto JSON.
- **Punto y coma**: sí.
- **Trailing comma**: sí (multiline).

Todo gestionado por Biome. **No discutir formato en code review**.

## Comentarios

Por defecto: **no comentar**. El código debe ser autodescriptivo.

Comentar **solo** cuando:
- Hay una decisión no obvia (link a ADR o spec).
- Hay un workaround por un bug externo.
- Hay un invariante crítico contable que un lector futuro podría romper.

Prohibido:
- ❌ Comentarios que describen **qué** hace el código.
- ❌ TODOs sin issue asociado.
- ❌ Bloques de código comentados.

## Patrón CQRS específico

- **Controllers**: THIN. Solo reciben HTTP, crean Command/Query, despachan al bus.
- **Handlers**: contienen la lógica de negocio. Validan, persisten, auditan.
- **DTOs**: class-validator para validación automática en el boundary.
- **ViewModels**: class-transformer `@Expose/@Exclude` para controlar el output.
- **Commands**: objetos de valor inmutables con los datos de la operación.
- **Queries**: objetos de valor con los parámetros de consulta.
