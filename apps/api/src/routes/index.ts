import { Hono } from "hono";
import orgRoutes from "./orgs.route.js";
import authRoutes from "./auth.route.js";
import workplaceRoutes from "./workplace.route.js";
import usersRoutes from "./users.route.js";

const routes = new Hono()
  .route("/users", usersRoutes)
  .route("/auth", authRoutes)
  .route("/orgs", orgRoutes)
  .route("/orgs/:orgId/workplaces", workplaceRoutes);

export default routes;
