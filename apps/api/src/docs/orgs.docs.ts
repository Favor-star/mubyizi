import type { DescribeRouteOptions } from "hono-openapi";
import { ORGS_TAG } from "../_constants/index.js";
import { docsErrorResponse, paginatedDocsJsonContent } from "../helpers/docs.helper.js";
import { orgSchema } from "../schemas/orgs.schema.js";

export const getUsersDocs: DescribeRouteOptions = {
  tags: [ORGS_TAG],
  summary: "/orgs - Get all organizations",

  description: "Retrieve a list of all organizations in the system.",
  responses: {
    200: {
      description: "A list of organizations",
      content: paginatedDocsJsonContent(orgSchema)
    },
    ...docsErrorResponse(500, "Internal Server Error")
  }
};
