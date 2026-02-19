import { serve } from "@hono/node-server";
import { Hono } from "hono";
import routes from "./routes/index.js";
import docs from "./routes/docs.route.js";
import { logger } from "hono/logger";
import { API_BASE_PATH } from "./_constants/index.js";

const app = new Hono().basePath(API_BASE_PATH).use(logger()).route("/docs", docs).route("/", routes);

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
