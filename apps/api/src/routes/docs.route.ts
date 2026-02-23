// src/routes/docs.ts
import { Hono } from "hono";
import { Scalar } from "@scalar/hono-api-reference";
import { openAPIRouteHandler } from "hono-openapi";
import "dotenv/config";
import routes from "./index.js";
import JSONPackage from "@/package.json" with { type: "json" };

const serverUrl = process.env.SERVER_URL!;
const mode = process.env.NODE_ENV;
const docs = new Hono()
  .get(
    "/openapi.json",
    openAPIRouteHandler(routes, {
      documentation: {
        info: {
          title: "Mubyizi API Documentation",
          version: JSONPackage.version,
          description:
            " API documentation for the Mubyizi application, which manages organizations, workplaces, and user roles."
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
      pageTitle: "Mubyizi API Documentation",
      title: "Mubyizi API Documentation",
       
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
