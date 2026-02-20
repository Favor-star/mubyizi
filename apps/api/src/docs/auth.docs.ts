import type { DescribeRouteOptions } from "hono-openapi";
import { AUTH_TAG } from "../_constants/index.js";
import { docsErrorResponse, docsJsonContent } from "../helpers/docs.helper.js";
import { userSchema } from "../schemas/user.schema.js";
import { loginResponseSchema } from "../schemas/auth.schema.js";

export const signUpDocs: DescribeRouteOptions = {
  tags: [AUTH_TAG],
  summary: "/auth/signup - Register a new user",
  description: "Register a new user with email, password, and name.",
  responses: {
    201: {
      description: "User registered successfully",
      content: docsJsonContent(userSchema)
    },
    ...docsErrorResponse(400, "Invalid request body"),
    ...docsErrorResponse(409, "User with this email already exists. Please use another email"),
    ...docsErrorResponse(500, "Unexpected error occurred while signing up user")
  }
};
export const loginDocs: DescribeRouteOptions = {
  tags: [AUTH_TAG],
  summary: "/auth/login - Authenticate a user",
  description: "Authenticate a user with email and password.",
  responses: {
    200: {
      description: "User authenticated successfully",
      content: docsJsonContent(loginResponseSchema)
    },
    ...docsErrorResponse(400, "Invalid request body"),
    ...docsErrorResponse(401, "Invalid email or password"),
    ...docsErrorResponse(500, "Unexpected error occurred while logging in user")
  }
};
