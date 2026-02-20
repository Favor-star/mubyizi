import { Hono } from "hono";
import { describeRoute } from "hono-openapi";
import { type HonoInstanceContext } from "../_types/index.js";
import withPrisma from "../lib/prisma-client.js";
import { apiErrorResponse, apiSuccessResponse, handleAPiError } from "../helpers/api.helper.js";
import { customValidator } from "../helpers/validation.helpers.js";
import { createOrgSchema } from "../schemas/orgs.schema.js";
import { createOrgDocs } from "../docs/orgs.docs.js";
import { OrgRole } from "../lib/generated/prisma/enums.js";
import { requireOrgRole } from "../middlewares/roles.middleware.js";

const usersRoutes = new Hono<HonoInstanceContext>()
  .use(withPrisma)
  .get("/", requireOrgRole(OrgRole.MANAGER), (c) => {
    try {
      const prisma = c.get("prisma");
      const orgs = prisma.org.findMany();
      return c.json(apiSuccessResponse(orgs, "Organizations retrieved successfully"), 200);
    } catch (error) {
      return handleAPiError(error, "Get orgs error");
    }
  })
  .post("/", describeRoute(createOrgDocs), customValidator("json", createOrgSchema), async (c) => {
    try {
      const user = c.get("user");
      if (!user) {
        return c.json(apiErrorResponse("Unauthorized", "You must be logged in to create an organization."), 401);
      }
      const data = c.req.valid("json");
      const prisma = c.get("prisma");
      const org = await prisma.org.create({
        data: {
          ...data,
          members: {
            create: {
              role: OrgRole.OWNER,
              userId: user.id
            }
          }
        }
      });
      return c.json(apiSuccessResponse(org, "Organization created successfully"), 201);
    } catch (error) {
      return handleAPiError(error, "Unexpected error occurred while creating organization");
    }
  });

export default usersRoutes;
