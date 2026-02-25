import { Hono } from "hono";
import { describeRoute } from "hono-openapi";
import { ApprovalStatus } from "../lib/generated/prisma/enums.js";
import { type HonoInstanceContext } from "../_types/index.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { customValidator } from "../helpers/validation.helpers.js";
import { apiErrorResponse, apiSuccessResponse, handleAPiError } from "../helpers/api.helper.js";
import withPrisma from "../lib/prisma-client.js";
import { clockInSchema, clockOutSchema } from "../schemas/attendance.schema.js";
import { uploadToCloudinary } from "../lib/cloudinary.js";
import { clockInDocs, clockOutDocs, attendanceStatusDocs } from "../docs/attendance.docs.js";

const selfAttendanceRoutes = new Hono<HonoInstanceContext>()
  .use(withPrisma)
  // POST /attendance/clock-in
  .post(
    "/clock-in",
    requireAuth(),
    customValidator("json", clockInSchema),
    describeRoute(clockInDocs),
    async (c) => {
      try {
        const prisma = c.get("prisma");
        const currentUser = c.get("user")!;
        const { workplaceId, latitude, longitude, photoBase64, notes } = c.req.valid("json");

        // Verify worker is assigned to workplace
        const assignment = await prisma.usersOnWorkplaces.findUnique({
          where: { userId_workplaceId: { userId: currentUser.id, workplaceId } }
        });
        if (!assignment || !assignment.isActive) {
          return c.json(apiErrorResponse("FORBIDDEN", "You are not assigned to this workplace"), 403);
        }

        // Check already clocked in today
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);

        const existing = await prisma.attendance.findFirst({
          where: {
            userId: currentUser.id,
            workplaceId,
            date: { gte: todayStart, lte: todayEnd }
          }
        });
        if (existing?.checkIn) {
          return c.json(apiErrorResponse("ALREADY_CLOCKED_IN", "You have already clocked in today"), 400);
        }

        // Upload photo if provided
        let photoUrl: string | undefined;
        if (photoBase64) {
          const result = await uploadToCloudinary(photoBase64, `attendance-photos/${workplaceId}`);
          photoUrl = result.url;
        }

        const now = new Date();
        const record = await prisma.attendance.upsert({
          where: {
            userId_date_workplaceId: {
              userId: currentUser.id,
              date: todayStart,
              workplaceId
            }
          },
          update: {
            checkIn: now,
            latitude,
            longitude,
            photoUrl,
            notes,
            approvalStatus: ApprovalStatus.PENDING
          },
          create: {
            userId: currentUser.id,
            workplaceId,
            date: todayStart,
            checkIn: now,
            latitude,
            longitude,
            photoUrl,
            notes,
            approvalStatus: ApprovalStatus.PENDING
          }
        });
        return c.json(apiSuccessResponse(record, "Clocked in successfully"), 200);
      } catch (error) {
        return handleAPiError(error, "Unexpected error during clock-in");
      }
    }
  )
  // POST /attendance/clock-out
  .post(
    "/clock-out",
    requireAuth(),
    customValidator("json", clockOutSchema),
    describeRoute(clockOutDocs),
    async (c) => {
      try {
        const prisma = c.get("prisma");
        const currentUser = c.get("user")!;
        const { workplaceId, latitude, longitude } = c.req.valid("json");

        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);

        const record = await prisma.attendance.findFirst({
          where: {
            userId: currentUser.id,
            workplaceId,
            date: { gte: todayStart, lte: todayEnd }
          }
        });

        if (!record || !record.checkIn) {
          return c.json(apiErrorResponse("NOT_CLOCKED_IN", "No clock-in record found for today"), 400);
        }
        if (record.checkOut) {
          return c.json(apiErrorResponse("ALREADY_CLOCKED_OUT", "You have already clocked out today"), 400);
        }

        const now = new Date();
        const hoursWorked = (now.getTime() - record.checkIn.getTime()) / 3_600_000;

        // Get daily rate from assignment or existing record
        const dailyRate = record.dailyRate;
        const amountEarned = dailyRate != null ? (hoursWorked / 8) * dailyRate : null;

        const updated = await prisma.attendance.update({
          where: { id: record.id },
          data: {
            checkOut: now,
            hoursWorked,
            amountEarned,
            ...(latitude !== undefined && { latitude }),
            ...(longitude !== undefined && { longitude })
          }
        });
        return c.json(apiSuccessResponse(updated, "Clocked out successfully"), 200);
      } catch (error) {
        return handleAPiError(error, "Unexpected error during clock-out");
      }
    }
  )
  // GET /attendance/status
  .get(
    "/status",
    requireAuth(),
    describeRoute(attendanceStatusDocs),
    async (c) => {
      try {
        const prisma = c.get("prisma");
        const currentUser = c.get("user")!;

        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);

        const records = await prisma.attendance.findMany({
          where: {
            userId: currentUser.id,
            date: { gte: todayStart, lte: todayEnd }
          },
          include: {
            workplace: { select: { id: true, name: true } }
          }
        });
        return c.json(apiSuccessResponse(records, "Today's attendance status retrieved"), 200);
      } catch (error) {
        return handleAPiError(error, "Unexpected error retrieving attendance status");
      }
    }
  );

export default selfAttendanceRoutes;
