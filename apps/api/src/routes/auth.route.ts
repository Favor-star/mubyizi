import { Hono } from "hono";
import { type HonoInstanceContext } from "../_types/index.js";
import withPrisma from "../lib/prisma-client.js";
import { customValidator } from "../helpers/validation.helpers.js";
import { loginSchema, signUpSchema } from "../schemas/auth.schema.js";
import { apiSuccessResponse, handleAPiError, apiErrorResponse } from "../helpers/api.helper.js";
import { auth } from "../lib/auth.js";
import { describeRoute } from "hono-openapi";
import { loginDocs, signUpDocs } from "../docs/auth.docs.js";

const authRoutes = new Hono<HonoInstanceContext>()
  .use(withPrisma)
  .post("/sign-up", describeRoute(signUpDocs), customValidator("json", signUpSchema), async (c) => {
    const prisma = c.get("prisma");
    try {
      const data = c.req.valid("json");
      const { email, password, rememberMe, name, ...rest } = data;
      const existingUser = await prisma.users.findFirst({
        where: { email }
      });
      if (existingUser) {
        return c.json(
          apiErrorResponse("CONFLICT", "User with this email already exists.Please user another email"),
          409
        );
      }
      const result = await auth.api.signUpEmail({
        body: {
          email,
          password,
          name,
          rememberMe
        }
      });

      const user = await prisma.users.create({
        data: {
          id: result.user.id,
          email: result.user.email,
          name: result.user.name,
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
