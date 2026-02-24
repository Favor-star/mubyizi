# Architectural Patterns

## 1. Hono Context as Dependency Container

The `HonoInstanceContext` type (`_types/index.ts`) defines typed variables on the Hono context:

```
Variables: { prisma: PrismaClient, user: User | null, session: Session | null }
```

- `prisma` is injected per-request via `withPrisma` middleware (`lib/prisma-client.ts`)
- `user` and `session` are extracted from better-auth's `getSession()` in `main.ts` before routing
- All handlers access these via `c.get("prisma")`, `c.get("user")`, `c.get("session")` — no module-level singletons passed as arguments

## 2. Middleware-Based Auth Guard Pattern

Authorization is enforced through two chainable middleware factories placed inline in route definitions:

- `requireAuth()` — returns 401 if `c.get("user")` is null (`middleware/auth.middleware.ts`)
- `requireOrgRole(minRole)` — checks `OrgMembership` for the `orgId` param; SUPERADMIN bypasses (`middleware/roles.middleware.ts`)
- `requireWorkplaceRole(minRole)` — checks `UsersOnWorkplaces` for the `workplaceId` param; SUPERADMIN bypasses

Pattern in route files:
```ts
.get("/", requireAuth(), requireOrgRole("MEMBER"), async (c) => { ... })
.post("/", requireAuth(), requireOrgRole("ADMIN"), async (c) => { ... })
```

The middleware reads `orgId`/`workplaceId` from `c.req.param()` automatically.

## 3. Zod Schema as Single Source of Truth

Zod schemas in `schemas/` serve three purposes simultaneously:
1. **Runtime validation** — used with `customValidator()` helper in routes
2. **TypeScript types** — derived with `z.infer<>`, no separate interface definitions
3. **OpenAPI spec** — passed to `hono-openapi`'s `describeRoute()` for documentation

Schemas are composable: `createXSchema` omits auto-generated fields from `xSchema`; `updateXSchema` makes all fields optional. See `schemas/workplace.schema.ts:1-60` and `schemas/user.schema.ts`.

## 4. Validation Helper Centralizes Error Formatting

`customValidator(target, schema)` in `helpers/validation.helpers.ts` wraps Hono's validator:
- Parses with Zod and maps errors to `{ path, message }` array
- Always returns HTTP 400 with `apiErrorResponse()` on failure
- Used as inline middleware: `.post("/", customValidator("json", createOrgSchema), handler)`

## 5. Standardized API Response Envelope

All responses use `apiSuccessResponse(data, message)` or `apiErrorResponse(error, message)` from `helpers/api.helper.ts`. Shape:

```ts
{ data: T | null, error: unknown | null, message: string, success: boolean }
```

`handleAPiError()` converts Prisma errors (P2025 → 404, P2002 → 409, P2003 → 400) and `APIError` to typed `HTTPException` before re-throwing. Routes always wrap their catch blocks with this helper.

## 6. OpenAPI Docs Co-Located by Domain

Each route domain has a matching docs file in `docs/`:
- `docs/auth.docs.ts`, `docs/orgs.docs.ts`, `docs/workplaces.docs.ts`, `docs/users.docs.ts`

Doc descriptors are created with helpers from `helpers/docs.helper.ts`:
- `docsJsonContent(schema)` — wraps a Zod schema in the standard response envelope for OpenAPI
- `paginatedDocsJsonContent(schema)` — adds `items[]` + pagination metadata
- `docsErrorResponse(status, description)` — standard error response shape

These are imported directly into route files and passed to `describeRoute({ responses: { 200: ..., 400: ... } })`.

## 7. Pagination as a Reusable Layer

`helpers/pagination.helper.ts` provides three functions used across all list endpoints:
- `getPagination(query)` → `{ take, skip }` for Prisma
- `buildPaginationMeta(page, limit, total)` → `{ page, limit, totalItems, totalPages, hasNext, hasPrev }`
- `whereSearchQueryBuilder(query, fields)` → Prisma `OR` clause for case-insensitive search

The query shape is validated uniformly via `paginationQuerySchema` (`schemas/pagination.schema.ts`).

## 8. Role-Weight Comparison Pattern

All privilege comparisons use numeric weights from `_constants/role-weights.constants.ts` rather than enums or string comparison:

```ts
ORG_ROLE_WEIGHT = { OWNER: 100, ADMIN: 80, MANAGER: 60, MEMBER: 40, VIEWER: 20 }
```

`hasMoreOrgPrivileges(currentRole, otherRole)` returns `boolean` by comparing weights. This enables "can act on user with lower role" checks in member listing and worker management without a switch statement.

## 9. Prisma Schema Split by Domain

The main `prisma/schema.prisma` contains only better-auth models. Domain models live in `prisma/models/`:
- `users.prisma`, `organization.prisma`, `workplace.prisma`
- `wage.prisma`, `budget.prisma`, `payment.prisma`, `attendance.prisma`

All IDs use ULID (string, not auto-increment). Timestamps follow `createdAt`/`updatedAt` convention with `@default(now())` and `@updatedAt`.

## 10. Monorepo Task Pipeline (Turborepo)

`turbo.json` defines task dependencies:
- `build` depends on `^build` (dependencies built first); outputs `.next/**`
- `lint` and `check-types` depend on `^lint`/`^check-types` (upstream packages linted first)
- `dev` is persistent with caching disabled

Shared packages: `packages/typescript-config` (base tsconfig), `packages/eslint-config`, `packages/ui` (shadcn components exported as `@workspace/ui`).
