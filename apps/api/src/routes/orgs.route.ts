import { Hono } from "hono";
import { describeRoute } from "hono-openapi";
import { type HonoInstanceContext } from "../_types/index.js";
import withPrisma from "../lib/prisma-client.js";
import { apiErrorResponse, apiSuccessResponse, handleAPiError } from "../helpers/api.helper.js";
import { customValidator } from "../helpers/validation.helpers.js";
import { createOrgSchema, organizationParamsSchema, updateOrgSchema } from "../schemas/orgs.schema.js";
import {
  createOrgDocs,
  deleteOrgDocs,
  getOrgMembersDocs,
  getOrgsDocs,
  getSingleOrgDocs,
  updateOrgDocs
} from "../docs/orgs.docs.js";
import { OrgRole, SystemRole } from "../lib/generated/prisma/enums.js";
import { requireOrgRole } from "../middlewares/roles.middleware.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { paginationQuerySchema } from "../schemas/pagination.schema.js";
import { buildPaginationMeta, getPagination, whereSearchQueryBuilder } from "../helpers/pagination.helper.js";
import { Prisma, type Org } from "../lib/generated/prisma/client.js";
import { hasMoreOrgPrivileges } from "../helpers/orgs.helper.js";

const orgRoutes = new Hono<HonoInstanceContext>()
  .use(withPrisma)
  .get("/", requireAuth(), customValidator("query", paginationQuerySchema), describeRoute(getOrgsDocs), async (c) => {
    try {
      const user = c.get("user")!;
      const prisma = c.get("prisma");
      const query = c.req.valid("query");
      const { limit, page, skip, take } = getPagination(query);
      const searchWhere = whereSearchQueryBuilder<Org>(query, ["name", "description"]);
      const where = {
        ...searchWhere,
        members:
          user.systemRole === SystemRole.SUPERADMIN
            ? undefined
            : {
                some: {
                  userId: user.id
                }
              }
      };
      const [orgs, orgCount] = await Promise.all([
        prisma.org.findMany({
          where,
          take,
          skip
        }),
        prisma.org.count({
          where
        })
      ]);
      return c.json(
        apiSuccessResponse(
          {
            items: orgs,
            meta: buildPaginationMeta(page, limit, orgCount)
          },
          "Organizations retrieved successfully"
        ),
        200
      );
    } catch (error) {
      return handleAPiError(error, "Get orgs error");
    }
  })
  .post("/", requireAuth(), describeRoute(createOrgDocs), customValidator("json", createOrgSchema), async (c) => {
    try {
      const user = c.get("user")!;
      const data = c.req.valid("json");
      const prisma = c.get("prisma");
      const org = await prisma.org.create({
        data: {
          ...data,
          members: {
            create: {
              role: OrgRole.OWNER,
              userId: user.id
            }
          }
        }
      });
      return c.json(apiSuccessResponse(org, "Organization created successfully"), 201);
    } catch (error) {
      return handleAPiError(error, "Unexpected error occurred while creating organization");
    }
  })
  .get(
    ":orgId",
    requireAuth(),
    customValidator("param", organizationParamsSchema),
    requireOrgRole(OrgRole.MEMBER),
    describeRoute(getSingleOrgDocs),
    async (c) => {
      try {
        const { orgId } = c.req.valid("param");
        const prisma = c.get("prisma");
        const org = await prisma.org.findUnique({
          where: { id: orgId }
        });
        if (!org) {
          return c.json(apiErrorResponse("Not Found", "Organization not found."), 404);
        }
        return c.json(apiSuccessResponse(org, "Organization retrieved successfully"), 200);
      } catch (error) {
        return handleAPiError(error, "Unexpected error occurred while retrieving organization");
      }
    }
  )
  .patch(
    ":orgId",
    requireAuth(),
    customValidator("param", organizationParamsSchema),
    customValidator("json", updateOrgSchema),
    describeRoute(updateOrgDocs),
    async (c) => {
      try {
        const { orgId } = c.req.valid("param");
        const data = c.req.valid("json");
        const prisma = c.get("prisma");
        const org = await prisma.org.update({
          where: { id: orgId },
          data
        });

        return c.json(apiSuccessResponse(org, "Organization updated successfully"), 200);
      } catch (error) {
        return handleAPiError(error, "Unexpected error occurred while updating organization");
      }
    }
  )
  .delete(
    ":orgId",
    requireAuth(),
    customValidator("param", organizationParamsSchema),
    describeRoute(deleteOrgDocs),
    async (c) => {
      try {
        const { orgId } = c.req.valid("param");
        const prisma = c.get("prisma");
        const res = await prisma.org.delete({
          where: { id: orgId }
        });
        return c.json(apiSuccessResponse(res, "Organization deleted successfully"), 200);
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
          return c.json(apiErrorResponse("Not Found", "Organization not found."), 404);
        }
        return handleAPiError(error, "Unexpected error occurred while deleting organization");
      }
    }
  )
  .get(
    ":orgId/members",
    requireAuth(),
    customValidator("param", organizationParamsSchema),
    customValidator("query", paginationQuerySchema),
    requireOrgRole(OrgRole.MEMBER),
    describeRoute(getOrgMembersDocs),
    async (c) => {
      try {
        const { orgId } = c.req.valid("param");
        const query = c.req.valid("query");
        const currentUser = c.get("user")!;
        const prisma = c.get("prisma");
        const { skip, take, page, limit } = getPagination(query);
        const currentMembership = await prisma.orgMembership.findFirst({
          where: {
            userId: currentUser.id,
            orgId
          }
        });

        const thisUserRole =
          currentUser.systemRole === SystemRole.SUPERADMIN
            ? OrgRole.OWNER
            : (currentMembership?.role ?? OrgRole.MEMBER);
        const allowedRoles = Object.values(OrgRole).filter((role) => hasMoreOrgPrivileges(thisUserRole, role));
        const whereClause = {
          orgId,
          role: {
            in: allowedRoles
          }
        };
        const [members, totalCount] = await Promise.all([
          prisma.orgMembership.findMany({
            skip,
            take,
            where: whereClause,
            include: {
              user: true
            }
          }),
          prisma.orgMembership.count({
            where: whereClause
          })
        ]);
        const formattedMembers = members.map(({ user, userId, orgId, ...member }) => ({
          ...user,
          ...member
        }));
        return c.json(
          apiSuccessResponse(
            { items: formattedMembers, meta: buildPaginationMeta(page, limit, totalCount) },
            "Organization members retrieved successfully"
          ),
          200
        );
      } catch (error) {
        return handleAPiError(error, "Unexpected error occurred while retrieving organization members");
      }
    }
  );

export default orgRoutes;
