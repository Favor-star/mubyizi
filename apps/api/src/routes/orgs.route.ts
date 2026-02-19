import { Hono } from "hono";
import { describeRoute } from "hono-openapi";
import { getUsersDocs } from "../docs/orgs.docs.js";
import { type HonoInstanceContext } from "../_types/index.js";
import withPrisma from "../lib/prisma-client.js";
import { handleAPiError } from "../helpers/api.helper.js";

const usersRoutes = new Hono<HonoInstanceContext>().use(withPrisma).get("/", describeRoute(getUsersDocs), (c) => {
  try {
    const prisma = c.get("prisma");
    const orgs = prisma.org.findMany();
    return c.json({ data: orgs }, 200);
  } catch (error) {
    return handleAPiError(error, "Get orgs error");
  }
});

export default usersRoutes;
