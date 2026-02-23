import type { DescribeRouteOptions } from "hono-openapi";
import { ORGS_TAG, WORKPLACES_TAG } from "../_constants/index.js";
import { docsErrorResponse, docsJsonContent, paginatedDocsJsonContent } from "../helpers/docs.helper.js";
import { orgMembershipSchema, orgSchema } from "../schemas/orgs.schema.js";
import { userSchema } from "../schemas/user.schema.js";
import { workplaceSchema } from "../schemas/workplace.schema.js";

export const getOrgsDocs: DescribeRouteOptions = {
  tags: [ORGS_TAG],
  summary: "/orgs - Get a list of organizations",
  description: "Retrieve a paginated list of organizations. Supports search and pagination.",
  responses: {
    200: {
      description: "Organizations retrieved successfully",
      content: paginatedDocsJsonContent(orgSchema)
    },
    ...docsErrorResponse(400, "Invalid query parameters"),
    ...docsErrorResponse(401, "Unauthorized - User must be logged in"),
    ...docsErrorResponse(403, "Forbidden - Insufficient organization privileges"),
    ...docsErrorResponse(500, "Unexpected error occurred while retrieving organizations")
  }
};
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
export const getSingleOrgDocs: DescribeRouteOptions = {
  tags: [ORGS_TAG],
  summary: "/orgs/{orgId} - Get organization details",
  description: "Retrieve details of a specific organization by its ID.",
  responses: {
    200: {
      description: "Organization details retrieved successfully",
      content: docsJsonContent(orgSchema)
    },
    ...docsErrorResponse(400, "Invalid organization ID"),
    ...docsErrorResponse(401, "Unauthorized - User must be logged in"),
    ...docsErrorResponse(403, "Forbidden - Insufficient organization privileges"),
    ...docsErrorResponse(404, "Organization not found"),
    ...docsErrorResponse(500, "Unexpected error occurred while retrieving organization details")
  }
};
export const updateOrgDocs: DescribeRouteOptions = {
  tags: [ORGS_TAG],
  summary: "/orgs/{orgId} - Update organization details",
  description: "Update details of a specific organization by its ID.",
  responses: {
    200: {
      description: "Organization updated successfully",
      content: docsJsonContent(orgSchema)
    },
    ...docsErrorResponse(400, "Invalid organization ID or request body"),
    ...docsErrorResponse(401, "Unauthorized - User must be logged in"),
    ...docsErrorResponse(403, "Forbidden - Insufficient organization privileges"),
    ...docsErrorResponse(404, "Organization not found"),
    ...docsErrorResponse(500, "Unexpected error occurred while updating organization details")
  }
};
export const deleteOrgDocs: DescribeRouteOptions = {
  tags: [ORGS_TAG],
  summary: "/orgs/{orgId} - Delete an organization",
  description: "Delete a specific organization by its ID.",
  responses: {
    200: {
      description: "Organization deleted successfully",
      content: docsJsonContent(orgSchema)
    },
    ...docsErrorResponse(400, "Invalid organization ID"),
    ...docsErrorResponse(401, "Unauthorized - User must be logged in"),
    ...docsErrorResponse(403, "Forbidden - Insufficient organization privileges"),
    ...docsErrorResponse(404, "Organization not found"),
    ...docsErrorResponse(500, "Unexpected error occurred while deleting organization")
  }
};
export const getOrgMembersDocs: DescribeRouteOptions = {
  tags: [ORGS_TAG],
  summary: "/orgs/{orgId}/members - Get organization members",
  description: "Retrieve a paginated list of members in a specific organization. Supports search and pagination.",
  responses: {
    200: {
      description: "Organization members retrieved successfully",
      content: paginatedDocsJsonContent(orgMembershipSchema.extend(userSchema.shape))
    },
    ...docsErrorResponse(400, "Invalid organization ID"),
    ...docsErrorResponse(401, "Unauthorized - User must be logged in"),
    ...docsErrorResponse(403, "Forbidden - Insufficient organization privileges"),
    ...docsErrorResponse(404, "Organization not found"),
    ...docsErrorResponse(500, "Unexpected error occurred while retrieving organization members")
  }
};
export const getOrgWorkplacesDocs: DescribeRouteOptions = {
  tags: [ORGS_TAG, WORKPLACES_TAG],
  summary: "/orgs/{orgId}/workplaces - Get organization workplaces",
  description: "Retrieve a paginated list of workplaces in a specific organization. Supports search and pagination.",
  responses: {
    200: {
      description: "Organization workplaces retrieved successfully",
      content: paginatedDocsJsonContent(workplaceSchema)
    },
    ...docsErrorResponse(400, "Invalid organization ID"),
    ...docsErrorResponse(401, "Unauthorized - User must be logged in"),
    ...docsErrorResponse(403, "Forbidden - Insufficient organization privileges"),
    ...docsErrorResponse(404, "Organization not found"),
    ...docsErrorResponse(500, "Unexpected error occurred while retrieving organization workplaces")
  }
};
