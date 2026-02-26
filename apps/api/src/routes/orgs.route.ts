import { Hono } from "hono";
import { describeRoute } from "hono-openapi";
import { type HonoInstanceContext } from "../_types/index.js";
import withPrisma from "../lib/prisma-client.js";
import { apiErrorResponse, apiSuccessResponse, handleAPiError } from "../helpers/api.helper.js";
import { customValidator } from "../helpers/validation.helpers.js";
import {
  acceptDeclineInviteSchema,
  addMemberSchema,
  createOrgSchema,
  inviteMemberSchema,
  organizationParamsSchema,
  orgMemberUserParamsSchema,
  orgSettingsSchema,
  updateMemberRoleSchema,
  updateOrgSchema
} from "../schemas/orgs.schema.js";
import {
  addOrgMemberDocs,
  acceptInviteDocs,
  createOrgDocs,
  declineInviteDocs,
  deleteOrgDocs,
  getOrgActivityLogDocs,
  getOrgMembersDocs,
  getOrgSettingsDocs,
  getOrgStatsDocs,
  getOrgsDocs,
  getSingleOrgDocs,
  inviteMemberDocs,
  removeOrgMemberDocs,
  updateOrgDocs,
  updateOrgMemberRoleDocs,
  updateOrgSettingsDocs
} from "../docs/orgs.docs.js";
import { ApprovalStatus, OrgRole, SystemRole } from "../lib/generated/prisma/enums.js";
import { requireOrgRole } from "../middlewares/roles.middleware.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { paginationQuerySchema } from "../schemas/pagination.schema.js";
import { buildPaginationMeta, getPagination, whereSearchQueryBuilder } from "../helpers/pagination.helper.js";
import { type Org } from "../lib/generated/prisma/client.js";
import { hasMoreOrgPrivileges } from "../helpers/orgs.helper.js";
import { ORG_ROLE_WEIGHT } from "../_constants/role-weights.constants.js";
import crypto from "crypto";

const orgRoutes = new Hono<HonoInstanceContext>()
  .use(withPrisma)
  // GET /orgs
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
        prisma.org.findMany({ where, take, skip }),
        prisma.org.count({ where })
      ]);
      return c.json(
        apiSuccessResponse({ items: orgs, meta: buildPaginationMeta(page, limit, orgCount) }, "Organizations retrieved successfully"),
        200
      );
    } catch (error) {
      return handleAPiError(error, "Unexpected error occurred while retrieving organizations");
    }
  })
  // POST /orgs
  .post("/", requireAuth(), customValidator("json", createOrgSchema), describeRoute(createOrgDocs), async (c) => {
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
  // GET /orgs/:orgId
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
        const org = await prisma.org.findUnique({ where: { id: orgId } });
        if (!org) {
          return c.json(apiErrorResponse("NOT_FOUND", "Organization not found"), 404);
        }
        return c.json(apiSuccessResponse(org, "Organization retrieved successfully"), 200);
      } catch (error) {
        return handleAPiError(error, "Unexpected error occurred while retrieving organization");
      }
    }
  )
  // PATCH /orgs/:orgId
  .patch(
    ":orgId",
    requireAuth(),
    customValidator("param", organizationParamsSchema),
    requireOrgRole(OrgRole.ADMIN),
    customValidator("json", updateOrgSchema),
    describeRoute(updateOrgDocs),
    async (c) => {
      try {
        const { orgId } = c.req.valid("param");
        const data = c.req.valid("json");
        const prisma = c.get("prisma");
        const org = await prisma.org.update({ where: { id: orgId }, data });
        return c.json(apiSuccessResponse(org, "Organization updated successfully"), 200);
      } catch (error) {
        return handleAPiError(error, "Unexpected error occurred while updating organization");
      }
    }
  )
  // DELETE /orgs/:orgId
  .delete(
    ":orgId",
    requireAuth(),
    customValidator("param", organizationParamsSchema),
    requireOrgRole(OrgRole.OWNER),
    describeRoute(deleteOrgDocs),
    async (c) => {
      try {
        const { orgId } = c.req.valid("param");
        const prisma = c.get("prisma");
        const org = await prisma.org.delete({ where: { id: orgId } });
        return c.json(apiSuccessResponse(org, "Organization deleted successfully"), 200);
      } catch (error) {
        return handleAPiError(error, "Unexpected error occurred while deleting organization");
      }
    }
  )
  // GET /orgs/:orgId/members
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
          where: { userId: currentUser.id, orgId }
        });
        const callerRole =
          currentUser.systemRole === SystemRole.SUPERADMIN ? OrgRole.OWNER : (currentMembership?.role ?? OrgRole.MEMBER);
        const allowedRoles = Object.values(OrgRole).filter((role) => hasMoreOrgPrivileges(callerRole, role));
        const whereClause = { orgId, role: { in: allowedRoles } };
        const [members, totalCount] = await Promise.all([
          prisma.orgMembership.findMany({
            skip,
            take,
            where: whereClause,
            include: { user: true }
          }),
          prisma.orgMembership.count({ where: whereClause })
        ]);
        const formattedMembers = members.map(({ user, userId, orgId: _orgId, ...member }) => ({
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
  )
  // POST /orgs/:orgId/members — add existing user as member
  .post(
    ":orgId/members",
    requireAuth(),
    customValidator("param", organizationParamsSchema),
    requireOrgRole(OrgRole.ADMIN),
    customValidator("json", addMemberSchema),
    describeRoute(addOrgMemberDocs),
    async (c) => {
      try {
        const { orgId } = c.req.valid("param");
        const { userId, role } = c.req.valid("json");
        const currentUser = c.get("user")!;
        const prisma = c.get("prisma");

        const callerMembership = await prisma.orgMembership.findFirst({ where: { userId: currentUser.id, orgId } });
        const callerRole =
          currentUser.systemRole === SystemRole.SUPERADMIN ? OrgRole.OWNER : (callerMembership?.role ?? OrgRole.MEMBER);

        if (ORG_ROLE_WEIGHT[role] >= ORG_ROLE_WEIGHT[callerRole]) {
          return c.json(apiErrorResponse("FORBIDDEN", "You cannot assign a role equal to or higher than your own"), 403);
        }

        const targetUser = await prisma.users.findUnique({ where: { id: userId } });
        if (!targetUser) {
          return c.json(apiErrorResponse("NOT_FOUND", "User not found"), 404);
        }

        const existing = await prisma.orgMembership.findFirst({ where: { orgId, userId } });
        if (existing) {
          return c.json(apiErrorResponse("CONFLICT", "User is already a member of this organization"), 409);
        }

        const membership = await prisma.orgMembership.create({
          data: {
            orgId,
            userId,
            role,
            invitedBy: currentUser.id,
            invitedAt: new Date()
          }
        });
        return c.json(apiSuccessResponse(membership, "Member added successfully"), 201);
      } catch (error) {
        return handleAPiError(error, "Unexpected error occurred while adding member");
      }
    }
  )
  // PATCH /orgs/:orgId/members/:userId — change member role
  .patch(
    ":orgId/members/:userId",
    requireAuth(),
    customValidator("param", organizationParamsSchema.extend(orgMemberUserParamsSchema.shape)),
    requireOrgRole(OrgRole.ADMIN),
    customValidator("json", updateMemberRoleSchema),
    describeRoute(updateOrgMemberRoleDocs),
    async (c) => {
      try {
        const { orgId, userId } = c.req.valid("param");
        const { role: newRole } = c.req.valid("json");
        const currentUser = c.get("user")!;
        const prisma = c.get("prisma");

        if (userId === currentUser.id) {
          return c.json(apiErrorResponse("FORBIDDEN", "You cannot change your own role"), 403);
        }

        const callerMembership = await prisma.orgMembership.findFirst({ where: { userId: currentUser.id, orgId } });
        const callerRole =
          currentUser.systemRole === SystemRole.SUPERADMIN ? OrgRole.OWNER : (callerMembership?.role ?? OrgRole.MEMBER);

        const target = await prisma.orgMembership.findFirst({ where: { orgId, userId, isActive: true } });
        if (!target) {
          return c.json(apiErrorResponse("NOT_FOUND", "Member not found in this organization"), 404);
        }

        if (ORG_ROLE_WEIGHT[callerRole] <= ORG_ROLE_WEIGHT[target.role]) {
          return c.json(apiErrorResponse("FORBIDDEN", "You cannot change the role of a member with equal or higher privileges"), 403);
        }
        if (ORG_ROLE_WEIGHT[newRole] >= ORG_ROLE_WEIGHT[callerRole]) {
          return c.json(apiErrorResponse("FORBIDDEN", "You cannot assign a role equal to or higher than your own"), 403);
        }

        const updated = await prisma.orgMembership.update({
          where: { orgId_userId: { orgId, userId } },
          data: { role: newRole }
        });
        return c.json(apiSuccessResponse(updated, "Member role updated successfully"), 200);
      } catch (error) {
        return handleAPiError(error, "Unexpected error occurred while updating member role");
      }
    }
  )
  // DELETE /orgs/:orgId/members/:userId — soft-remove member
  .delete(
    ":orgId/members/:userId",
    requireAuth(),
    customValidator("param", organizationParamsSchema.extend(orgMemberUserParamsSchema.shape)),
    requireOrgRole(OrgRole.ADMIN),
    describeRoute(removeOrgMemberDocs),
    async (c) => {
      try {
        const { orgId, userId } = c.req.valid("param");
        const currentUser = c.get("user")!;
        const prisma = c.get("prisma");

        if (userId === currentUser.id) {
          return c.json(apiErrorResponse("FORBIDDEN", "You cannot remove yourself from the organization"), 403);
        }

        const callerMembership = await prisma.orgMembership.findFirst({ where: { userId: currentUser.id, orgId } });
        const callerRole =
          currentUser.systemRole === SystemRole.SUPERADMIN ? OrgRole.OWNER : (callerMembership?.role ?? OrgRole.MEMBER);

        const target = await prisma.orgMembership.findFirst({ where: { orgId, userId, isActive: true } });
        if (!target) {
          return c.json(apiErrorResponse("NOT_FOUND", "Member not found in this organization"), 404);
        }

        if (ORG_ROLE_WEIGHT[callerRole] <= ORG_ROLE_WEIGHT[target.role]) {
          return c.json(apiErrorResponse("FORBIDDEN", "You cannot remove a member with equal or higher privileges"), 403);
        }

        const updated = await prisma.orgMembership.update({
          where: { orgId_userId: { orgId, userId } },
          data: { isActive: false }
        });
        return c.json(apiSuccessResponse(updated, "Member removed successfully"), 200);
      } catch (error) {
        return handleAPiError(error, "Unexpected error occurred while removing member");
      }
    }
  )
  // POST /orgs/:orgId/invite — invite by email or phone
  .post(
    ":orgId/invite",
    requireAuth(),
    customValidator("param", organizationParamsSchema),
    requireOrgRole(OrgRole.ADMIN),
    customValidator("json", inviteMemberSchema),
    describeRoute(inviteMemberDocs),
    async (c) => {
      try {
        const { orgId } = c.req.valid("param");
        const { email, phone, role } = c.req.valid("json");
        const currentUser = c.get("user")!;
        const prisma = c.get("prisma");

        const callerMembership = await prisma.orgMembership.findFirst({ where: { userId: currentUser.id, orgId } });
        const callerRole =
          currentUser.systemRole === SystemRole.SUPERADMIN ? OrgRole.OWNER : (callerMembership?.role ?? OrgRole.MEMBER);

        if (ORG_ROLE_WEIGHT[role] >= ORG_ROLE_WEIGHT[callerRole]) {
          return c.json(apiErrorResponse("FORBIDDEN", "You cannot invite someone with a role equal to or higher than your own"), 403);
        }

        const token = crypto.randomBytes(32).toString("hex");
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

        const invite = await prisma.orgInvite.create({
          data: { orgId, invitedBy: currentUser.id, email, phone, role, token, expiresAt }
        });

        // In production: send email/SMS notification here
        return c.json(apiSuccessResponse(invite, "Invite created successfully"), 201);
      } catch (error) {
        return handleAPiError(error, "Unexpected error occurred while creating invite");
      }
    }
  )
  // POST /orgs/:orgId/invite/accept
  .post(
    ":orgId/invite/accept",
    requireAuth(),
    customValidator("param", organizationParamsSchema),
    customValidator("json", acceptDeclineInviteSchema),
    describeRoute(acceptInviteDocs),
    async (c) => {
      try {
        const { orgId } = c.req.valid("param");
        const { token } = c.req.valid("json");
        const currentUser = c.get("user")!;
        const prisma = c.get("prisma");

        const invite = await prisma.orgInvite.findUnique({ where: { token } });
        if (!invite || invite.orgId !== orgId) {
          return c.json(apiErrorResponse("NOT_FOUND", "Invite not found"), 404);
        }
        if (invite.status !== "PENDING") {
          return c.json(apiErrorResponse("BAD_REQUEST", `Invite has already been ${invite.status.toLowerCase()}`), 400);
        }
        if (invite.expiresAt < new Date()) {
          await prisma.orgInvite.update({ where: { token }, data: { status: "EXPIRED" } });
          return c.json(apiErrorResponse("BAD_REQUEST", "Invite has expired"), 400);
        }
        if (invite.email && currentUser.email !== invite.email) {
          return c.json(apiErrorResponse("FORBIDDEN", "This invite was not issued to you"), 403);
        }

        const alreadyMember = await prisma.orgMembership.findFirst({ where: { orgId, userId: currentUser.id } });
        if (alreadyMember) {
          return c.json(apiErrorResponse("CONFLICT", "You are already a member of this organization"), 409);
        }

        const [membership] = await prisma.$transaction([
          prisma.orgMembership.create({
            data: {
              orgId,
              userId: currentUser.id,
              role: invite.role,
              invitedBy: invite.invitedBy,
              invitedAt: invite.createdAt
            }
          }),
          prisma.orgInvite.update({ where: { token }, data: { status: "ACCEPTED" } })
        ]);
        return c.json(apiSuccessResponse(membership, "Invite accepted — you have joined the organization"), 200);
      } catch (error) {
        return handleAPiError(error, "Unexpected error occurred while accepting invite");
      }
    }
  )
  // POST /orgs/:orgId/invite/decline
  .post(
    ":orgId/invite/decline",
    requireAuth(),
    customValidator("param", organizationParamsSchema),
    customValidator("json", acceptDeclineInviteSchema),
    describeRoute(declineInviteDocs),
    async (c) => {
      try {
        const { orgId } = c.req.valid("param");
        const { token } = c.req.valid("json");
        const prisma = c.get("prisma");

        const invite = await prisma.orgInvite.findUnique({ where: { token } });
        if (!invite || invite.orgId !== orgId) {
          return c.json(apiErrorResponse("NOT_FOUND", "Invite not found"), 404);
        }
        if (invite.status !== "PENDING") {
          return c.json(apiErrorResponse("BAD_REQUEST", `Invite has already been ${invite.status.toLowerCase()}`), 400);
        }

        const updated = await prisma.orgInvite.update({ where: { token }, data: { status: "DECLINED" } });
        return c.json(apiSuccessResponse(updated, "Invite declined successfully"), 200);
      } catch (error) {
        return handleAPiError(error, "Unexpected error occurred while declining invite");
      }
    }
  )
  // GET /orgs/:orgId/stats
  .get(
    ":orgId/stats",
    requireAuth(),
    customValidator("param", organizationParamsSchema),
    requireOrgRole(OrgRole.MANAGER),
    describeRoute(getOrgStatsDocs),
    async (c) => {
      try {
        const { orgId } = c.req.valid("param");
        const prisma = c.get("prisma");

        const org = await prisma.org.findUnique({ where: { id: orgId } });
        if (!org) {
          return c.json(apiErrorResponse("NOT_FOUND", "Organization not found"), 404);
        }

        const [totalMembers, workplaceCounts, totalsAgg, pendingAttendance] = await Promise.all([
          prisma.orgMembership.count({ where: { orgId, isActive: true } }),
          prisma.workplace.groupBy({ by: ["status"], where: { orgId }, _count: true }),
          prisma.workplace.aggregate({ where: { orgId }, _sum: { totalSpent: true, laborCost: true } }),
          prisma.attendance.count({ where: { workplace: { orgId }, approvalStatus: ApprovalStatus.PENDING } })
        ]);

        const workplacesByStatus = Object.fromEntries(workplaceCounts.map((r) => [r.status, r._count]));
        const totalWorkplaces = workplaceCounts.reduce((sum, r) => sum + r._count, 0);

        return c.json(
          apiSuccessResponse(
            {
              totalMembers,
              totalWorkplaces,
              workplacesByStatus,
              totalSpent: totalsAgg._sum.totalSpent ?? 0,
              laborCost: totalsAgg._sum.laborCost ?? 0,
              pendingAttendance
            },
            "Stats retrieved successfully"
          ),
          200
        );
      } catch (error) {
        return handleAPiError(error, "Unexpected error retrieving stats");
      }
    }
  )
  // GET /orgs/:orgId/activity-log [P]
  .get(
    ":orgId/activity-log",
    requireAuth(),
    customValidator("param", organizationParamsSchema),
    customValidator("query", paginationQuerySchema),
    requireOrgRole(OrgRole.ADMIN),
    describeRoute(getOrgActivityLogDocs),
    async (c) => {
      try {
        const { orgId } = c.req.valid("param");
        const query = c.req.valid("query");
        const { skip, take, page, limit } = getPagination(query);
        const prisma = c.get("prisma");

        const [memberships, total] = await Promise.all([
          prisma.orgMembership.findMany({
            where: { orgId },
            include: { user: { select: { name: true } } },
            orderBy: { updatedAt: "desc" },
            skip,
            take
          }),
          prisma.orgMembership.count({ where: { orgId } })
        ]);

        const events = memberships.map(({ user, userId, role, isActive, joinedAt, updatedAt }) => ({
          type: isActive ? "JOINED" : "REMOVED",
          userId,
          userName: user.name,
          role,
          timestamp: isActive ? joinedAt : updatedAt
        }));

        return c.json(
          apiSuccessResponse({ items: events, meta: buildPaginationMeta(page, limit, total) }, "Activity log retrieved successfully"),
          200
        );
      } catch (error) {
        return handleAPiError(error, "Unexpected error retrieving activity log");
      }
    }
  )
  // GET /orgs/:orgId/settings
  .get(
    ":orgId/settings",
    requireAuth(),
    customValidator("param", organizationParamsSchema),
    requireOrgRole(OrgRole.ADMIN),
    describeRoute(getOrgSettingsDocs),
    async (c) => {
      try {
        const { orgId } = c.req.valid("param");
        const prisma = c.get("prisma");

        const org = await prisma.org.findUnique({
          where: { id: orgId },
          select: { timezone: true, logoUrl: true, website: true, addressLine: true, city: true, country: true }
        });
        if (!org) {
          return c.json(apiErrorResponse("NOT_FOUND", "Organization not found"), 404);
        }
        return c.json(apiSuccessResponse(org, "Settings retrieved successfully"), 200);
      } catch (error) {
        return handleAPiError(error, "Unexpected error retrieving settings");
      }
    }
  )
  // PATCH /orgs/:orgId/settings
  .patch(
    ":orgId/settings",
    requireAuth(),
    customValidator("param", organizationParamsSchema),
    requireOrgRole(OrgRole.ADMIN),
    customValidator("json", orgSettingsSchema),
    describeRoute(updateOrgSettingsDocs),
    async (c) => {
      try {
        const { orgId } = c.req.valid("param");
        const data = c.req.valid("json");
        const prisma = c.get("prisma");

        const org = await prisma.org.update({ where: { id: orgId }, data });
        const settings = {
          timezone: org.timezone,
          logoUrl: org.logoUrl,
          website: org.website,
          addressLine: org.addressLine,
          city: org.city,
          country: org.country
        };
        return c.json(apiSuccessResponse(settings, "Settings updated successfully"), 200);
      } catch (error) {
        return handleAPiError(error, "Unexpected error updating settings");
      }
    }
  );

export default orgRoutes;
