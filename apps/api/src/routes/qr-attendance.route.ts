import { Hono } from "hono";
import { describeRoute } from "hono-openapi";
import { ApprovalStatus, WorkplaceRole } from "../lib/generated/prisma/enums.js";
import { type HonoInstanceContext } from "../_types/index.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { customValidator } from "../helpers/validation.helpers.js";
import { apiErrorResponse, apiSuccessResponse, handleAPiError } from "../helpers/api.helper.js";
import withPrisma from "../lib/prisma-client.js";
import { generateQrSchema, scanQrSchema } from "../schemas/attendance.schema.js";
import { generateQrToken, generateQrImage, verifyQrToken } from "../lib/qr.js";
import { uploadToCloudinary } from "../lib/cloudinary.js";
import { WORKPLACE_ROLE_WEIGHT } from "../_constants/role-weights.constants.js";
import { generateQrDocs, scanQrDocs } from "../docs/attendance.docs.js";

const qrAttendanceRoutes = new Hono<HonoInstanceContext>()
  .use(withPrisma)
  // POST /attendance/qr/generate
  .post(
    "/generate",
    requireAuth(),
    customValidator("json", generateQrSchema),
    describeRoute(generateQrDocs),
    async (c) => {
      try {
        const prisma = c.get("prisma");
        const currentUser = c.get("user")!;
        const { workplaceId, date } = c.req.valid("json");

        // Check SUPERVISOR+ role at the workplace (in handler — not middleware)
        const assignment = await prisma.usersOnWorkplaces.findUnique({
          where: { userId_workplaceId: { userId: currentUser.id, workplaceId } }
        });
        const userWeight = assignment ? WORKPLACE_ROLE_WEIGHT[assignment.workplaceRole] : 0;
        const requiredWeight = WORKPLACE_ROLE_WEIGHT[WorkplaceRole.SUPERVISOR];

        if (userWeight < requiredWeight) {
          return c.json(
            apiErrorResponse("FORBIDDEN", "You need at least SUPERVISOR role to generate QR codes for this workplace"),
            403
          );
        }

        const token = generateQrToken(workplaceId, date);
        const qrImageDataUrl = await generateQrImage(token);

        // Calculate expiry (end of target date)
        const truncatedDate = date?.slice(0, 10) ?? new Date().toISOString().slice(0, 10);
        const expiresAt = new Date(`${truncatedDate}T23:59:59.999Z`);
        return c.json(
          apiSuccessResponse(
            { token, qrImageDataUrl, workplaceId, date: new Date(date ?? new Date()), expiresAt },
            "QR code generated"
          ),
          200
        );
      } catch (error) {
        return handleAPiError(error, "Unexpected error generating QR code");
      }
    }
  )
  // POST /attendance/qr/scan
  .post("/scan", requireAuth(), customValidator("json", scanQrSchema), describeRoute(scanQrDocs), async (c) => {
    try {
      const prisma = c.get("prisma");
      const currentUser = c.get("user")!;
      const { token, latitude, longitude, photoBase64 } = c.req.valid("json");

      const payload = verifyQrToken(token);
      if (!payload) {
        return c.json(apiErrorResponse("INVALID_TOKEN", "QR token is invalid or has expired"), 400);
      }

      const { workplaceId, date } = payload;

      // Verify worker is assigned to workplace
      const assignment = await prisma.usersOnWorkplaces.findUnique({
        where: { userId_workplaceId: { userId: currentUser.id, workplaceId } }
      });
      if (!assignment?.isActive) {
        return c.json(apiErrorResponse("FORBIDDEN", "You are not assigned to this workplace"), 403);
      }

      // Check already clocked in
      const targetDate = new Date(date);
      targetDate.setHours(0, 0, 0, 0);

      const existing = await prisma.attendance.findFirst({
        where: { userId: currentUser.id, workplaceId, date: targetDate }
      });
      if (existing?.checkIn) {
        return c.json(apiErrorResponse("ALREADY_CLOCKED_IN", "You have already clocked in for this date"), 400);
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
          userId_date_workplaceId: { userId: currentUser.id, date: targetDate, workplaceId }
        },
        update: {
          checkIn: now,
          latitude,
          longitude,
          photoUrl,
          approvalStatus: ApprovalStatus.PENDING
        },
        create: {
          userId: currentUser.id,
          workplaceId,
          date: targetDate,
          checkIn: now,
          latitude,
          longitude,
          photoUrl,
          approvalStatus: ApprovalStatus.PENDING
        }
      });
      return c.json(apiSuccessResponse(record, "QR check-in successful"), 200);
    } catch (error) {
      return handleAPiError(error, "Unexpected error during QR scan");
    }
  });

export default qrAttendanceRoutes;
