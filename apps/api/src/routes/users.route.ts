import { Hono } from "hono";

const usersRoutes = new Hono().get("/", (c) => {
  return c.json({ data: "users route" }, 200);
});
export default usersRoutes;
