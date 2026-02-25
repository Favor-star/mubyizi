import type { DescribeRouteOptions } from "hono-openapi";
import { USERS_TAG } from "../_constants/index.js";
import { docsErrorResponse, docsJsonContent, paginatedDocsJsonContent } from "../helpers/docs.helper.js";
import { userSchema } from "../schemas/user.schema.js";
import {
  userSkillSchema,
  userDocumentSchema,
  emergencyContactSchema
} from "../schemas/user-extensions.schema.js";

export const listUsersDocs: DescribeRouteOptions = {
  tags: [USERS_TAG],
  summary: "/users - List users",
  description: "Retrieve paginated list of users. SUPERADMIN can list all; MANAGER must provide orgId.",
  responses: {
    200: {
      description: "Users retrieved successfully",
      content: paginatedDocsJsonContent(userSchema)
    },
    ...docsErrorResponse(400, "Invalid query parameters"),
    ...docsErrorResponse(401, "Unauthorized"),
    ...docsErrorResponse(403, "Forbidden - Insufficient privileges"),
    ...docsErrorResponse(500, "Unexpected error")
  }
};

export const createUserDocs: DescribeRouteOptions = {
  tags: [USERS_TAG],
  summary: "/users - Create a user",
  description: "Create a Users domain record. SUPERADMIN only. Does not create a better-auth account.",
  responses: {
    201: {
      description: "User created successfully",
      content: docsJsonContent(userSchema)
    },
    ...docsErrorResponse(400, "Invalid request body"),
    ...docsErrorResponse(401, "Unauthorized"),
    ...docsErrorResponse(403, "Forbidden - SUPERADMIN only"),
    ...docsErrorResponse(409, "Email already exists"),
    ...docsErrorResponse(500, "Unexpected error")
  }
};

export const getUserDocs: DescribeRouteOptions = {
  tags: [USERS_TAG],
  summary: "/users/{id} - Get user details",
  description: "Get a single user. Self or SUPERADMIN. wageId omitted; lastLoginAt omitted for non-self.",
  responses: {
    200: {
      description: "User retrieved successfully",
      content: docsJsonContent(userSchema)
    },
    ...docsErrorResponse(401, "Unauthorized"),
    ...docsErrorResponse(403, "Forbidden"),
    ...docsErrorResponse(404, "User not found"),
    ...docsErrorResponse(500, "Unexpected error")
  }
};

export const updateUserDocs: DescribeRouteOptions = {
  tags: [USERS_TAG],
  summary: "/users/{id} - Update user",
  description: "Partially update a user. Self or SUPERADMIN. Non-SUPERADMIN cannot change systemRole.",
  responses: {
    200: {
      description: "User updated successfully",
      content: docsJsonContent(userSchema)
    },
    ...docsErrorResponse(400, "Invalid request body"),
    ...docsErrorResponse(401, "Unauthorized"),
    ...docsErrorResponse(403, "Forbidden"),
    ...docsErrorResponse(404, "User not found"),
    ...docsErrorResponse(500, "Unexpected error")
  }
};

export const deleteUserDocs: DescribeRouteOptions = {
  tags: [USERS_TAG],
  summary: "/users/{id} - Delete user",
  description: "Hard delete a user. SUPERADMIN only. Cannot self-delete.",
  responses: {
    200: {
      description: "User deleted successfully",
      content: docsJsonContent(userSchema)
    },
    ...docsErrorResponse(400, "Cannot self-delete"),
    ...docsErrorResponse(401, "Unauthorized"),
    ...docsErrorResponse(403, "Forbidden - SUPERADMIN only"),
    ...docsErrorResponse(404, "User not found"),
    ...docsErrorResponse(500, "Unexpected error")
  }
};

export const getUserAttendanceDocs: DescribeRouteOptions = {
  tags: [USERS_TAG],
  summary: "/users/{id}/attendance - Get user attendance history",
  description: "Paginated attendance history. Self, MANAGER in shared org, or SUPERADMIN.",
  responses: {
    200: {
      description: "Attendance history retrieved",
      content: paginatedDocsJsonContent(userSchema)
    },
    ...docsErrorResponse(401, "Unauthorized"),
    ...docsErrorResponse(403, "Forbidden"),
    ...docsErrorResponse(404, "User not found"),
    ...docsErrorResponse(500, "Unexpected error")
  }
};

export const getUserEarningsDocs: DescribeRouteOptions = {
  tags: [USERS_TAG],
  summary: "/users/{id}/earnings - Get user earnings",
  description: "Paginated WorkerEarnings records. Self, MANAGER in shared org, or SUPERADMIN.",
  responses: {
    200: {
      description: "Earnings retrieved",
      content: paginatedDocsJsonContent(userSchema)
    },
    ...docsErrorResponse(401, "Unauthorized"),
    ...docsErrorResponse(403, "Forbidden"),
    ...docsErrorResponse(404, "User not found"),
    ...docsErrorResponse(500, "Unexpected error")
  }
};

export const getUserPaymentsDocs: DescribeRouteOptions = {
  tags: [USERS_TAG],
  summary: "/users/{id}/payments - Get user payment records",
  description: "Paginated Payment records. Self, MANAGER in shared org, or SUPERADMIN.",
  responses: {
    200: {
      description: "Payment records retrieved",
      content: paginatedDocsJsonContent(userSchema)
    },
    ...docsErrorResponse(401, "Unauthorized"),
    ...docsErrorResponse(403, "Forbidden"),
    ...docsErrorResponse(404, "User not found"),
    ...docsErrorResponse(500, "Unexpected error")
  }
};

export const getUserWorkplacesDocs: DescribeRouteOptions = {
  tags: [USERS_TAG],
  summary: "/users/{id}/workplaces - Get user workplaces",
  description: "UsersOnWorkplaces with workplace+org info. Self, MANAGER in shared org, or SUPERADMIN.",
  responses: {
    200: {
      description: "User workplaces retrieved",
      content: paginatedDocsJsonContent(userSchema)
    },
    ...docsErrorResponse(401, "Unauthorized"),
    ...docsErrorResponse(403, "Forbidden"),
    ...docsErrorResponse(404, "User not found"),
    ...docsErrorResponse(500, "Unexpected error")
  }
};

export const getUserTimelineDocs: DescribeRouteOptions = {
  tags: [USERS_TAG],
  summary: "/users/{id}/timeline - Get user activity timeline",
  description: "Merged and sorted event feed of attendance, payments, and assignments. Self or SUPERADMIN.",
  responses: {
    200: {
      description: "User timeline retrieved",
      content: docsJsonContent(userSchema.array())
    },
    ...docsErrorResponse(401, "Unauthorized"),
    ...docsErrorResponse(403, "Forbidden"),
    ...docsErrorResponse(404, "User not found"),
    ...docsErrorResponse(500, "Unexpected error")
  }
};

export const listSkillsDocs: DescribeRouteOptions = {
  tags: [USERS_TAG],
  summary: "/users/{id}/skills - List user skills",
  description: "Get all skills for a user. Self or SUPERADMIN.",
  responses: {
    200: {
      description: "Skills retrieved",
      content: docsJsonContent(userSkillSchema.array())
    },
    ...docsErrorResponse(401, "Unauthorized"),
    ...docsErrorResponse(403, "Forbidden"),
    ...docsErrorResponse(404, "User not found"),
    ...docsErrorResponse(500, "Unexpected error")
  }
};

export const createSkillDocs: DescribeRouteOptions = {
  tags: [USERS_TAG],
  summary: "/users/{id}/skills - Add a skill",
  description: "Add a skill to a user. Self or SUPERADMIN.",
  responses: {
    201: {
      description: "Skill created",
      content: docsJsonContent(userSkillSchema)
    },
    ...docsErrorResponse(400, "Invalid request body"),
    ...docsErrorResponse(401, "Unauthorized"),
    ...docsErrorResponse(403, "Forbidden"),
    ...docsErrorResponse(500, "Unexpected error")
  }
};

export const updateSkillDocs: DescribeRouteOptions = {
  tags: [USERS_TAG],
  summary: "/users/{id}/skills/{skillId} - Update a skill",
  description: "Update a user skill. Self or SUPERADMIN.",
  responses: {
    200: {
      description: "Skill updated",
      content: docsJsonContent(userSkillSchema)
    },
    ...docsErrorResponse(400, "Invalid request body"),
    ...docsErrorResponse(401, "Unauthorized"),
    ...docsErrorResponse(403, "Forbidden"),
    ...docsErrorResponse(404, "Skill not found"),
    ...docsErrorResponse(500, "Unexpected error")
  }
};

export const deleteSkillDocs: DescribeRouteOptions = {
  tags: [USERS_TAG],
  summary: "/users/{id}/skills/{skillId} - Delete a skill",
  description: "Delete a user skill. Self or SUPERADMIN.",
  responses: {
    200: {
      description: "Skill deleted",
      content: docsJsonContent(userSkillSchema)
    },
    ...docsErrorResponse(401, "Unauthorized"),
    ...docsErrorResponse(403, "Forbidden"),
    ...docsErrorResponse(404, "Skill not found"),
    ...docsErrorResponse(500, "Unexpected error")
  }
};

export const listDocumentsDocs: DescribeRouteOptions = {
  tags: [USERS_TAG],
  summary: "/users/{id}/documents - List user documents",
  description: "Get all uploaded documents for a user. Self or SUPERADMIN.",
  responses: {
    200: {
      description: "Documents retrieved",
      content: docsJsonContent(userDocumentSchema.array())
    },
    ...docsErrorResponse(401, "Unauthorized"),
    ...docsErrorResponse(403, "Forbidden"),
    ...docsErrorResponse(500, "Unexpected error")
  }
};

export const uploadDocumentDocs: DescribeRouteOptions = {
  tags: [USERS_TAG],
  summary: "/users/{id}/documents - Upload a document",
  description: "Upload a document file. Accepts multipart/form-data. File stored in Cloudinary. Self or SUPERADMIN.",
  responses: {
    201: {
      description: "Document uploaded",
      content: docsJsonContent(userDocumentSchema)
    },
    ...docsErrorResponse(400, "Invalid file or metadata"),
    ...docsErrorResponse(401, "Unauthorized"),
    ...docsErrorResponse(403, "Forbidden"),
    ...docsErrorResponse(500, "Unexpected error")
  }
};

export const deleteDocumentDocs: DescribeRouteOptions = {
  tags: [USERS_TAG],
  summary: "/users/{id}/documents/{docId} - Delete a document",
  description: "Delete a document from DB and Cloudinary. Self or SUPERADMIN.",
  responses: {
    200: {
      description: "Document deleted",
      content: docsJsonContent(userDocumentSchema)
    },
    ...docsErrorResponse(401, "Unauthorized"),
    ...docsErrorResponse(403, "Forbidden"),
    ...docsErrorResponse(404, "Document not found"),
    ...docsErrorResponse(500, "Unexpected error")
  }
};

export const listContactsDocs: DescribeRouteOptions = {
  tags: [USERS_TAG],
  summary: "/users/{id}/emergency-contacts - List emergency contacts",
  description: "Get all emergency contacts for a user. Self or SUPERADMIN.",
  responses: {
    200: {
      description: "Contacts retrieved",
      content: docsJsonContent(emergencyContactSchema.array())
    },
    ...docsErrorResponse(401, "Unauthorized"),
    ...docsErrorResponse(403, "Forbidden"),
    ...docsErrorResponse(500, "Unexpected error")
  }
};

export const createContactDocs: DescribeRouteOptions = {
  tags: [USERS_TAG],
  summary: "/users/{id}/emergency-contacts - Add emergency contact",
  description: "Add an emergency contact. If isPrimary=true, clears other primary contacts. Self or SUPERADMIN.",
  responses: {
    201: {
      description: "Contact created",
      content: docsJsonContent(emergencyContactSchema)
    },
    ...docsErrorResponse(400, "Invalid request body"),
    ...docsErrorResponse(401, "Unauthorized"),
    ...docsErrorResponse(403, "Forbidden"),
    ...docsErrorResponse(500, "Unexpected error")
  }
};

export const updateContactDocs: DescribeRouteOptions = {
  tags: [USERS_TAG],
  summary: "/users/{id}/emergency-contacts/{contactId} - Update emergency contact",
  description: "Update an emergency contact. Primary swap runs in a transaction. Self or SUPERADMIN.",
  responses: {
    200: {
      description: "Contact updated",
      content: docsJsonContent(emergencyContactSchema)
    },
    ...docsErrorResponse(400, "Invalid request body"),
    ...docsErrorResponse(401, "Unauthorized"),
    ...docsErrorResponse(403, "Forbidden"),
    ...docsErrorResponse(404, "Contact not found"),
    ...docsErrorResponse(500, "Unexpected error")
  }
};

export const deleteContactDocs: DescribeRouteOptions = {
  tags: [USERS_TAG],
  summary: "/users/{id}/emergency-contacts/{contactId} - Delete emergency contact",
  description: "Delete an emergency contact. Self or SUPERADMIN.",
  responses: {
    200: {
      description: "Contact deleted",
      content: docsJsonContent(emergencyContactSchema)
    },
    ...docsErrorResponse(401, "Unauthorized"),
    ...docsErrorResponse(403, "Forbidden"),
    ...docsErrorResponse(404, "Contact not found"),
    ...docsErrorResponse(500, "Unexpected error")
  }
};

export const bulkImportUsersDocs: DescribeRouteOptions = {
  tags: [USERS_TAG],
  summary: "/users/bulk-import - Bulk import users",
  description: "Upload CSV or XLSX to create users. Upserts by email; skips existing. SUPERADMIN only.",
  responses: {
    200: {
      description: "Bulk import completed",
      content: docsJsonContent(userSchema.array())
    },
    ...docsErrorResponse(400, "Invalid file format"),
    ...docsErrorResponse(401, "Unauthorized"),
    ...docsErrorResponse(403, "Forbidden - SUPERADMIN only"),
    ...docsErrorResponse(500, "Unexpected error")
  }
};

export const exportUsersDocs: DescribeRouteOptions = {
  tags: [USERS_TAG],
  summary: "/users/export - Export users",
  description: "Download users as CSV or XLSX. SUPERADMIN or MANAGER in orgId.",
  responses: {
    200: {
      description: "File download with Content-Disposition header"
    },
    ...docsErrorResponse(400, "Invalid query parameters"),
    ...docsErrorResponse(401, "Unauthorized"),
    ...docsErrorResponse(403, "Forbidden"),
    ...docsErrorResponse(500, "Unexpected error")
  }
};
