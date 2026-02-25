# Mubyizi RBAC Roles Reference

Three independent role dimensions stack on top of each other. A user always has
one **SystemRole** (platform-wide), zero or more **OrgRole** memberships (one per
org), and zero or more **WorkplaceRole** assignments (one per workplace they are
assigned to).

---

## 1. SystemRole — Platform-Wide

Defined in `_constants/role-weights.constants.ts`. Stored on the `Users` record.

| Role       | Weight | Description                          |
|------------|--------|--------------------------------------|
| SUPERADMIN | 1000   | Platform operator. No restrictions.  |
| SUPPORT    | 500    | Support staff. No current bypasses.  |
| USER       | 0      | Default for every registered account |

### SUPERADMIN (weight 1000)

The only role that bypasses org and workplace guards. Both `requireOrgRole` and
`requireWorkplaceRole` call `return next()` immediately when the caller is
`SUPERADMIN`, without ever touching the database.

**Can:**
- `GET /users` — list all users platform-wide (no `orgId` required)
- `POST /users` — create a domain `Users` record directly (not a better-auth account)
- `GET /users/:id` — view any user's full profile including `lastLoginAt`
- `PATCH /users/:id` — update any user including changing their `systemRole`
- `DELETE /users/:id` — hard-delete any user (except own account)
- `POST /users/bulk-import` — import users from CSV/XLSX
- `GET /users/export` — export all users (no `orgId` required)
- Every org-scoped attendance endpoint (bypasses `requireOrgRole`)
- Every workplace-scoped endpoint (bypasses `requireWorkplaceRole`)
- `GET /orgs` — see every organization on the platform
- `GET /orgs/:id/members` — see all members of any org

**Cannot:**
- Delete their own account (`DELETE /users/:id` where `id === currentUser.id` → 400)
- Change their own `systemRole` (the delete-self guard fires first)

---

### SUPPORT (weight 500)

No explicit bypasses in the middleware or any route handler. Behaves identically
to `USER` for all permission checks. Reserved for future use.

---

### USER (weight 0)

Default role every account receives on registration.

**Can:**
- Everything any authenticated user can do (self-service, org operations based on org membership, etc.)
- `GET /orgs` — lists only the orgs they are a member of
- `POST /orgs` — create a new org (caller becomes `OWNER` automatically)
- Self-service clock-in / clock-out / attendance status (subject to workplace assignment)
- `GET /users/:id` — own profile only
- `PATCH /users/:id` — own profile only (cannot touch `systemRole`)
- Manage own skills, documents, emergency contacts

**Cannot:**
- View another user's profile, timeline, skills, documents, or emergency contacts
- Create/delete user records directly
- Access any org-scoped resource without an active membership
- Change their own or anyone else's `systemRole`

---

## 2. OrgRole — Per-Organization

Stored in `OrgMembership.role`. Checked by `requireOrgRole(minRole)` middleware.

| Role    | Weight | Typical holder                       |
|---------|--------|--------------------------------------|
| OWNER   | 100    | Org creator; transferred on handoff  |
| ADMIN   | 80     | Trusted administrator                |
| MANAGER | 60     | Shift / site manager                 |
| MEMBER  | 40     | Regular employee / worker            |
| VIEWER  | 20     | Read-only observer                   |

The comparison in `requireOrgRole` uses `OrgRole[role] >= OrgRole[minRole]` —
higher weight ≥ required weight passes. SUPERADMIN always short-circuits before
this check.

The member-listing endpoint (`GET /orgs/:orgId/members`) additionally filters
the result set: a caller only sees members whose role weight is ≤ their own
(`hasMoreOrgPrivileges` helper).

---

### OWNER (weight 100)

Inherits everything ADMIN can do (weight ≥ 80).

**Exclusive capabilities:** None in the current codebase (OWNER is the same as
ADMIN from a middleware perspective). Organisationally the OWNER is the account
that created the org.

---

### ADMIN (weight 80)

**Can (everything MANAGER can + below):**
- `POST /orgs/:orgId/workplaces` — create new workplaces
- `PATCH /orgs/:orgId/workplaces/:workplaceId` — update workplace details
- `DELETE /orgs/:orgId/workplaces/:workplaceId` — delete workplaces
- `DELETE /orgs/:orgId/attendance/:id` — hard-delete attendance records (ADMIN+
  only; MANAGER can only update/approve/reject)
- `GET /users` with `orgId` — list users in their org
- `GET /users/export` with `orgId` — export user list

**Cannot:**
- Access the platform as a whole (no cross-org visibility)
- Bypass `requireWorkplaceRole` checks (still needs a workplace assignment for
  those endpoints)

---

### MANAGER (weight 60)

The primary operational role. Most day-to-day workforce management sits here.

**Can:**
- `GET /orgs/:orgId/attendance` — paginated list with full filter set
  (workplaceId, userId, status, approvalStatus, dateFrom, dateTo, isPaid)
- `GET /orgs/:orgId/attendance/pending-approval` — queue of PENDING records
- `POST /orgs/:orgId/attendance` — mark/upsert a single attendance record
  (auto-sets `approvalStatus: APPROVED` on create)
- `POST /orgs/:orgId/attendance/bulk` — bulk upsert up to 200 records in a
  single transaction
- `GET /orgs/:orgId/attendance/export` — download CSV or XLSX file
- `PATCH /orgs/:orgId/attendance/:id` — update an existing attendance record
- `POST /orgs/:orgId/attendance/:id/approve` — approve a pending record;
  sets `approvedBy` + `approvedAt`, clears rejection fields
- `POST /orgs/:orgId/attendance/:id/reject` — reject a pending record with
  `rejectionReason`; sets `rejectedBy` + `rejectedAt`, clears approval fields
- `GET /users` with `orgId` — list users in the org
- `GET /users/export` with `orgId` — export user list
- `GET /users/:id/attendance` — view attendance history of a user in shared org
- `GET /users/:id/earnings` — view earnings of a user in shared org
- `GET /users/:id/payments` — view payments of a user in shared org
- `GET /users/:id/workplaces` — view workplace assignments of a user in shared org
- `POST /orgs/:orgId/workplaces/:workplaceId/attendance/sheet` — bulk sheet entry
  (requires SUPERVISOR workplace role as well — see §3)

**Cannot:**
- `DELETE /orgs/:orgId/attendance/:id` — attendance hard-delete is ADMIN+ only
- Create/update/delete workplaces (ADMIN+ only)
- View a user's timeline, skills, documents, or emergency contacts (self /
  SUPERADMIN only)
- Create user records directly

---

### MEMBER (weight 40)

Lowest role with read access to the org.

**Can:**
- `GET /orgs/:orgId` — view org details
- `GET /orgs/:orgId/members` — view members whose role ≤ MEMBER (i.e., MEMBER
  and VIEWER)
- `GET /orgs/:orgId/workplaces` — list workplaces in the org

**Cannot:**
- Any attendance management endpoint
- Any write operation on org resources
- Access user data beyond their own profile

---

### VIEWER (weight 20)

Read-only observer. No explicit routes use `requireOrgRole(OrgRole.VIEWER)` as a
minimum (all readable routes require at least MEMBER). In practice a VIEWER
cannot access any of the MEMBER-gated endpoints because weight 20 < 40.

**Can:** (none of the current endpoints — VIEWER weight is below every
`requireOrgRole` threshold in use)

**Effectively:** A VIEWER is an org member in name only until routes are added
that require `OrgRole.VIEWER` as the minimum.

---

## 3. WorkplaceRole — Per-Workplace

Stored in `UsersOnWorkplaces.workplaceRole`. Checked by
`requireWorkplaceRole(minRole)` and, for QR generation, manually in the handler.

| Role               | Weight | Description                         |
|--------------------|--------|-------------------------------------|
| WORKPLACE_MANAGER  | 40     | Full control of the workplace        |
| SUPERVISOR         | 30     | Can manage workers and clock-in/out  |
| WORKER             | 20     | Regular worker                       |
| VISITOR            | 10     | Temporary / guest presence           |

The comparison uses `WORKPLACE_ROLE_WEIGHT[role] >= WORKPLACE_ROLE_WEIGHT[minRole]`.
SUPERADMIN bypasses this check entirely.

A `usersOnWorkplaces` record must also have `isActive: true` for self-service
clock-in to succeed (the middleware only checks weight, not `isActive` — but the
clock-in handler does).

---

### WORKPLACE_MANAGER (weight 40)

Inherits everything SUPERVISOR can do.

**Exclusive to WORKPLACE_MANAGER (over SUPERVISOR):** No current endpoints
specifically require `WORKPLACE_MANAGER` minimum — the highest workplace guard
in the codebase is `SUPERVISOR`. WORKPLACE_MANAGER is the top of the hierarchy
and intended for the person ultimately responsible for the site.

---

### SUPERVISOR (weight 30)

**Can:**
- `GET /orgs/:orgId/workplaces/:workplaceId/workers` — list workers at this
  workplace (sees only workers with role ≤ their own)
- `POST /orgs/:orgId/workplaces/:workplaceId/workers` — create new user accounts
  and assign them to this workplace in a single transaction
- `PATCH /orgs/:orgId/workplaces/:workplaceId/workers` — assign existing platform
  users to this workplace
- `POST /attendance/qr/generate` — generate a QR code for this workplace
  (checked in handler via `WORKPLACE_ROLE_WEIGHT` comparison, not middleware)
- `POST /orgs/:orgId/workplaces/:workplaceId/attendance/sheet` — submit a bulk
  attendance sheet (also requires `OrgRole.MANAGER` on the org side)

**Cannot:**
- Delete or update the workplace itself (org-level ADMIN required)
- Approve/reject attendance records (org-level MANAGER required)

---

### WORKER (weight 20)

**Can:**
- `POST /attendance/clock-in` — clock in at an assigned workplace (with optional
  GPS coordinates and a selfie photo uploaded to Cloudinary)
- `POST /attendance/clock-out` — clock out; auto-calculates `hoursWorked` and
  `amountEarned = (hoursWorked / 8) * dailyRate`
- `GET /attendance/status` — see own attendance records for today across all
  workplaces
- `POST /attendance/qr/scan` — scan a QR code to record clock-in (same as
  manual clock-in but triggered by the QR token)

**Cannot:**
- Access the workers list at the workplace
- Generate QR codes
- Submit attendance sheets
- See attendance records of other workers

---

### VISITOR (weight 10)

Lowest workplace role.

**Can:**
- `POST /attendance/clock-in` / `clock-out` / `GET /attendance/status` — same
  as WORKER (the self-service endpoints only check `isActive`, not role weight)
- `POST /attendance/qr/scan` — scan a QR code

**Cannot:**
- `GET /orgs/:orgId/workplaces/:workplaceId/workers` — weight 10 < 30 (SUPERVISOR)
- `POST /attendance/qr/generate` — weight 10 < 30 (SUPERVISOR)
- Any management endpoint

---

## 4. Combined / Stacked Checks

Some endpoints require **both** an org role and a workplace role simultaneously.
Both checks must pass; SUPERADMIN bypasses both.

| Endpoint                                                            | Org minimum | Workplace minimum |
|---------------------------------------------------------------------|-------------|-------------------|
| `POST /orgs/:orgId/workplaces/:workplaceId/attendance/sheet`        | MANAGER     | SUPERVISOR        |

---

## 5. Self-or-Admin Pattern

Several user sub-resource endpoints use a handler-level check instead of
middleware because the permission depends on **who** the target user is:

```
isSelf = currentUser.id === targetUserId
isSuperAdmin = currentUser.systemRole === SystemRole.SUPERADMIN
```

If neither is true, a shared-org MANAGER+ check is tried for attendance, earnings,
payments, and workplaces endpoints. Timeline, skills, documents, and emergency
contacts are strictly self-or-SUPERADMIN only.

| Sub-resource                                    | Self | MANAGER in shared org | SUPERADMIN |
|-------------------------------------------------|------|-----------------------|------------|
| `GET /:id/attendance`                           | ✓    | ✓                     | ✓          |
| `GET /:id/earnings`                             | ✓    | ✓                     | ✓          |
| `GET /:id/payments`                             | ✓    | ✓                     | ✓          |
| `GET /:id/workplaces`                           | ✓    | ✓                     | ✓          |
| `GET /:id/timeline`                             | ✓    | ✗                     | ✓          |
| `GET/POST/PATCH/DELETE /:id/skills`             | ✓    | ✗                     | ✓          |
| `GET/POST/DELETE /:id/documents`                | ✓    | ✗                     | ✓          |
| `GET/POST/PATCH/DELETE /:id/emergency-contacts` | ✓    | ✗                     | ✓          |

---

## 6. Quick Decision Flowchart

```
Request arrives
  │
  ├─ requireAuth() → 401 if no session
  │
  ├─ SUPERADMIN? ──YES──→ skip all org/workplace checks → proceed
  │
  ├─ requireOrgRole(minRole)?
  │     │
  │     ├─ Not an org member → 403
  │     └─ Weight < required → 403
  │
  ├─ requireWorkplaceRole(minRole)?
  │     │
  │     ├─ Not assigned to workplace → 403
  │     └─ Weight < required → 403
  │
  └─ Handler-level checks (self-or-admin, shared-org MANAGER, etc.)
```

---

## 7. Key Source Files

| File | Purpose |
|------|---------|
| `src/_constants/role-weights.constants.ts` | Numeric weights for all three role sets |
| `src/middlewares/roles.middleware.ts` | `requireOrgRole` and `requireWorkplaceRole` factories |
| `src/helpers/orgs.helper.ts` | `hasMoreOrgPrivileges` (member listing filter) |
| `src/helpers/workplace.helper.ts` | `hasMoreWorkplacePrivileges` (worker listing filter) |
| `src/routes/orgs.route.ts` | Org CRUD + member listing |
| `src/routes/workplace.route.ts` | Workplace CRUD + worker management |
| `src/routes/attendance.route.ts` | Org-scoped attendance management |
| `src/routes/self-attendance.route.ts` | Worker clock-in / clock-out / status |
| `src/routes/qr-attendance.route.ts` | QR code generate + scan |
| `src/routes/workplace-attendance.route.ts` | Supervisor bulk sheet |
| `src/routes/users.route.ts` | User CRUD + all sub-resources |
