import { Hono } from "hono";
import { type HonoInstanceContext } from "../_types/index.js";
import withPrisma from "../lib/prisma-client.js";
import { customValidator } from "../helpers/validation.helpers.js";
import { loginSchema, signUpSchema } from "../schemas/auth.schema.js";
import { apiSuccessResponse, handleAPiError, apiErrorResponse } from "../helpers/api.helper.js";
import { auth } from "../lib/auth.js";
import { describeRoute } from "hono-openapi";
import { loginDocs, signUpDocs } from "../docs/auth.docs.js";
import { AccountStatus, InviteStatus } from "../lib/generated/prisma/enums.js";

const authRoutes = new Hono<HonoInstanceContext>()
  .use(withPrisma)
  .post("/sign-up", describeRoute(signUpDocs), customValidator("json", signUpSchema), async (c) => {
    const prisma = c.get("prisma");
    try {
      const data = c.req.valid("json");
      // Exclude server-controlled fields from the spread to avoid conflicts
      const {
        email,
        password,
        rememberMe,
        name,
        claimToken,
        accountStatus: _as,
        authUserId: _au,
        systemRole: _sr,
        ...rest
      } = data;

      // ── Determine if this sign-up should claim a provisional account ──────────
      let provisionalUserId: string | null = null;

      if (claimToken) {
        // Case 1: Explicit token claim (used when the provisional user has no email
        //         or when the manager sent an invite-to-claim with a token link).
        const invite = await prisma.orgInvite.findUnique({ where: { token: claimToken } });
        if (!invite?.provisionalUserId) {
          return c.json(apiErrorResponse("BAD_REQUEST", "Invalid claim token"), 400);
        }
        if (invite.status !== InviteStatus.PENDING) {
          return c.json(apiErrorResponse("BAD_REQUEST", `Invite has already been ${invite.status.toLowerCase()}`), 400);
        }
        if (invite.expiresAt < new Date()) {
          await prisma.orgInvite.update({ where: { token: claimToken }, data: { status: InviteStatus.EXPIRED } });
          return c.json(apiErrorResponse("BAD_REQUEST", "Invite has expired"), 400);
        }
        if (invite.email && invite.email !== email) {
          return c.json(apiErrorResponse("FORBIDDEN", "This invite was not issued to this email address"), 403);
        }
        const provisional = await prisma.users.findUnique({
          where: { id: invite.provisionalUserId },
          select: { id: true, accountStatus: true }
        });
        if (provisional?.accountStatus !== AccountStatus.PROVISIONAL) {
          return c.json(apiErrorResponse("BAD_REQUEST", "Claim target is not a provisional account"), 400);
        }
        provisionalUserId = provisional.id;
      } else {
        // Case 2: Auto-claim — if a PROVISIONAL Users record has this email, claim it.
        const match = await prisma.users.findFirst({
          where: { email, accountStatus: AccountStatus.PROVISIONAL },
          select: { id: true }
        });
        if (match) provisionalUserId = match.id;
      }

      // ── Block if an ACTIVE user with this email already exists ────────────────
      if (!provisionalUserId) {
        const existingUser = await prisma.users.findFirst({
          where: { email, accountStatus: AccountStatus.ACTIVE }
        });
        if (existingUser) {
          return c.json(
            apiErrorResponse("CONFLICT", "User with this email already exists. Please use another email"),
            409
          );
        }
      }

      // ── Create better-auth account ────────────────────────────────────────────
      const result = await auth.api.signUpEmail({
        body: { email, password, name, rememberMe }
      });

      if (provisionalUserId) {
        // Case 1 & 2: Link the provisional record to the new auth account.
        // Users.id (provisional ULID) stays the same — only authUserId is set.
        const user = await prisma.users.update({
          where: { id: provisionalUserId },
          data: { authUserId: result.user.id, accountStatus: AccountStatus.ACTIVE }
        });
        if (claimToken) {
          await prisma.orgInvite.update({ where: { token: claimToken }, data: { status: "ACCEPTED" } });
        }
        return c.json(apiSuccessResponse(user, "Account claimed successfully. You can now log in."), 201);
      }

      // Case 3: Normal sign-up — create a fresh Users record using the auth id.
      const user = await prisma.users.create({
        data: {
          id: result.user.id,
          email: result.user.email,
          name: result.user.name,
          accountStatus: AccountStatus.ACTIVE,
          ...rest
        }
      });
      return c.json(apiSuccessResponse(user, "User signed up. Proceed to login."), 201);
    } catch (error) {
      return handleAPiError(error, "Unexpected error occurred while signing up user");
    }
  })
  .post("/login", describeRoute(loginDocs), customValidator("json", loginSchema), async (c) => {
    const url = new URL(c.req.url);

    // rewrite to the real better-auth endpoint
    url.pathname = "/api/auth/sign-in/email";

    const req = new Request(url.toString(), {
      method: "POST",
      headers: c.req.raw.headers,
      body: JSON.stringify(await c.req.json())
    });

    return auth.handler(req);
  });
export default authRoutes;
