import { Hono } from "hono";
import usersRoutes from "./users.route.js";

const routes = new Hono().route("/users", usersRoutes);

export default routes;
