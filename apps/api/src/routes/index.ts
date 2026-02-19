import { Hono } from "hono";
import usersRoutes from "./orgs.route.js";

const routes = new Hono().route("/orgs", usersRoutes);

export default routes;
