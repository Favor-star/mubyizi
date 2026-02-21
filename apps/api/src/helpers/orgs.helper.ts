import { ORG_ROLE_WEIGHT } from "../_constants/role-weights.constants.js";
import type { OrgRole } from "../lib/generated/prisma/enums.js";

export const hasMoreOrgPrivileges = (currentUserRole: OrgRole, hisRole: OrgRole) => {
  const userRoleIndex = ORG_ROLE_WEIGHT[currentUserRole];
  const requiredRoleIndex = ORG_ROLE_WEIGHT[hisRole];
  return userRoleIndex >= requiredRoleIndex;
};
