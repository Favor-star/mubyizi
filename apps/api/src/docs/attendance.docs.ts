import type { DescribeRouteOptions } from "hono-openapi";
import { ATTENDANCE_TAG } from "../_constants/index.js";
import { docsErrorResponse, docsJsonContent, paginatedDocsJsonContent } from "../helpers/docs.helper.js";
import { attendanceSchema } from "../schemas/attendance.schema.js";

export const listAttendanceDocs: DescribeRouteOptions = {
  tags: [ATTENDANCE_TAG],
  summary: "/orgs/{orgId}/attendance - List attendance records",
  description: "Retrieve paginated attendance records for an organization, with optional filters.",
  responses: {
    200: {
      description: "Attendance records retrieved successfully",
      content: paginatedDocsJsonContent(attendanceSchema)
    },
    ...docsErrorResponse(400, "Invalid query parameters"),
    ...docsErrorResponse(401, "Unauthorized"),
    ...docsErrorResponse(403, "Forbidden - Insufficient organization privileges"),
    ...docsErrorResponse(500, "Unexpected error")
  }
};

export const markAttendanceDocs: DescribeRouteOptions = {
  tags: [ATTENDANCE_TAG],
  summary: "/orgs/{orgId}/attendance - Mark attendance for a worker",
  description: "Create or update an attendance record for a worker. Upserts on (userId, date, workplaceId).",
  responses: {
    200: {
      description: "Attendance marked successfully",
      content: docsJsonContent(attendanceSchema)
    },
    ...docsErrorResponse(400, "Invalid request body or user not in org"),
    ...docsErrorResponse(401, "Unauthorized"),
    ...docsErrorResponse(403, "Forbidden - Insufficient organization privileges"),
    ...docsErrorResponse(500, "Unexpected error")
  }
};

export const updateAttendanceDocs: DescribeRouteOptions = {
  tags: [ATTENDANCE_TAG],
  summary: "/orgs/{orgId}/attendance/{id} - Update an attendance record",
  description: "Partially update an existing attendance record within the organization.",
  responses: {
    200: {
      description: "Attendance updated successfully",
      content: docsJsonContent(attendanceSchema)
    },
    ...docsErrorResponse(400, "Invalid request body or attendance ID"),
    ...docsErrorResponse(401, "Unauthorized"),
    ...docsErrorResponse(403, "Forbidden - Insufficient organization privileges"),
    ...docsErrorResponse(404, "Attendance record not found"),
    ...docsErrorResponse(500, "Unexpected error")
  }
};

export const deleteAttendanceDocs: DescribeRouteOptions = {
  tags: [ATTENDANCE_TAG],
  summary: "/orgs/{orgId}/attendance/{id} - Delete an attendance record",
  description: "Permanently delete an attendance record. Requires ADMIN role.",
  responses: {
    200: {
      description: "Attendance record deleted successfully",
      content: docsJsonContent(attendanceSchema)
    },
    ...docsErrorResponse(400, "Invalid attendance ID"),
    ...docsErrorResponse(401, "Unauthorized"),
    ...docsErrorResponse(403, "Forbidden - Insufficient organization privileges"),
    ...docsErrorResponse(404, "Attendance record not found"),
    ...docsErrorResponse(500, "Unexpected error")
  }
};

export const bulkMarkAttendanceDocs: DescribeRouteOptions = {
  tags: [ATTENDANCE_TAG],
  summary: "/orgs/{orgId}/attendance/bulk - Bulk mark attendance",
  description: "Mark attendance for multiple workers at once. All userIds must be org members. Max 200 records.",
  responses: {
    200: {
      description: "Bulk attendance marked successfully",
      content: docsJsonContent(attendanceSchema.array())
    },
    ...docsErrorResponse(400, "Invalid body or users not in org"),
    ...docsErrorResponse(401, "Unauthorized"),
    ...docsErrorResponse(403, "Forbidden - Insufficient organization privileges"),
    ...docsErrorResponse(500, "Unexpected error")
  }
};

export const exportAttendanceDocs: DescribeRouteOptions = {
  tags: [ATTENDANCE_TAG],
  summary: "/orgs/{orgId}/attendance/export - Export attendance data",
  description: "Download attendance records as CSV or XLSX file.",
  responses: {
    200: {
      description: "File download with Content-Disposition header"
    },
    ...docsErrorResponse(400, "Invalid query parameters"),
    ...docsErrorResponse(401, "Unauthorized"),
    ...docsErrorResponse(403, "Forbidden - Insufficient organization privileges"),
    ...docsErrorResponse(500, "Unexpected error")
  }
};

export const approveAttendanceDocs: DescribeRouteOptions = {
  tags: [ATTENDANCE_TAG],
  summary: "/orgs/{orgId}/attendance/{id}/approve - Approve attendance",
  description: "Approve a pending attendance record.",
  responses: {
    200: {
      description: "Attendance approved successfully",
      content: docsJsonContent(attendanceSchema)
    },
    ...docsErrorResponse(400, "Invalid attendance ID"),
    ...docsErrorResponse(401, "Unauthorized"),
    ...docsErrorResponse(403, "Forbidden - Insufficient organization privileges"),
    ...docsErrorResponse(404, "Attendance record not found"),
    ...docsErrorResponse(500, "Unexpected error")
  }
};

export const rejectAttendanceDocs: DescribeRouteOptions = {
  tags: [ATTENDANCE_TAG],
  summary: "/orgs/{orgId}/attendance/{id}/reject - Reject attendance",
  description: "Reject an attendance record with a reason.",
  responses: {
    200: {
      description: "Attendance rejected successfully",
      content: docsJsonContent(attendanceSchema)
    },
    ...docsErrorResponse(400, "Invalid body or attendance ID"),
    ...docsErrorResponse(401, "Unauthorized"),
    ...docsErrorResponse(403, "Forbidden - Insufficient organization privileges"),
    ...docsErrorResponse(404, "Attendance record not found"),
    ...docsErrorResponse(500, "Unexpected error")
  }
};

export const pendingApprovalDocs: DescribeRouteOptions = {
  tags: [ATTENDANCE_TAG],
  summary: "/orgs/{orgId}/attendance/pending-approval - List pending approvals",
  description: "Retrieve attendance records awaiting approval in the organization.",
  responses: {
    200: {
      description: "Pending attendance records retrieved",
      content: paginatedDocsJsonContent(attendanceSchema)
    },
    ...docsErrorResponse(400, "Invalid query parameters"),
    ...docsErrorResponse(401, "Unauthorized"),
    ...docsErrorResponse(403, "Forbidden - Insufficient organization privileges"),
    ...docsErrorResponse(500, "Unexpected error")
  }
};

export const clockInDocs: DescribeRouteOptions = {
  tags: [ATTENDANCE_TAG],
  summary: "/attendance/clock-in - Self-service clock in",
  description: "Worker clocks in to a workplace. Optional GPS coordinates and photo upload to Cloudinary.",
  responses: {
    200: {
      description: "Clocked in successfully",
      content: docsJsonContent(attendanceSchema)
    },
    ...docsErrorResponse(400, "Already clocked in or invalid workplace"),
    ...docsErrorResponse(401, "Unauthorized"),
    ...docsErrorResponse(403, "Not assigned to this workplace"),
    ...docsErrorResponse(500, "Unexpected error")
  }
};

export const clockOutDocs: DescribeRouteOptions = {
  tags: [ATTENDANCE_TAG],
  summary: "/attendance/clock-out - Self-service clock out",
  description: "Worker clocks out. Calculates hoursWorked and amountEarned (pro-rated on 8h shift).",
  responses: {
    200: {
      description: "Clocked out successfully",
      content: docsJsonContent(attendanceSchema)
    },
    ...docsErrorResponse(400, "No clock-in found or already clocked out"),
    ...docsErrorResponse(401, "Unauthorized"),
    ...docsErrorResponse(500, "Unexpected error")
  }
};

export const attendanceStatusDocs: DescribeRouteOptions = {
  tags: [ATTENDANCE_TAG],
  summary: "/attendance/status - Today's attendance status",
  description: "Get today's attendance records across all workplaces for the calling user.",
  responses: {
    200: {
      description: "Today's attendance status retrieved",
      content: docsJsonContent(attendanceSchema.array())
    },
    ...docsErrorResponse(401, "Unauthorized"),
    ...docsErrorResponse(500, "Unexpected error")
  }
};

export const generateQrDocs: DescribeRouteOptions = {
  tags: [ATTENDANCE_TAG],
  summary: "/attendance/qr/generate - Generate QR code for check-in",
  description: "Generate a signed HMAC QR token for kiosk attendance. Requires SUPERVISOR+ role at the workplace.",
  responses: {
    200: {
      description: "QR code generated successfully"
    },
    ...docsErrorResponse(400, "Invalid workplace or insufficient role"),
    ...docsErrorResponse(401, "Unauthorized"),
    ...docsErrorResponse(403, "Forbidden - Insufficient workplace privileges"),
    ...docsErrorResponse(500, "Unexpected error")
  }
};

export const scanQrDocs: DescribeRouteOptions = {
  tags: [ATTENDANCE_TAG],
  summary: "/attendance/qr/scan - Scan QR code to clock in",
  description: "Worker scans a QR code to clock in. Token is verified (HMAC + expiry) without DB lookup.",
  responses: {
    200: {
      description: "QR check-in successful",
      content: docsJsonContent(attendanceSchema)
    },
    ...docsErrorResponse(400, "Invalid or expired QR token"),
    ...docsErrorResponse(401, "Unauthorized"),
    ...docsErrorResponse(403, "Not assigned to this workplace"),
    ...docsErrorResponse(500, "Unexpected error")
  }
};

export const workplaceSheetDocs: DescribeRouteOptions = {
  tags: [ATTENDANCE_TAG],
  summary: "/orgs/{orgId}/workplaces/{workplaceId}/attendance/sheet - Bulk sheet entry",
  description: "Submit a daily attendance sheet for a specific workplace. All userIds must be assigned to this workplace.",
  responses: {
    200: {
      description: "Attendance sheet submitted successfully",
      content: docsJsonContent(attendanceSchema.array())
    },
    ...docsErrorResponse(400, "Invalid body or users not in workplace"),
    ...docsErrorResponse(401, "Unauthorized"),
    ...docsErrorResponse(403, "Forbidden - Insufficient privileges"),
    ...docsErrorResponse(500, "Unexpected error")
  }
};
