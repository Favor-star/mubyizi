import { Hono } from "hono";
import { type HonoInstanceContext } from "../_types/index.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { requireOrgRole, requireWorkplaceRole } from "../middlewares/roles.middleware.js";
import { OrgRole, SystemRole, WorkplaceRole } from "../lib/generated/prisma/enums.js";
import withPrisma from "../lib/prisma-client.js";
import { customValidator } from "../helpers/validation.helpers.js";
import {
  addWorkersToWorkplaceSchema,
  createWorkplaceSchema,
  geofenceSchema,
  imageParamsSchema,
  setGeofenceSchema,
  updateWorkPlaceSchema,
  updateWorkerRoleSchema,
  uploadImageSchema,
  workplaceParamsSchema,
  workplaceQuerySchema,
  workerUserParamsSchema
} from "../schemas/workplace.schema.js";
import { paginationQuerySchema } from "../schemas/pagination.schema.js";
import { buildPaginationMeta, getPagination } from "../helpers/pagination.helper.js";
import { apiErrorResponse, apiSuccessResponse, handleAPiError } from "../helpers/api.helper.js";
import { hasMoreWorkplacePrivileges } from "../helpers/workplace.helper.js";
import { organizationParamsSchema } from "../schemas/orgs.schema.js";
import { describeRoute } from "hono-openapi";
import { getOrgWorkplacesDocs } from "../docs/orgs.docs.js";
import {
  assignWorkersDocs,
  createWorkplaceDocs,
  deleteGeofenceDocs,
  deleteWorkplaceDocs,
  deleteWorkplaceImageDocs,
  getActivityLogDocs,
  getGeofenceDocs,
  getSingleWorkplaceDocs,
  getWorkersOfWorkplaceDocs,
  getWorkplaceStatsDocs,
  setGeofenceDocs,
  unassignWorkerDocs,
  updateWorkerRoleDocs,
  updateWorkplaceDocs,
  uploadWorkplaceImageDocs,
  getWorkplaceImagesDocs
} from "../docs/workplaces.docs.js";
import { uploadToCloudinary, deleteFromCloudinary } from "../lib/cloudinary.js";
import { WORKPLACE_ROLE_WEIGHT } from "../_constants/role-weights.constants.js";

const workplaceRoutes = new Hono<HonoInstanceContext>()
  .use(withPrisma)
  .get(
    "/",
    requireAuth(),
    customValidator("param", organizationParamsSchema),
    customValidator("query", paginationQuerySchema),
    requireOrgRole(OrgRole.MEMBER),
    describeRoute(getOrgWorkplacesDocs),
    async (c) => {
      try {
        const { orgId } = c.req.valid("param");
        const prisma = c.get("prisma");
        const query = c.req.valid("query");
        const { skip, take, page, limit } = getPagination(query);
        const [workplaces, totalCount] = await Promise.all([
          prisma.workplace.findMany({
            where: {
              orgId
            },
            skip,
            take
          }),
          prisma.workplace.count({
            where: {
              orgId
            }
          })
        ]);
        return c.json(
          apiSuccessResponse(
            { items: workplaces, meta: buildPaginationMeta(page, limit, totalCount) },
            "Organization workplaces retrieved successfully"
          ),
          200
        );
      } catch (error) {
        return handleAPiError(error, "Unexpected error occurred while retrieving organization workplaces");
      }
    }
  )
  .post(
    "/",
    requireAuth(),
    customValidator("json", createWorkplaceSchema),
    customValidator("param", organizationParamsSchema),
    requireOrgRole(OrgRole.ADMIN),
    describeRoute(createWorkplaceDocs),
    async (c) => {
      try {
        const currentUser = c.get("user")!;
        const prisma = c.get("prisma");
        const data = c.req.valid("json");
        const orgId = c.req.valid("param").orgId;
        const workplace = await prisma.workplace.create({
          data: {
            ...data,
            orgId,
            workers: {
              create: {
                userId: currentUser.id,
                assignedById: currentUser.id,
                workplaceRole: WorkplaceRole.SUPERVISOR
              }
            }
          }
        });
        return c.json(apiSuccessResponse(workplace, "Workplace created successfully"), 201);
      } catch (error) {
        return handleAPiError(error, "Unexpected error creating workplace");
      }
    }
  )
  .get(
    ":workplaceId",
    requireAuth(),
    customValidator("param", workplaceParamsSchema.extend(organizationParamsSchema.shape)),
    describeRoute(getSingleWorkplaceDocs),
    async (c) => {
      try {
        const prisma = c.get("prisma");
        const { workplaceId, orgId } = c.req.valid("param");
        const workplace = await prisma.workplace.findUnique({
          where: {
            id: workplaceId,
            orgId
          }
        });
        if (!workplace) return c.json(apiErrorResponse("NOT_FOUND", "Workplace could not be found!"), 404);
        return c.json(apiSuccessResponse(workplace, "Workplace fetched successfully"), 200);
      } catch (error) {
        return handleAPiError(error, "Unexpected error while getting a workplace. Please try again!");
      }
    }
  )
  .patch(
    ":workplaceId",
    requireAuth(),
    requireOrgRole(OrgRole.ADMIN),
    customValidator("param", workplaceParamsSchema.extend(organizationParamsSchema.shape)),
    customValidator("query", workplaceQuerySchema),
    customValidator("json", updateWorkPlaceSchema),
    describeRoute(updateWorkplaceDocs),
    async (c) => {
      try {
        const prisma = c.get("prisma");
        const { workplaceId, orgId } = c.req.valid("param");
        const data = c.req.valid("json");
        const workplace = await prisma.workplace.update({
          where: { id: workplaceId, orgId },
          data
        });
        return c.json(apiSuccessResponse(workplace, "Workplace updated successfully!"), 200);
      } catch (error) {
        return handleAPiError(error, "Unexpected error occured while trying to update the workplace. Please try again");
      }
    }
  )
  .delete(
    ":workplaceId",
    requireAuth(),
    customValidator("param", workplaceParamsSchema.extend(organizationParamsSchema.shape)),
    customValidator("query", workplaceQuerySchema),
    requireOrgRole(OrgRole.ADMIN),
    describeRoute(deleteWorkplaceDocs),
    async (c) => {
      try {
        const prisma = c.get("prisma");
        const { workplaceId, orgId } = c.req.valid("param");
        const deletedWorkplace = await prisma.workplace.delete({
          where: { id: workplaceId, orgId }
        });
        return c.json(apiSuccessResponse(deletedWorkplace, "Workplace deleted successfully!"));
      } catch (error) {
        return handleAPiError(error, "Unexpected error occured while deleting workplace. Please try again!");
      }
    }
  )
  // ── IMAGES ────────────────────────────────────────────────────
  .get(
    ":workplaceId/images",
    requireAuth(),
    customValidator("param", workplaceParamsSchema.extend(organizationParamsSchema.shape)),
    requireWorkplaceRole(WorkplaceRole.WORKER),
    describeRoute(getWorkplaceImagesDocs),
    async (c) => {
      try {
        const prisma = c.get("prisma");
        const { workplaceId } = c.req.valid("param");
        const images = await prisma.workplaceImage.findMany({
          where: { workplaceId },
          orderBy: { createdAt: "desc" }
        });
        return c.json(apiSuccessResponse(images, "Workplace images retrieved successfully"), 200);
      } catch (error) {
        return handleAPiError(error, "Unexpected error retrieving workplace images");
      }
    }
  )
  .post(
    ":workplaceId/images",
    requireAuth(),
    customValidator("param", workplaceParamsSchema.extend(organizationParamsSchema.shape)),
    customValidator("form", uploadImageSchema),
    requireWorkplaceRole(WorkplaceRole.SUPERVISOR),
    describeRoute(uploadWorkplaceImageDocs),
    async (c) => {
      try {
        const prisma = c.get("prisma");
        const currentUser = c.get("user")!;
        const { workplaceId } = c.req.valid("param");
        const { image, description } = c.req.valid("form");
        const imageBuffer = Buffer.from(await image.arrayBuffer());
        const { url, publicId } = await uploadToCloudinary(imageBuffer, `workplace-images/${workplaceId}`);

        const imageRecord = await prisma.workplaceImage.create({
          data: {
            image: url,
            publicId,
            description,
            workplaceId,
            uploadedBy: currentUser.id
          }
        });
        return c.json(apiSuccessResponse(imageRecord, "Image uploaded successfully"), 201);
      } catch (error) {
        return handleAPiError(error, "Unexpected error uploading workplace image");
      }
    }
  )
  .delete(
    ":workplaceId/images/:imageId",
    requireAuth(),
    customValidator(
      "param",
      workplaceParamsSchema.extend(organizationParamsSchema.shape).extend(imageParamsSchema.shape)
    ),
    requireWorkplaceRole(WorkplaceRole.SUPERVISOR),
    describeRoute(deleteWorkplaceImageDocs),
    async (c) => {
      try {
        const prisma = c.get("prisma");
        const { workplaceId, imageId } = c.req.valid("param");

        const image = await prisma.workplaceImage.findUnique({
          where: { id: imageId }
        });
        if (!image || image.workplaceId !== workplaceId) {
          return c.json(apiErrorResponse("NOT_FOUND", "Image not found"), 404);
        }

        if (image.publicId) {
          await deleteFromCloudinary(image.publicId);
        }

        const deleted = await prisma.workplaceImage.delete({ where: { id: imageId } });
        return c.json(apiSuccessResponse(deleted, "Image deleted successfully"), 200);
      } catch (error) {
        return handleAPiError(error, "Unexpected error deleting workplace image");
      }
    }
  )
  // ── WORKERS ───────────────────────────────────────────────────
  .get(
    ":workplaceId/workers",
    requireAuth(),
    customValidator("param", workplaceParamsSchema.extend(organizationParamsSchema.shape)),
    customValidator("query", paginationQuerySchema),
    requireWorkplaceRole(WorkplaceRole.SUPERVISOR),
    describeRoute(getWorkersOfWorkplaceDocs),
    async (c) => {
      try {
        const prisma = c.get("prisma");
        const currentUser = c.get("user")!;
        const query = c.req.valid("query");
        const { limit, skip, take, page } = getPagination(query);
        const { workplaceId } = c.req.valid("param");

        // Get current membership
        const currentMembership = await prisma.usersOnWorkplaces.findFirst({
          where: {
            workplaceId,
            userId: currentUser.id,
            isActive: true
          }
        });

        const thisUserRole =
          currentUser.systemRole === SystemRole.SUPERADMIN
            ? WorkplaceRole.WORKPLACE_MANAGER
            : (currentMembership?.workplaceRole ?? WorkplaceRole.VISITOR);

        const allowedRoles = Object.values(WorkplaceRole).filter((role) =>
          hasMoreWorkplacePrivileges(thisUserRole, role)
        );
        const whereClause = {
          workplaceId,
          isActive: true,
          workplaceRole: {
            in: allowedRoles
          }
        };
        const [members, total] = await Promise.all([
          prisma.usersOnWorkplaces.findMany({
            where: whereClause,
            skip,
            take,
            select: {
              workplaceRole: true,
              isActive: true,
              user: {
                omit: {
                  lastLoginAt: true,
                  wageId: true,
                  systemRole: true,
                  updatedAt: true
                }
              },
              assignedBy: {
                select: {
                  name: true
                }
              }
            }
          }),
          prisma.usersOnWorkplaces.count({
            where: whereClause
          })
        ]);
        const workers = members.map((m) => ({
          ...m.user,
          workplaceRole: m.workplaceRole,
          isActive: m.isActive,
          assignedBy: m.assignedBy?.name ?? null
        }));

        return c.json(
          apiSuccessResponse(
            {
              items: workers,
              meta: buildPaginationMeta(page, limit, total)
            },
            "Workers fetched successfully!"
          ),
          200
        );
      } catch (error) {
        return handleAPiError(error, "Unexpected error occurred while fetching workers. Please try again!");
      }
    }
  )
  .post(
    ":workplaceId/workers",
    requireAuth(),
    customValidator("param", workplaceParamsSchema.extend(organizationParamsSchema.shape)),
    customValidator("json", addWorkersToWorkplaceSchema),
    requireWorkplaceRole(WorkplaceRole.SUPERVISOR),
    describeRoute(assignWorkersDocs),
    async (c) => {
      try {
        const prisma = c.get("prisma");
        const currentUser = c.get("user")!;
        const { workplaceId } = c.req.valid("param");
        const workers = c.req.valid("json");

        const existingUsers = await prisma.users.findMany({
          where: { id: { in: workers.map((w) => w.userId) } },
          select: { id: true }
        });
        const existingIds = new Set(existingUsers.map((u) => u.id));
        const invalid = workers.filter((w) => !existingIds.has(w.userId));

        if (invalid.length > 0) {
          return c.json(
            apiErrorResponse({ data: invalid }, "Some user IDs do not exist. Please verify and try again."),
            400
          );
        }

        const assigned = await prisma.usersOnWorkplaces.createMany({
          data: workers.map((w) => ({
            userId: w.userId,
            workplaceRole: w.workplaceRole,
            workplaceId,
            assignedById: currentUser.id
          })),
          skipDuplicates: true
        });
        return c.json(apiSuccessResponse(assigned, `${assigned.count} worker(s) assigned successfully`), 201);
      } catch (error) {
        return handleAPiError(error, "Unexpected error occurred while assigning workers. Please try again!");
      }
    }
  )
  .patch(
    ":workplaceId/workers/:userId",
    requireAuth(),
    customValidator(
      "param",
      workplaceParamsSchema.extend(organizationParamsSchema.shape).extend(workerUserParamsSchema.shape)
    ),
    customValidator("json", updateWorkerRoleSchema),
    requireWorkplaceRole(WorkplaceRole.SUPERVISOR),
    describeRoute(updateWorkerRoleDocs),
    async (c) => {
      try {
        const prisma = c.get("prisma");
        const currentUser = c.get("user")!;
        const { workplaceId, userId } = c.req.valid("param");
        const { workplaceRole: newRole } = c.req.valid("json");

        // Get caller's role
        const callerAssignment = await prisma.usersOnWorkplaces.findUnique({
          where: { userId_workplaceId: { userId: currentUser.id, workplaceId } }
        });
        const callerRole =
          currentUser.systemRole === SystemRole.SUPERADMIN
            ? WorkplaceRole.WORKPLACE_MANAGER
            : (callerAssignment?.workplaceRole ?? WorkplaceRole.VISITOR);

        // Get target's current role
        const targetAssignment = await prisma.usersOnWorkplaces.findUnique({
          where: { userId_workplaceId: { userId, workplaceId } }
        });
        if (!targetAssignment || !targetAssignment.isActive) {
          return c.json(apiErrorResponse("NOT_FOUND", "Worker not found in this workplace"), 404);
        }

        // Caller must outrank target's current role
        if (
          !hasMoreWorkplacePrivileges(callerRole, targetAssignment.workplaceRole) ||
          callerRole === targetAssignment.workplaceRole
        ) {
          return c.json(
            apiErrorResponse("FORBIDDEN", "You cannot change the role of a worker with equal or higher privileges"),
            403
          );
        }

        // Caller cannot assign a role higher than their own
        if (WORKPLACE_ROLE_WEIGHT[newRole] > WORKPLACE_ROLE_WEIGHT[callerRole]) {
          return c.json(apiErrorResponse("FORBIDDEN", "You cannot assign a role higher than your own"), 403);
        }

        const updated = await prisma.usersOnWorkplaces.update({
          where: { userId_workplaceId: { userId, workplaceId } },
          data: { workplaceRole: newRole }
        });
        return c.json(apiSuccessResponse(updated, "Worker role updated successfully"), 200);
      } catch (error) {
        return handleAPiError(error, "Unexpected error occurred while updating worker role. Please try again!");
      }
    }
  )
  .delete(
    ":workplaceId/workers/:userId",
    requireAuth(),
    customValidator(
      "param",
      workplaceParamsSchema.extend(organizationParamsSchema.shape).extend(workerUserParamsSchema.shape)
    ),
    requireWorkplaceRole(WorkplaceRole.SUPERVISOR),
    describeRoute(unassignWorkerDocs),
    async (c) => {
      try {
        const prisma = c.get("prisma");
        const currentUser = c.get("user")!;
        const { workplaceId, userId } = c.req.valid("param");

        // Get caller's role
        const callerAssignment = await prisma.usersOnWorkplaces.findUnique({
          where: { userId_workplaceId: { userId: currentUser.id, workplaceId } }
        });
        const callerRole =
          currentUser.systemRole === SystemRole.SUPERADMIN
            ? WorkplaceRole.WORKPLACE_MANAGER
            : (callerAssignment?.workplaceRole ?? WorkplaceRole.VISITOR);

        // Get target
        const targetAssignment = await prisma.usersOnWorkplaces.findUnique({
          where: { userId_workplaceId: { userId, workplaceId } }
        });
        if (!targetAssignment || !targetAssignment.isActive) {
          return c.json(apiErrorResponse("NOT_FOUND", "Worker not found in this workplace"), 404);
        }

        // Caller must outrank target
        if (
          !hasMoreWorkplacePrivileges(callerRole, targetAssignment.workplaceRole) ||
          callerRole === targetAssignment.workplaceRole
        ) {
          return c.json(
            apiErrorResponse("FORBIDDEN", "You cannot unassign a worker with equal or higher privileges"),
            403
          );
        }

        await prisma.usersOnWorkplaces.update({
          where: { userId_workplaceId: { userId, workplaceId } },
          data: { isActive: false, removedAt: new Date() }
        });
        return c.json(apiSuccessResponse(null, "Worker unassigned successfully"), 200);
      } catch (error) {
        return handleAPiError(error, "Unexpected error occurred while unassigning worker. Please try again!");
      }
    }
  )
  // ── STATS ─────────────────────────────────────────────────────
  .get(
    ":workplaceId/stats",
    requireAuth(),
    customValidator("param", workplaceParamsSchema.extend(organizationParamsSchema.shape)),
    requireWorkplaceRole(WorkplaceRole.SUPERVISOR),
    describeRoute(getWorkplaceStatsDocs),
    async (c) => {
      try {
        const prisma = c.get("prisma");
        const { workplaceId, orgId } = c.req.valid("param");

        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        const workplace = await prisma.workplace.findUnique({
          where: { id: workplaceId, orgId },
          include: { budget: true }
        });
        if (!workplace) {
          return c.json(apiErrorResponse("NOT_FOUND", "Workplace not found"), 404);
        }

        const [headcount, presentToday] = await Promise.all([
          prisma.usersOnWorkplaces.count({ where: { workplaceId, isActive: true } }),
          prisma.attendance.count({ where: { workplaceId, date: todayStart, checkIn: { not: null } } })
        ]);

        const attendanceRate = headcount > 0 ? Math.round((presentToday / headcount) * 100) : 0;

        return c.json(
          apiSuccessResponse(
            {
              headcount,
              presentToday,
              attendanceRate,
              totalSpent: workplace.totalSpent,
              laborCost: workplace.laborCost,
              budget: workplace.budget?.planned ?? null,
              budgetRemaining:
                workplace.budget?.planned != null ? workplace.budget.planned - workplace.totalSpent : null,
              lastCalculated: workplace.lastCalculated
            },
            "Workplace stats retrieved successfully"
          ),
          200
        );
      } catch (error) {
        return handleAPiError(error, "Unexpected error retrieving workplace stats");
      }
    }
  )
  // ── ACTIVITY LOG ──────────────────────────────────────────────
  .get(
    ":workplaceId/activity-log",
    requireAuth(),
    customValidator("param", workplaceParamsSchema.extend(organizationParamsSchema.shape)),
    customValidator("query", paginationQuerySchema),
    requireWorkplaceRole(WorkplaceRole.SUPERVISOR),
    describeRoute(getActivityLogDocs),
    async (c) => {
      try {
        const prisma = c.get("prisma");
        const { workplaceId, orgId } = c.req.valid("param");
        const query = c.req.valid("query");
        const { skip, take, page, limit } = getPagination(query);

        const workplaceExists = await prisma.workplace.findUnique({
          where: { id: workplaceId, orgId },
          select: { id: true }
        });
        if (!workplaceExists) {
          return c.json(apiErrorResponse("NOT_FOUND", "Workplace not found"), 404);
        }

        const [attendances, assignments] = await Promise.all([
          prisma.attendance.findMany({
            where: { workplaceId },
            select: {
              checkIn: true,
              checkOut: true,
              date: true,
              userId: true,
              user: { select: { name: true } }
            },
            orderBy: { date: "desc" }
          }),
          prisma.usersOnWorkplaces.findMany({
            where: { workplaceId },
            select: {
              userId: true,
              workplaceRole: true,
              assignedAt: true,
              removedAt: true,
              isActive: true,
              user: { select: { name: true } },
              assignedBy: { select: { name: true } }
            }
          })
        ]);

        type ActivityEvent = {
          type: "CLOCK_IN" | "CLOCK_OUT" | "ASSIGNED" | "UNASSIGNED";
          subjectName: string | null;
          actorName: string | null;
          timestamp: Date;
          meta: Record<string, unknown>;
        };

        const events: ActivityEvent[] = [];

        for (const a of attendances) {
          if (a.checkIn) {
            events.push({
              type: "CLOCK_IN",
              subjectName: a.user.name,
              actorName: a.user.name,
              timestamp: a.checkIn,
              meta: { date: a.date }
            });
          }
          if (a.checkOut) {
            events.push({
              type: "CLOCK_OUT",
              subjectName: a.user.name,
              actorName: a.user.name,
              timestamp: a.checkOut,
              meta: { date: a.date }
            });
          }
        }

        for (const w of assignments) {
          events.push({
            type: "ASSIGNED",
            subjectName: w.user.name,
            actorName: w.assignedBy?.name ?? null,
            timestamp: w.assignedAt,
            meta: { role: w.workplaceRole }
          });
          if (!w.isActive && w.removedAt) {
            events.push({
              type: "UNASSIGNED",
              subjectName: w.user.name,
              actorName: null,
              timestamp: w.removedAt,
              meta: { role: w.workplaceRole }
            });
          }
        }

        events.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

        const total = events.length;
        const pageItems = events.slice(skip, skip + take);

        return c.json(
          apiSuccessResponse(
            { items: pageItems, meta: buildPaginationMeta(page, limit, total) },
            "Activity log retrieved successfully"
          ),
          200
        );
      } catch (error) {
        return handleAPiError(error, "Unexpected error retrieving activity log");
      }
    }
  )
  // ── GEOFENCE ──────────────────────────────────────────────────
  .get(
    ":workplaceId/geofence",
    requireAuth(),
    customValidator("param", workplaceParamsSchema.extend(organizationParamsSchema.shape)),
    requireWorkplaceRole(WorkplaceRole.WORKER),
    describeRoute(getGeofenceDocs),
    async (c) => {
      try {
        const prisma = c.get("prisma");
        const { workplaceId } = c.req.valid("param");
        const geofence = await prisma.workplaceGeofence.findUnique({
          where: { workplaceId }
        });
        if (!geofence) {
          return c.json(apiErrorResponse("NOT_FOUND", "No geofence configured for this workplace"), 404);
        }
        return c.json(apiSuccessResponse(geofence, "Geofence retrieved successfully"), 200);
      } catch (error) {
        return handleAPiError(error, "Unexpected error retrieving geofence");
      }
    }
  )
  .post(
    ":workplaceId/geofence",
    requireAuth(),
    customValidator("param", workplaceParamsSchema.extend(organizationParamsSchema.shape)),
    customValidator("json", setGeofenceSchema),
    requireWorkplaceRole(WorkplaceRole.SUPERVISOR),
    describeRoute(setGeofenceDocs),
    async (c) => {
      try {
        const prisma = c.get("prisma");
        const currentUser = c.get("user")!;
        const { workplaceId } = c.req.valid("param");
        const data = c.req.valid("json");

        const geofence = await prisma.workplaceGeofence.upsert({
          where: { workplaceId },
          create: { ...data, workplaceId, setBy: currentUser.id },
          update: { ...data, setBy: currentUser.id }
        });
        return c.json(apiSuccessResponse(geofence, "Geofence set successfully"), 200);
      } catch (error) {
        return handleAPiError(error, "Unexpected error setting geofence");
      }
    }
  )
  .delete(
    ":workplaceId/geofence",
    requireAuth(),
    customValidator("param", workplaceParamsSchema.extend(organizationParamsSchema.shape)),
    requireWorkplaceRole(WorkplaceRole.SUPERVISOR),
    describeRoute(deleteGeofenceDocs),
    async (c) => {
      try {
        const prisma = c.get("prisma");
        const { workplaceId } = c.req.valid("param");

        const existing = await prisma.workplaceGeofence.findUnique({ where: { workplaceId } });
        if (!existing) {
          return c.json(apiErrorResponse("NOT_FOUND", "No geofence configured for this workplace"), 404);
        }

        const deleted = await prisma.workplaceGeofence.delete({ where: { workplaceId } });
        return c.json(apiSuccessResponse(deleted, "Geofence deleted successfully"), 200);
      } catch (error) {
        return handleAPiError(error, "Unexpected error deleting geofence");
      }
    }
  );

export default workplaceRoutes;
