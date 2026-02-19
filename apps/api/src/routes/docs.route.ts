// src/routes/docs.ts
import { Hono } from "hono";
import { Scalar } from "@scalar/hono-api-reference";
import { openAPIRouteHandler } from "hono-openapi";
import "dotenv/config";
import routes from "./index.js";

const serverUrl = process.env.SERVER_URL!;
const mode = process.env.NODE_ENV;
const docs = new Hono()
  .get(
    "/openapi.json",
    openAPIRouteHandler(routes, {
      documentation: {
        info: {
          title: "Worktrack API",
          version: "1.0.0",
          description: " Worktrack API Documentation "
        },
        components: {
          securitySchemes: {
            sessionCookie: {
              type: "apiKey",
              in: "cookie",
              name: "better-auth.session_token"
            },
            bearerAuth: {
              type: "http",
              scheme: "bearer",
              bearerFormat: "JWT"
            }
          }
        },
        security: [{ sessionCookie: [] }]
      },
      includeEmptyPaths: true
    })
  )
  .get(
    "/",
    Scalar({
      url: "/api/v1/docs/openapi.json",
      theme: "bluePlanet",
      layout: "modern",
      defaultHttpClient: { targetKey: "js", clientKey: "fetch" },
      servers: [
        {
          url: serverUrl,
          description: mode === "development" ? "Development server" : "Production server"
        }
      ]
    })
  );

export default docs;
