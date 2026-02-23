import { Hono } from "hono";
import orgRoutes from "./orgs.route.js";
import authRoutes from "./auth.route.js";
import workplaceRoutes from "./workplace.route.js";

const routes = new Hono()
  .route("/orgs", orgRoutes)
  .route("/auth", authRoutes)
  .route("/orgs/:orgId/workplaces", workplaceRoutes);

export default routes;
