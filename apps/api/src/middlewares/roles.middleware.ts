import { createMiddleware } from "hono/factory";
import { OrgRole, SystemRole, WorkplaceRole } from "../lib/generated/prisma/enums.js";
import { type HonoInstanceContext } from "../_types/index.js";
import { apiErrorResponse } from "../helpers/api.helper.js";
import { WORKPLACE_ROLE_WEIGHT } from "../_constants/role-weights.constants.js";

export const requireOrgRole = (minRole: OrgRole) => {
  return createMiddleware<HonoInstanceContext>(async (c, next) => {
    const orgId = c.req.param("orgId") || c.req.query("orgId");
    const user = c.get("user");
    const prisma = c.get("prisma");
    if (!user) {
      return c.json(apiErrorResponse("Unauthorized", "You must be logged in to access this resource."), 401);
    }
    if (user.systemRole === SystemRole.SUPERADMIN) return next();
    if (!orgId) {
      return c.json(apiErrorResponse("Bad Request", "Organization ID is required."), 400);
    }
    if (!orgId || typeof orgId !== "string") {
      return c.json(apiErrorResponse("Bad Request", "Organization ID is required and must be a string."), 400);
    }
    const membership = await prisma.orgMembership.findFirst({
      where: {
        userId: user.id,
        orgId
      },
      select: {
        role: true
      }
    });
    if (!membership) {
      return c.json(apiErrorResponse("Forbidden", "You are not a member of this organization."), 403);
    }
    const userRolWeight = OrgRole[membership.role];
    const requiredRoleWeight = OrgRole[minRole];
    if (userRolWeight >= requiredRoleWeight) {
      return next();
    }

    return c.json(
      apiErrorResponse(
        {
          error: "Insufficient organization privileges",
          required: minRole,
          current: membership.role,
          orgId
        },
        "You do not have the required permissions in this organization"
      ),
      403
    );
  });
};

export const requireWorkplaceRole = (minRole: WorkplaceRole) => {
  return createMiddleware<HonoInstanceContext>(async (c, next) => {
    const user = c.get("user");
    const prisma = c.get("prisma");
    const siteId = c.req.param("siteId") || c.req.query("siteId");
    if (!user) {
      return c.json(apiErrorResponse("Unauthorized", "You must be logged in"), 401);
    }
    if (user.systemRole === SystemRole.SUPERADMIN) return next();
    if (!siteId) {
      return c.json(apiErrorResponse("Bad Request", "Site ID is required"), 400);
    }
    const workplace = await prisma.workplace.findUnique({
      where: { id: siteId }
    });
    if (!workplace) {
      return c.json(apiErrorResponse("Not Found", "Workplace not found"), 404);
    }

    const workPlaceAssignments = await prisma.usersOnWorkplaces.findUnique({
      where: {
        userId_workplaceId: {
          userId: user.id,
          workplaceId: siteId
        }
      }
    });
    if (!workPlaceAssignments) {
      return c.json(apiErrorResponse("Forbidden", "You are not assigned to this workplace"), 403);
    }
    const userWeight = WORKPLACE_ROLE_WEIGHT[workPlaceAssignments.workplaceRole];
    const requiredWeight = WORKPLACE_ROLE_WEIGHT[minRole];
    if (userWeight >= requiredWeight) {
      return next();
    }
    return c.json(
      apiErrorResponse(
        {
          error: "Insufficient workplace privileges",
          required: minRole,
          current: workPlaceAssignments.workplaceRole,
          siteId
        },
        "You do not have the required permissions in this workplace"
      ),
      403
    );
  });
};
