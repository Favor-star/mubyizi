import { createMiddleware } from "hono/factory";
import { apiErrorResponse } from "../helpers/api.helper.js";

export const requireAuth = () => {
  return createMiddleware(async (c, next) => {
    const user = c.get("user");
    if (user) return await next();
    return c.json(apiErrorResponse("Unauthorized", "You must be logged in to access this resource."), 401);
  });
};
