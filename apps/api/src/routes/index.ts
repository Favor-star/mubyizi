import { Hono } from "hono";
import usersRoutes from "./orgs.route.js";
import authRoutes from "./auth.route.js";

const routes = new Hono().route("/orgs", usersRoutes).route("/auth", authRoutes);

export default routes;
