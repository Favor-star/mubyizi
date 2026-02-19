import { serve } from "@hono/node-server";
import { Hono } from "hono";
import routes from "./routes/index.js";

const app = new Hono();

app.route("/", routes);

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
