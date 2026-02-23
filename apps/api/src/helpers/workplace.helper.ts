import { WORKPLACE_ROLE_WEIGHT } from "../_constants/role-weights.constants.js";
import { WorkplaceRole } from "../lib/generated/prisma/enums.js";


export const hasMoreWorkplacePrivileges = (currentUserRole: WorkplaceRole, hisRole: WorkplaceRole) => {
  const userRoleIndex = WORKPLACE_ROLE_WEIGHT[currentUserRole];
  const requiredRoleIndex = WORKPLACE_ROLE_WEIGHT[hisRole];
  return userRoleIndex >= requiredRoleIndex;
};
