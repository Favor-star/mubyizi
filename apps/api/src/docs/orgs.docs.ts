import type { DescribeRouteOptions } from "hono-openapi";
import { ORGS_TAG, WORKPLACES_TAG } from "../_constants/index.js";
import { docsErrorResponse, docsJsonContent, paginatedDocsJsonContent } from "../helpers/docs.helper.js";
import { orgInviteSchema, orgMembershipSchema, orgSchema, orgSettingsSchema, provisionOrgWorkerSchema } from "../schemas/orgs.schema.js";
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
export const addOrgMemberDocs: DescribeRouteOptions = {
  tags: [ORGS_TAG],
  summary: "/orgs/{orgId}/members - Add a member to the organization",
  description: "Add an existing system user to the organization with a specified role. Caller cannot assign a role equal to or higher than their own.",
  responses: {
    201: {
      description: "Member added successfully",
      content: docsJsonContent(orgMembershipSchema)
    },
    ...docsErrorResponse(400, "Invalid request body or user ID"),
    ...docsErrorResponse(401, "Unauthorized - User must be logged in"),
    ...docsErrorResponse(403, "Forbidden - Insufficient organization privileges or role escalation attempt"),
    ...docsErrorResponse(404, "User not found"),
    ...docsErrorResponse(409, "User is already a member of this organization"),
    ...docsErrorResponse(500, "Unexpected error occurred while adding member")
  }
};

export const updateOrgMemberRoleDocs: DescribeRouteOptions = {
  tags: [ORGS_TAG],
  summary: "/orgs/{orgId}/members/{userId} - Change a member's role",
  description: "Update the organization role of a member. Caller must strictly outrank the target and cannot assign a role equal to or above their own.",
  responses: {
    200: {
      description: "Member role updated successfully",
      content: docsJsonContent(orgMembershipSchema)
    },
    ...docsErrorResponse(400, "Invalid user ID or role"),
    ...docsErrorResponse(401, "Unauthorized - User must be logged in"),
    ...docsErrorResponse(403, "Forbidden - Cannot change role of a member with equal or higher privileges"),
    ...docsErrorResponse(404, "Member not found in this organization"),
    ...docsErrorResponse(500, "Unexpected error occurred while updating member role")
  }
};

export const removeOrgMemberDocs: DescribeRouteOptions = {
  tags: [ORGS_TAG],
  summary: "/orgs/{orgId}/members/{userId} - Remove a member",
  description: "Soft-remove a member from the organization (sets isActive=false). Caller must strictly outrank the target.",
  responses: {
    200: {
      description: "Member removed successfully",
      content: docsJsonContent(orgMembershipSchema)
    },
    ...docsErrorResponse(400, "Invalid user ID"),
    ...docsErrorResponse(401, "Unauthorized - User must be logged in"),
    ...docsErrorResponse(403, "Forbidden - Cannot remove a member with equal or higher privileges"),
    ...docsErrorResponse(404, "Member not found in this organization"),
    ...docsErrorResponse(500, "Unexpected error occurred while removing member")
  }
};

export const inviteMemberDocs: DescribeRouteOptions = {
  tags: [ORGS_TAG],
  summary: "/orgs/{orgId}/invite - Invite a member by email or phone",
  description: "Create an invite token for a user identified by email or phone. The token is valid for 7 days.",
  responses: {
    201: {
      description: "Invite created successfully",
      content: docsJsonContent(orgInviteSchema)
    },
    ...docsErrorResponse(400, "Invalid request body — either email or phone is required"),
    ...docsErrorResponse(401, "Unauthorized - User must be logged in"),
    ...docsErrorResponse(403, "Forbidden - Insufficient organization privileges"),
    ...docsErrorResponse(500, "Unexpected error occurred while creating invite")
  }
};

export const acceptInviteDocs: DescribeRouteOptions = {
  tags: [ORGS_TAG],
  summary: "/orgs/{orgId}/invite/accept - Accept an organization invite",
  description: "Accept a pending invite using the provided token. The authenticated user joins the organization with the role specified in the invite.",
  responses: {
    200: {
      description: "Invite accepted and membership created",
      content: docsJsonContent(orgMembershipSchema)
    },
    ...docsErrorResponse(400, "Invalid or expired token"),
    ...docsErrorResponse(401, "Unauthorized - User must be logged in"),
    ...docsErrorResponse(403, "Forbidden - This invite was not issued to you"),
    ...docsErrorResponse(404, "Invite not found"),
    ...docsErrorResponse(500, "Unexpected error occurred while accepting invite")
  }
};

export const declineInviteDocs: DescribeRouteOptions = {
  tags: [ORGS_TAG],
  summary: "/orgs/{orgId}/invite/decline - Decline an organization invite",
  description: "Decline a pending invite using the provided token.",
  responses: {
    200: {
      description: "Invite declined successfully",
      content: docsJsonContent(orgInviteSchema)
    },
    ...docsErrorResponse(400, "Invalid or already-used token"),
    ...docsErrorResponse(401, "Unauthorized - User must be logged in"),
    ...docsErrorResponse(404, "Invite not found"),
    ...docsErrorResponse(500, "Unexpected error occurred while declining invite")
  }
};

export const getOrgStatsDocs: DescribeRouteOptions = {
  tags: [ORGS_TAG],
  summary: "/orgs/{orgId}/stats - Get organization dashboard metrics",
  description: "Returns high-level stats: total members, total workplaces by status, aggregate spend, and pending attendance count.",
  responses: {
    200: {
      description: "Stats retrieved successfully"
    },
    ...docsErrorResponse(401, "Unauthorized - User must be logged in"),
    ...docsErrorResponse(403, "Forbidden - Insufficient organization privileges"),
    ...docsErrorResponse(404, "Organization not found"),
    ...docsErrorResponse(500, "Unexpected error retrieving stats")
  }
};

export const getOrgActivityLogDocs: DescribeRouteOptions = {
  tags: [ORGS_TAG],
  summary: "/orgs/{orgId}/activity-log - Get organization activity log",
  description: "Paginated audit trail of member join/remove events derived from OrgMembership records.",
  responses: {
    200: {
      description: "Activity log retrieved successfully"
    },
    ...docsErrorResponse(401, "Unauthorized - User must be logged in"),
    ...docsErrorResponse(403, "Forbidden - Insufficient organization privileges"),
    ...docsErrorResponse(404, "Organization not found"),
    ...docsErrorResponse(500, "Unexpected error retrieving activity log")
  }
};

export const getOrgSettingsDocs: DescribeRouteOptions = {
  tags: [ORGS_TAG],
  summary: "/orgs/{orgId}/settings - Get organization settings",
  description: "Retrieve the configuration subset of the organization: timezone, logoUrl, website, address, city, country.",
  responses: {
    200: {
      description: "Settings retrieved successfully",
      content: docsJsonContent(orgSettingsSchema)
    },
    ...docsErrorResponse(401, "Unauthorized - User must be logged in"),
    ...docsErrorResponse(403, "Forbidden - Insufficient organization privileges"),
    ...docsErrorResponse(404, "Organization not found"),
    ...docsErrorResponse(500, "Unexpected error retrieving settings")
  }
};

export const updateOrgSettingsDocs: DescribeRouteOptions = {
  tags: [ORGS_TAG],
  summary: "/orgs/{orgId}/settings - Update organization settings",
  description: "Update the configuration subset of the organization: timezone, logoUrl, website, address, city, country.",
  responses: {
    200: {
      description: "Settings updated successfully",
      content: docsJsonContent(orgSettingsSchema)
    },
    ...docsErrorResponse(400, "Invalid settings values"),
    ...docsErrorResponse(401, "Unauthorized - User must be logged in"),
    ...docsErrorResponse(403, "Forbidden - Insufficient organization privileges"),
    ...docsErrorResponse(404, "Organization not found"),
    ...docsErrorResponse(500, "Unexpected error updating settings")
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

export const provisionOrgWorkerDocs: DescribeRouteOptions = {
  tags: [ORGS_TAG],
  summary: "/orgs/{orgId}/workers/provision - Provision a new worker",
  description: "Create a provisional user account and immediately add them as an org member. The user has no login credentials until they claim their account via sign-up.",
  responses: {
    201: {
      description: "Worker provisioned successfully",
      content: docsJsonContent(
        userSchema.pick({ id: true, name: true, email: true, phoneNumber: true, accountStatus: true }).extend({
          membership: orgMembershipSchema
        })
      )
    },
    ...docsErrorResponse(400, "Invalid request body"),
    ...docsErrorResponse(401, "Unauthorized - User must be logged in"),
    ...docsErrorResponse(403, "Forbidden - Insufficient organization privileges or role escalation attempt"),
    ...docsErrorResponse(409, "A user with this email already exists"),
    ...docsErrorResponse(500, "Unexpected error occurred while provisioning worker")
  }
};

export const inviteToClaimDocs: DescribeRouteOptions = {
  tags: [ORGS_TAG],
  summary: "/orgs/{orgId}/members/{userId}/invite-to-claim - Invite a provisional user to create an account",
  description: "Send a claim invite to a provisional user so they can sign up and link their existing profile. The invite token can be passed as claimToken during sign-up.",
  responses: {
    201: {
      description: "Claim invite created successfully",
      content: docsJsonContent(orgInviteSchema)
    },
    ...docsErrorResponse(400, "User is not a provisional account or has no contact info"),
    ...docsErrorResponse(401, "Unauthorized - User must be logged in"),
    ...docsErrorResponse(403, "Forbidden - Insufficient organization privileges"),
    ...docsErrorResponse(404, "Member not found"),
    ...docsErrorResponse(500, "Unexpected error occurred while creating claim invite")
  }
};
