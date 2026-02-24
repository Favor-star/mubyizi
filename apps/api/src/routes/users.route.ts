import { Hono } from "hono";
import { type HonoInstanceContext } from "../_types/index.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { customValidator } from "../helpers/validation.helpers.js";
import { organizationParamsSchema } from "../schemas/orgs.schema.js";
import { requireOrgRole } from "../middlewares/roles.middleware.js";
import { OrgRole } from "../lib/generated/prisma/enums.js";

const usersRoutes = new Hono<HonoInstanceContext>().get(
  "/",
  requireAuth(),
  customValidator("query", organizationParamsSchema),
  requireOrgRole(OrgRole.MANAGER),
  async (c) => {
    // This is just a placeholder route. You can implement user-related endpoints here.
  }
);
export default usersRoutes;
