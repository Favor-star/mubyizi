import { serve } from "@hono/node-server";
import { Hono } from "hono";
import routes from "./routes/index.js";
import docs from "./routes/docs.route.js";
import { logger } from "hono/logger";
import { API_BASE_PATH } from "./_constants/index.js";
import { auth } from "./lib/auth.js";
import { type HonoInstanceContext } from "./_types/index.js";

const app = new Hono<HonoInstanceContext>()
  .basePath(API_BASE_PATH)
  .use(logger())
  .use("*", async (c, next) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });
    if (!session) {
      c.set("user", null);
      c.set("session", null);
      await next();
      return;
    }
    c.set("user", session.user);
    c.set("session", session.session);
    await next();
  })
  .route("/docs", docs)
  .route("/", routes);

const port = Number(process.env.PORT) || 3000;

serve(
  {
    fetch: app.fetch,
    port
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
