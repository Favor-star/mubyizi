import { Hono } from "hono";
import { describeRoute } from "hono-openapi";
import { OrgRole, ApprovalStatus } from "../lib/generated/prisma/enums.js";
import { type HonoInstanceContext } from "../_types/index.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { requireOrgRole } from "../middlewares/roles.middleware.js";
import { customValidator } from "../helpers/validation.helpers.js";
import { apiErrorResponse, apiSuccessResponse, handleAPiError } from "../helpers/api.helper.js";
import { buildPaginationMeta, getPagination } from "../helpers/pagination.helper.js";
import withPrisma from "../lib/prisma-client.js";
import {
  attendanceQuerySchema,
  attendanceParamsSchema,
  markAttendanceSchema,
  updateAttendanceSchema,
  bulkMarkAttendanceSchema,
  exportQuerySchema,
  rejectAttendanceSchema
} from "../schemas/attendance.schema.js";
import { organizationParamsSchema } from "../schemas/orgs.schema.js";
import {
  listAttendanceDocs,
  markAttendanceDocs,
  updateAttendanceDocs,
  deleteAttendanceDocs,
  bulkMarkAttendanceDocs,
  exportAttendanceDocs,
  approveAttendanceDocs,
  rejectAttendanceDocs,
  pendingApprovalDocs
} from "../docs/attendance.docs.js";

const attendanceRoutes = new Hono<HonoInstanceContext>()
  .use(withPrisma)
  // GET /orgs/:orgId/attendance
  .get(
    "/",
    requireAuth(),
    customValidator("param", organizationParamsSchema),
    customValidator("query", attendanceQuerySchema),
    requireOrgRole(OrgRole.MANAGER),
    describeRoute(listAttendanceDocs),
    async (c) => {
      try {
        const prisma = c.get("prisma");
        const { orgId } = c.req.valid("param");
        const query = c.req.valid("query");
        const { skip, take, page, limit, workplaceId, userId, status, approvalStatus, dateFrom, dateTo, isPaid } =
          getPagination(query) as ReturnType<typeof getPagination> & typeof query;

        const where = {
          workplace: { orgId },
          ...(workplaceId && { workplaceId }),
          ...(userId && { userId }),
          ...(status && { status }),
          ...(approvalStatus && { approvalStatus }),
          ...(isPaid !== undefined && { isPaid }),
          ...(dateFrom || dateTo
            ? {
                date: {
                  ...(dateFrom && { gte: new Date(dateFrom) }),
                  ...(dateTo && { lte: new Date(dateTo) })
                }
              }
            : {})
        };

        const [records, total] = await Promise.all([
          prisma.attendance.findMany({ where, skip, take, orderBy: { date: "desc" } }),
          prisma.attendance.count({ where })
        ]);
        return c.json(
          apiSuccessResponse(
            { items: records, meta: buildPaginationMeta(page, limit, total) },
            "Attendance records retrieved"
          ),
          200
        );
      } catch (error) {
        return handleAPiError(error, "Unexpected error retrieving attendance records");
      }
    }
  )
  // GET /orgs/:orgId/attendance/pending-approval
  .get(
    "/pending-approval",
    requireAuth(),
    customValidator("param", organizationParamsSchema),
    customValidator("query", attendanceQuerySchema),
    requireOrgRole(OrgRole.MANAGER),
    describeRoute(pendingApprovalDocs),
    async (c) => {
      try {
        const prisma = c.get("prisma");
        const { orgId } = c.req.valid("param");
        const query = c.req.valid("query");
        const { skip, take, page, limit } = getPagination(query);

        const where = {
          workplace: { orgId },
          approvalStatus: ApprovalStatus.PENDING
        };
        const [records, total] = await Promise.all([
          prisma.attendance.findMany({ where, skip, take, orderBy: { date: "desc" } }),
          prisma.attendance.count({ where })
        ]);
        return c.json(
          apiSuccessResponse(
            { items: records, meta: buildPaginationMeta(page, limit, total) },
            "Pending approval records retrieved"
          ),
          200
        );
      } catch (error) {
        return handleAPiError(error, "Unexpected error retrieving pending approval records");
      }
    }
  )
  // POST /orgs/:orgId/attendance
  .post(
    "/",
    requireAuth(),
    customValidator("param", organizationParamsSchema),
    customValidator("json", markAttendanceSchema),
    requireOrgRole(OrgRole.MANAGER),
    describeRoute(markAttendanceDocs),
    async (c) => {
      try {
        const prisma = c.get("prisma");
        const currentUser = c.get("user")!;
        const { orgId } = c.req.valid("param");
        const data = c.req.valid("json");

        // Verify worker is an org member
        const membership = await prisma.orgMembership.findFirst({
          where: { userId: data.userId, orgId }
        });
        if (!membership) {
          return c.json(apiErrorResponse("NOT_MEMBER", "The specified user is not a member of this organization"), 400);
        }

        const record = await prisma.attendance.upsert({
          where: {
            userId_date_workplaceId: {
              userId: data.userId,
              date: new Date(data.date),
              workplaceId: data.workplaceId
            }
          },
          update: {
            status: data.status,
            shiftLabel: data.shiftLabel,
            dailyRate: data.dailyRate,
            notes: data.notes,
            approvedBy: currentUser.id,
            approvedAt: new Date()
          },
          create: {
            userId: data.userId,
            workplaceId: data.workplaceId,
            date: new Date(data.date),
            status: data.status,
            shiftLabel: data.shiftLabel,
            dailyRate: data.dailyRate,
            notes: data.notes,
            approvedBy: currentUser.id,
            approvedAt: new Date(),
            approvalStatus: ApprovalStatus.APPROVED
          }
        });
        return c.json(apiSuccessResponse(record, "Attendance marked successfully"), 200);
      } catch (error) {
        return handleAPiError(error, "Unexpected error marking attendance");
      }
    }
  )
  // POST /orgs/:orgId/attendance/bulk
  .post(
    "/bulk",
    requireAuth(),
    customValidator("param", organizationParamsSchema),
    customValidator("json", bulkMarkAttendanceSchema),
    requireOrgRole(OrgRole.MANAGER),
    describeRoute(bulkMarkAttendanceDocs),
    async (c) => {
      try {
        const prisma = c.get("prisma");
        const currentUser = c.get("user")!;
        const { orgId } = c.req.valid("param");
        const { workplaceId, date, records } = c.req.valid("json");

        // Verify all users are org members
        const userIds = records.map((r) => r.userId);
        const memberships = await prisma.orgMembership.findMany({
          where: { orgId, userId: { in: userIds } },
          select: { userId: true }
        });
        const memberIds = new Set(memberships.map((m) => m.userId));
        const notMembers = userIds.filter((id) => !memberIds.has(id));
        if (notMembers.length > 0) {
          return c.json(apiErrorResponse(notMembers, "Some users are not members of this organization"), 400);
        }

        const upserted = await prisma.$transaction(
          records.map((r) =>
            prisma.attendance.upsert({
              where: {
                userId_date_workplaceId: {
                  userId: r.userId,
                  date: new Date(date),
                  workplaceId
                }
              },
              update: {
                status: r.status,
                shiftLabel: r.shiftLabel,
                dailyRate: r.dailyRate,
                notes: r.notes,
                approvedBy: currentUser.id,
                approvedAt: new Date()
              },
              create: {
                userId: r.userId,
                workplaceId,
                date: new Date(date),
                status: r.status,
                shiftLabel: r.shiftLabel,
                dailyRate: r.dailyRate,
                notes: r.notes,
                approvedBy: currentUser.id,
                approvedAt: new Date(),
                approvalStatus: ApprovalStatus.APPROVED
              }
            })
          )
        );
        return c.json(apiSuccessResponse(upserted, `${upserted.length} attendance records saved`), 200);
      } catch (error) {
        return handleAPiError(error, "Unexpected error in bulk attendance");
      }
    }
  )
  // GET /orgs/:orgId/attendance/export
  .get(
    "/export",
    requireAuth(),
    customValidator("param", organizationParamsSchema),
    customValidator("query", exportQuerySchema),
    requireOrgRole(OrgRole.MANAGER),
    describeRoute(exportAttendanceDocs),
    async (c) => {
      try {
        const prisma = c.get("prisma");
        const { orgId } = c.req.valid("param");
        const { workplaceId, userId, dateFrom, dateTo, format } = c.req.valid("query");

        const where = {
          workplace: { orgId },
          ...(workplaceId && { workplaceId }),
          ...(userId && { userId }),
          ...(dateFrom || dateTo
            ? {
                date: {
                  ...(dateFrom && { gte: new Date(dateFrom) }),
                  ...(dateTo && { lte: new Date(dateTo) })
                }
              }
            : {})
        };

        const records = await prisma.attendance.findMany({
          where,
          orderBy: { date: "desc" },
          include: { user: { select: { name: true, email: true } } }
        });

        const rows = records.map((r) => ({
          id: r.id,
          userName: r.user.name,
          userEmail: r.user.email ?? "",
          workplaceId: r.workplaceId ?? "",
          date: r.date.toISOString(),
          status: r.status,
          approvalStatus: r.approvalStatus,
          checkIn: r.checkIn?.toISOString() ?? "",
          checkOut: r.checkOut?.toISOString() ?? "",
          hoursWorked: r.hoursWorked ?? "",
          dailyRate: r.dailyRate ?? "",
          amountEarned: r.amountEarned ?? "",
          isPaid: r.isPaid,
          notes: r.notes ?? ""
        }));

        if (format === "xlsx") {
          const XLSX = await import("xlsx");
          const ws = XLSX.utils.json_to_sheet(rows);
          const wb = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, "Attendance");
          const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" }) as unknown as BodyInit;
          return new Response(buffer, {
            headers: {
              "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
              "Content-Disposition": `attachment; filename="attendance-${orgId}.xlsx"`
            }
          });
        }

        // CSV
        const headers = Object.keys(rows[0] ?? {}).join(",");
        const csvRows = rows.map((r) => Object.values(r).join(","));
        const csv = [headers, ...csvRows].join("\n");
        return new Response(csv, {
          headers: {
            "Content-Type": "text/csv",
            "Content-Disposition": `attachment; filename="attendance-${orgId}.csv"`
          }
        });
      } catch (error) {
        return handleAPiError(error, "Unexpected error exporting attendance");
      }
    }
  )
  // PATCH /orgs/:orgId/attendance/:id
  .patch(
    "/:id",
    requireAuth(),
    customValidator("param", attendanceParamsSchema.extend(organizationParamsSchema.shape)),
    customValidator("json", updateAttendanceSchema),
    requireOrgRole(OrgRole.MANAGER),
    describeRoute(updateAttendanceDocs),
    async (c) => {
      try {
        const prisma = c.get("prisma");
        const { id, orgId } = c.req.valid("param");
        const data = c.req.valid("json");

        // Verify record belongs to org
        const existing = await prisma.attendance.findFirst({
          where: { id, workplace: { orgId } }
        });
        if (!existing) {
          return c.json(apiErrorResponse("NOT_FOUND", "Attendance record not found in this organization"), 404);
        }

        const updated = await prisma.attendance.update({ where: { id }, data });
        return c.json(apiSuccessResponse(updated, "Attendance updated successfully"), 200);
      } catch (error) {
        return handleAPiError(error, "Unexpected error updating attendance");
      }
    }
  )
  // DELETE /orgs/:orgId/attendance/:id
  .delete(
    "/:id",
    requireAuth(),
    customValidator("param", attendanceParamsSchema.extend(organizationParamsSchema.shape)),
    requireOrgRole(OrgRole.ADMIN),
    describeRoute(deleteAttendanceDocs),
    async (c) => {
      try {
        const prisma = c.get("prisma");
        const { id, orgId } = c.req.valid("param");

        const existing = await prisma.attendance.findFirst({
          where: { id, workplace: { orgId } }
        });
        if (!existing) {
          return c.json(apiErrorResponse("NOT_FOUND", "Attendance record not found in this organization"), 404);
        }

        const deleted = await prisma.attendance.delete({ where: { id } });
        return c.json(apiSuccessResponse(deleted, "Attendance record deleted"), 200);
      } catch (error) {
        return handleAPiError(error, "Unexpected error deleting attendance");
      }
    }
  )
  // POST /orgs/:orgId/attendance/:id/approve
  .post(
    "/:id/approve",
    requireAuth(),
    customValidator("param", attendanceParamsSchema.extend(organizationParamsSchema.shape)),
    requireOrgRole(OrgRole.MANAGER),
    describeRoute(approveAttendanceDocs),
    async (c) => {
      try {
        const prisma = c.get("prisma");
        const currentUser = c.get("user")!;
        const { id, orgId } = c.req.valid("param");

        const existing = await prisma.attendance.findFirst({
          where: { id, workplace: { orgId } }
        });
        if (!existing) {
          return c.json(apiErrorResponse("NOT_FOUND", "Attendance record not found in this organization"), 404);
        }

        const approved = await prisma.attendance.update({
          where: { id },
          data: {
            approvalStatus: ApprovalStatus.APPROVED,
            approvedBy: currentUser.id,
            approvedAt: new Date(),
            rejectionReason: null,
            rejectedBy: null,
            rejectedAt: null
          }
        });
        return c.json(apiSuccessResponse(approved, "Attendance approved"), 200);
      } catch (error) {
        return handleAPiError(error, "Unexpected error approving attendance");
      }
    }
  )
  // POST /orgs/:orgId/attendance/:id/reject
  .post(
    "/:id/reject",
    requireAuth(),
    customValidator("param", attendanceParamsSchema.extend(organizationParamsSchema.shape)),
    customValidator("json", rejectAttendanceSchema),
    requireOrgRole(OrgRole.MANAGER),
    describeRoute(rejectAttendanceDocs),
    async (c) => {
      try {
        const prisma = c.get("prisma");
        const currentUser = c.get("user")!;
        const { id, orgId } = c.req.valid("param");
        const { rejectionReason } = c.req.valid("json");

        const existing = await prisma.attendance.findFirst({
          where: { id, workplace: { orgId } }
        });
        if (!existing) {
          return c.json(apiErrorResponse("NOT_FOUND", "Attendance record not found in this organization"), 404);
        }

        const rejected = await prisma.attendance.update({
          where: { id },
          data: {
            approvalStatus: ApprovalStatus.REJECTED,
            rejectionReason,
            rejectedBy: currentUser.id,
            rejectedAt: new Date(),
            approvedBy: null,
            approvedAt: null
          }
        });
        return c.json(apiSuccessResponse(rejected, "Attendance rejected"), 200);
      } catch (error) {
        return handleAPiError(error, "Unexpected error rejecting attendance");
      }
    }
  );

export default attendanceRoutes;
