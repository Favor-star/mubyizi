import type { DescribeRouteOptions } from "hono-openapi";
import { WORKPLACES_TAG } from "../_constants/index.js";
import { docsErrorResponse, docsJsonContent } from "../helpers/docs.helper.js";
import { workplaceSchema, workplaceWithWorkersSchema } from "../schemas/workplace.schema.js";

export const createWorkplaceDocs: DescribeRouteOptions = {
  tags: [WORKPLACES_TAG],
  summary: "/orgs/{orgId}/workplaces - Create a new workplace",
  description: "Create a new workplace within the specified organization.",
  responses: {
    201: {
      description: "Workplace created successfully",
      content: docsJsonContent(workplaceSchema)
    },
    ...docsErrorResponse(400, "Invalid request body or organization ID"),
    ...docsErrorResponse(401, "Unauthorized - User must be logged in"),
    ...docsErrorResponse(403, "Forbidden - Insufficient organization privileges"),
    ...docsErrorResponse(500, "Unexpected error occurred while creating workplace")
  }
};
export const getSingleWorkplaceDocs: DescribeRouteOptions = {
  tags: [WORKPLACES_TAG],
  summary: "/orgs/{orgId}/workplaces/{workplaceId} - Get workplace details",
  description: "Retrieve details of a specific workplace within the specified organization.",
  responses: {
    200: {
      description: "Workplace details retrieved successfully",
      content: docsJsonContent(workplaceSchema)
    },
    ...docsErrorResponse(400, "Invalid organization ID or workplace ID"),
    ...docsErrorResponse(401, "Unauthorized - User must be logged in"),
    ...docsErrorResponse(403, "Forbidden - Insufficient organization privileges"),
    ...docsErrorResponse(404, "Workplace not found"),
    ...docsErrorResponse(500, "Unexpected error occurred while retrieving workplace details")
  }
};
export const updateWorkplaceDocs: DescribeRouteOptions = {
  tags: [WORKPLACES_TAG],
  summary: "/orgs/{orgId}/workplaces/{workplaceId} - Update workplace details",
  description: "Update details of a specific workplace within the specified organization.",
  responses: {
    200: {
      description: "Workplace updated successfully",
      content: docsJsonContent(workplaceSchema)
    },
    ...docsErrorResponse(400, "Invalid request body, organization ID, or workplace ID"),
    ...docsErrorResponse(401, "Unauthorized - User must be logged in"),
    ...docsErrorResponse(403, "Forbidden - Insufficient organization privileges"),
    ...docsErrorResponse(404, "Workplace not found"),
    ...docsErrorResponse(500, "Unexpected error occurred while updating workplace")
  }
};
export const deleteWorkplaceDocs: DescribeRouteOptions = {
  tags: [WORKPLACES_TAG],
  summary: "/orgs/{orgId}/workplaces/{workplaceId} - Delete a workplace",
  description: "Delete a specific workplace within the specified organization.",
  responses: {
    200: {
      description: "Workplace deleted successfully",
      content: docsJsonContent(workplaceSchema)
    },
    ...docsErrorResponse(400, "Invalid organization ID or workplace ID"),
    ...docsErrorResponse(401, "Unauthorized - User must be logged in"),
    ...docsErrorResponse(403, "Forbidden - Insufficient organization privileges"),
    ...docsErrorResponse(404, "Workplace not found"),
    ...docsErrorResponse(500, "Unexpected error occurred while deleting workplace")
  }
};
export const addWorkersToWorkplaceDocs: DescribeRouteOptions = {
  tags: [WORKPLACES_TAG],
  summary: "/orgs/{orgId}/workplaces/{workplaceId}/workers - Add workers to a workplace",
  description: "Add one or more workers to a specific workplace within the specified organization.",
  responses: {
    200: {
      description: "Workers added to workplace successfully",
      content: docsJsonContent(workplaceSchema)
    },
    ...docsErrorResponse(400, "Invalid request body, organization ID, or workplace ID"),
    ...docsErrorResponse(401, "Unauthorized - User must be logged in"),
    ...docsErrorResponse(403, "Forbidden - Insufficient organization privileges"),
    ...docsErrorResponse(404, "Workplace not found"),
    ...docsErrorResponse(500, "Unexpected error occurred while adding workers to workplace")
  }
};
export const getWorkersOfWorkplaceDocs: DescribeRouteOptions = {
  tags: [WORKPLACES_TAG],
  summary: "/orgs/{orgId}/workplaces/{workplaceId}/workers - Get workers of a workplace",
  description: "Retrieve a list of workers assigned to a specific workplace within the specified organization.",
  responses: {
    200: {
      description: "Workers retrieved successfully",
      content: docsJsonContent(workplaceWithWorkersSchema)
    },
    ...docsErrorResponse(400, "Invalid organization ID or workplace ID"),
    ...docsErrorResponse(401, "Unauthorized - User must be logged in"),
    ...docsErrorResponse(403, "Forbidden - Insufficient organization privileges"),
    ...docsErrorResponse(404, "Workplace not found"),
    ...docsErrorResponse(500, "Unexpected error occurred while retrieving workers of workplace")
  }
};

export const addNewWorkersToWorkplaceDocs: DescribeRouteOptions = {
  tags: [WORKPLACES_TAG],
  summary: "/orgs/{orgId}/workplaces/{workplaceId}/workers - Create workers to a workplace",
  description: "Add one or more workers to a specific workplace within the specified organization.",
  responses: {
    200: {
      description: "Workers added to workplace successfully",
      content: docsJsonContent(workplaceSchema)
    },
    ...docsErrorResponse(400, "Invalid request body, organization ID, or workplace ID"),
    ...docsErrorResponse(401, "Unauthorized - User must be logged in"),
    ...docsErrorResponse(403, "Forbidden - Insufficient organization privileges"),
    ...docsErrorResponse(404, "Workplace not found"),
    ...docsErrorResponse(500, "Unexpected error occurred while adding workers to workplace")
  }
};