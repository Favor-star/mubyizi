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
  updateWorkPlaceSchema,
  workplaceParamsSchema,
  workplaceQuerySchema
} from "../schemas/workplace.schema.js";
import { paginationQuerySchema } from "../schemas/pagination.schema.js";
import { buildPaginationMeta, getPagination } from "../helpers/pagination.helper.js";
import { apiErrorResponse, apiSuccessResponse, handleAPiError } from "../helpers/api.helper.js";
import { hasMoreWorkplacePrivileges } from "../helpers/workplace.helper.js";
import { organizationParamsSchema } from "../schemas/orgs.schema.js";
import { describeRoute } from "hono-openapi";
import { getOrgWorkplacesDocs } from "../docs/orgs.docs.js";
import {
  addWorkersToWorkplaceDocs,
  createWorkplaceDocs,
  deleteWorkplaceDocs,
  getSingleWorkplaceDocs,
  getWorkersOfWorkplaceDocs,
  updateWorkplaceDocs
} from "../docs/workplaces.docs.js";

const workplaceRoutes = new Hono<HonoInstanceContext>()
  .use(withPrisma)
  .get(
    ":orgId/workplaces",
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
  .patch(
    ":workplaceId/workers",
    requireAuth(),
    customValidator("param", workplaceParamsSchema.extend(organizationParamsSchema.shape)),
    customValidator("json", addWorkersToWorkplaceSchema),
    requireWorkplaceRole(WorkplaceRole.SUPERVISOR),
    describeRoute(addWorkersToWorkplaceDocs),
    async (c) => {
      try {
        const prisma = c.get("prisma");
        const currentUser = c.get("user")!;
        const { workplaceId, orgId } = c.req.valid("param");
        const newWorkers = c.req.valid("json");
        const existingUsers = await prisma.users.findMany({
          where: {
            id: {
              in: newWorkers.map((w) => w.userId)
            }
          },
          select: {
            id: true
          }
        });
        const existingUserIds = new Set(existingUsers.map((u) => u.id));
        const invalidWorkers = newWorkers.filter((w) => !existingUserIds.has(w.userId));

        if (invalidWorkers.length > 0) {
          return c.json(
            apiErrorResponse(
              { data: invalidWorkers },
              `Some workers do not exists. Please remove or create them before adding to workplace.`
            ),
            400
          );
        }
        const validWorkers = newWorkers.filter((w) => existingUserIds.has(w.userId));
        const workesAdded = await prisma.usersOnWorkplaces.createMany({
          data: validWorkers.map((w) => ({
            ...w,
            workplaceId,
            orgId,
            assignedById: currentUser.id
          })),
          skipDuplicates: true
        });
        return c.json(apiSuccessResponse(workesAdded, `${workesAdded.count} Workers added successfully!`), 201);
      } catch (error) {
        return handleAPiError(error, "Unexpected error occurred while adding a worker. Please try again!");
      }
    }
  );

export default workplaceRoutes;
