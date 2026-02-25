import { Hono } from "hono";
import { describeRoute } from "hono-openapi";
import { ApprovalStatus, OrgRole, WorkplaceRole } from "../lib/generated/prisma/enums.js";
import { type HonoInstanceContext } from "../_types/index.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { requireOrgRole, requireWorkplaceRole } from "../middlewares/roles.middleware.js";
import { customValidator } from "../helpers/validation.helpers.js";
import { apiErrorResponse, apiSuccessResponse, handleAPiError } from "../helpers/api.helper.js";
import withPrisma from "../lib/prisma-client.js";
import { workplaceSheetSchema } from "../schemas/attendance.schema.js";
import { organizationParamsSchema } from "../schemas/orgs.schema.js";
import { workplaceParamsSchema } from "../schemas/workplace.schema.js";
import { workplaceSheetDocs } from "../docs/attendance.docs.js";

const workplaceAttendanceRoutes = new Hono<HonoInstanceContext>()
  .use(withPrisma)
  // POST /orgs/:orgId/workplaces/:workplaceId/attendance/sheet
  .post(
    "/sheet",
    requireAuth(),
    customValidator("param", workplaceParamsSchema.extend(organizationParamsSchema.shape)),
    customValidator("json", workplaceSheetSchema),
    requireOrgRole(OrgRole.MANAGER),
    requireWorkplaceRole(WorkplaceRole.SUPERVISOR),
    describeRoute(workplaceSheetDocs),
    async (c) => {
      try {
        const prisma = c.get("prisma");
        const currentUser = c.get("user")!;
        const { workplaceId } = c.req.valid("param");
        const { date, records } = c.req.valid("json");

        // Verify all users are assigned to this specific workplace
        const userIds = records.map((r) => r.userId);
        const assignments = await prisma.usersOnWorkplaces.findMany({
          where: { workplaceId, userId: { in: userIds }, isActive: true },
          select: { userId: true }
        });
        const assignedIds = new Set(assignments.map((a) => a.userId));
        const notAssigned = userIds.filter((id) => !assignedIds.has(id));
        if (notAssigned.length > 0) {
          return c.json(
            apiErrorResponse(notAssigned, "Some users are not assigned to this workplace"),
            400
          );
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
        return c.json(apiSuccessResponse(upserted, `${upserted.length} attendance records saved for workplace sheet`), 200);
      } catch (error) {
        return handleAPiError(error, "Unexpected error saving workplace attendance sheet");
      }
    }
  );

export default workplaceAttendanceRoutes;
