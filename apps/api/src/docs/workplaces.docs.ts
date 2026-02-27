import type { DescribeRouteOptions } from "hono-openapi";
import { WORKPLACES_TAG } from "../_constants/index.js";
import { docsErrorResponse, docsJsonContent, paginatedDocsJsonContent } from "../helpers/docs.helper.js";
import {
  geofenceSchema,
  provisionWorkplaceWorkerSchema,
  workplaceImageSchema,
  workplaceSchema,
  workplaceWithWorkersSchema
} from "../schemas/workplace.schema.js";
import { userSchema } from "../schemas/user.schema.js";

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

export const assignWorkersDocs: DescribeRouteOptions = {
  tags: [WORKPLACES_TAG],
  summary: "/orgs/{orgId}/workplaces/{workplaceId}/workers - Assign existing users to a workplace",
  description: "Assign one or more existing org members to a workplace with a specified role.",
  responses: {
    201: {
      description: "Workers assigned successfully",
      content: docsJsonContent(workplaceWithWorkersSchema)
    },
    ...docsErrorResponse(400, "Invalid request body, or one or more user IDs not found"),
    ...docsErrorResponse(401, "Unauthorized - User must be logged in"),
    ...docsErrorResponse(403, "Forbidden - Insufficient workplace privileges"),
    ...docsErrorResponse(500, "Unexpected error occurred while assigning workers")
  }
};

export const updateWorkerRoleDocs: DescribeRouteOptions = {
  tags: [WORKPLACES_TAG],
  summary: "/orgs/{orgId}/workplaces/{workplaceId}/workers/{userId} - Change a worker's role",
  description: "Update the workplace role of an assigned worker. Caller must outrank the target.",
  responses: {
    200: {
      description: "Worker role updated successfully",
      content: docsJsonContent(workplaceWithWorkersSchema)
    },
    ...docsErrorResponse(400, "Invalid user ID or role"),
    ...docsErrorResponse(401, "Unauthorized - User must be logged in"),
    ...docsErrorResponse(403, "Forbidden - Cannot change role of a worker with equal or higher privileges"),
    ...docsErrorResponse(404, "Worker not found in this workplace"),
    ...docsErrorResponse(500, "Unexpected error occurred while updating worker role")
  }
};

export const unassignWorkerDocs: DescribeRouteOptions = {
  tags: [WORKPLACES_TAG],
  summary: "/orgs/{orgId}/workplaces/{workplaceId}/workers/{userId} - Unassign a worker",
  description: "Soft-unassign a worker from this workplace (sets isActive=false). Caller must outrank the target.",
  responses: {
    200: {
      description: "Worker unassigned successfully"
    },
    ...docsErrorResponse(400, "Invalid user ID"),
    ...docsErrorResponse(401, "Unauthorized - User must be logged in"),
    ...docsErrorResponse(403, "Forbidden - Cannot unassign a worker with equal or higher privileges"),
    ...docsErrorResponse(404, "Worker not found in this workplace"),
    ...docsErrorResponse(500, "Unexpected error occurred while unassigning worker")
  }
};

export const getWorkplaceImagesDocs: DescribeRouteOptions = {
  tags: [WORKPLACES_TAG],
  summary: "/orgs/{orgId}/workplaces/{workplaceId}/images - List workplace images",
  description: "Retrieve all images uploaded for this workplace.",
  responses: {
    200: {
      description: "Images retrieved successfully",
      content: paginatedDocsJsonContent(workplaceImageSchema)
    },
    ...docsErrorResponse(401, "Unauthorized - User must be logged in"),
    ...docsErrorResponse(403, "Forbidden - Insufficient workplace privileges"),
    ...docsErrorResponse(404, "Workplace not found"),
    ...docsErrorResponse(500, "Unexpected error retrieving images")
  }
};

export const uploadWorkplaceImageDocs: DescribeRouteOptions = {
  tags: [WORKPLACES_TAG],
  summary: "/orgs/{orgId}/workplaces/{workplaceId}/images - Upload a workplace image",
  description: "Upload an image to Cloudinary and attach it to this workplace.",
  responses: {
    201: {
      description: "Image uploaded successfully",
      content: docsJsonContent(workplaceImageSchema)
    },
    ...docsErrorResponse(400, "Invalid request body or image data"),
    ...docsErrorResponse(401, "Unauthorized - User must be logged in"),
    ...docsErrorResponse(403, "Forbidden - Insufficient workplace privileges"),
    ...docsErrorResponse(500, "Unexpected error uploading image")
  }
};

export const deleteWorkplaceImageDocs: DescribeRouteOptions = {
  tags: [WORKPLACES_TAG],
  summary: "/orgs/{orgId}/workplaces/{workplaceId}/images/{imageId} - Delete a workplace image",
  description: "Delete an image from Cloudinary and remove it from the workplace.",
  responses: {
    200: {
      description: "Image deleted successfully",
      content: docsJsonContent(workplaceImageSchema)
    },
    ...docsErrorResponse(401, "Unauthorized - User must be logged in"),
    ...docsErrorResponse(403, "Forbidden - Insufficient workplace privileges"),
    ...docsErrorResponse(404, "Image not found"),
    ...docsErrorResponse(500, "Unexpected error deleting image")
  }
};

export const getWorkplaceStatsDocs: DescribeRouteOptions = {
  tags: [WORKPLACES_TAG],
  summary: "/orgs/{orgId}/workplaces/{workplaceId}/stats - Get workplace real-time stats",
  description: "Returns headcount, today's attendance rate, budget burn, and cached cost figures.",
  responses: {
    200: {
      description: "Stats retrieved successfully"
    },
    ...docsErrorResponse(401, "Unauthorized - User must be logged in"),
    ...docsErrorResponse(403, "Forbidden - Insufficient workplace privileges"),
    ...docsErrorResponse(404, "Workplace not found"),
    ...docsErrorResponse(500, "Unexpected error retrieving stats")
  }
};

export const getActivityLogDocs: DescribeRouteOptions = {
  tags: [WORKPLACES_TAG],
  summary: "/orgs/{orgId}/workplaces/{workplaceId}/activity-log - Get workplace activity log",
  description: "Paginated audit trail of clock-in/out and worker assignment events for this workplace.",
  responses: {
    200: {
      description: "Activity log retrieved successfully"
    },
    ...docsErrorResponse(401, "Unauthorized - User must be logged in"),
    ...docsErrorResponse(403, "Forbidden - Insufficient workplace privileges"),
    ...docsErrorResponse(404, "Workplace not found"),
    ...docsErrorResponse(500, "Unexpected error retrieving activity log")
  }
};

export const getGeofenceDocs: DescribeRouteOptions = {
  tags: [WORKPLACES_TAG],
  summary: "/orgs/{orgId}/workplaces/{workplaceId}/geofence - Get geofence settings",
  description: "Retrieve the GPS geofence boundary configured for this workplace.",
  responses: {
    200: {
      description: "Geofence retrieved successfully",
      content: docsJsonContent(geofenceSchema)
    },
    ...docsErrorResponse(401, "Unauthorized - User must be logged in"),
    ...docsErrorResponse(403, "Forbidden - Insufficient workplace privileges"),
    ...docsErrorResponse(404, "No geofence configured for this workplace"),
    ...docsErrorResponse(500, "Unexpected error retrieving geofence")
  }
};

export const setGeofenceDocs: DescribeRouteOptions = {
  tags: [WORKPLACES_TAG],
  summary: "/orgs/{orgId}/workplaces/{workplaceId}/geofence - Set or update geofence",
  description: "Create or update the GPS geofence boundary (latitude, longitude, radius in meters) for this workplace.",
  responses: {
    200: {
      description: "Geofence set successfully",
      content: docsJsonContent(geofenceSchema)
    },
    ...docsErrorResponse(400, "Invalid geofence parameters"),
    ...docsErrorResponse(401, "Unauthorized - User must be logged in"),
    ...docsErrorResponse(403, "Forbidden - Insufficient workplace privileges"),
    ...docsErrorResponse(500, "Unexpected error setting geofence")
  }
};

export const deleteGeofenceDocs: DescribeRouteOptions = {
  tags: [WORKPLACES_TAG],
  summary: "/orgs/{orgId}/workplaces/{workplaceId}/geofence - Delete geofence",
  description: "Remove the GPS geofence boundary from this workplace.",
  responses: {
    200: {
      description: "Geofence deleted successfully",
      content: docsJsonContent(geofenceSchema)
    },
    ...docsErrorResponse(401, "Unauthorized - User must be logged in"),
    ...docsErrorResponse(403, "Forbidden - Insufficient workplace privileges"),
    ...docsErrorResponse(404, "No geofence configured for this workplace"),
    ...docsErrorResponse(500, "Unexpected error deleting geofence")
  }
};

export const provisionWorkplaceWorkerDocs: DescribeRouteOptions = {
  tags: [WORKPLACES_TAG],
  summary: "/orgs/{orgId}/workplaces/{workplaceId}/workers/provision - Provision a new worker",
  description: "Create a provisional user, add them to the organization, and assign them to this workplace in a single step. The user has no login credentials until they claim their account.",
  responses: {
    201: {
      description: "Worker provisioned and assigned successfully",
      content: docsJsonContent(
        userSchema.pick({ id: true, name: true, email: true, phoneNumber: true, accountStatus: true })
      )
    },
    ...docsErrorResponse(400, "Invalid request body"),
    ...docsErrorResponse(401, "Unauthorized - User must be logged in"),
    ...docsErrorResponse(403, "Forbidden - Insufficient workplace privileges or role escalation attempt"),
    ...docsErrorResponse(404, "Workplace not found"),
    ...docsErrorResponse(409, "A user with this email already exists"),
    ...docsErrorResponse(500, "Unexpected error occurred while provisioning worker")
  }
};