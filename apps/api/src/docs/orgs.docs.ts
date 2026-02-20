import type { DescribeRouteOptions } from "hono-openapi";
import { ORGS_TAG } from "../_constants/index.js";
import { docsErrorResponse, docsJsonContent,  } from "../helpers/docs.helper.js";
import { orgSchema } from "../schemas/orgs.schema.js";

export const createOrgDocs: DescribeRouteOptions = {
  tags: [ORGS_TAG],
  summary: "/orgs - Create a new organization",
  description: "Create a new organization with the provided details.",
  responses: {
    201: {
      description: "Organization created successfully",
      content: docsJsonContent(orgSchema)
    },
    ...docsErrorResponse(400, "Invalid request body"),
    ...docsErrorResponse(500, "Unexpected error occurred while creating organization")
  }
};
