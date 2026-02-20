import { OrgRole, SystemRole, WorkplaceRole } from "../lib/generated/prisma/enums.js";

export const SYSTEM_ROLE_WEIGHT: Record<SystemRole, number> = {
  SUPERADMIN: 1000,
  SUPPORT: 500,
  USER: 0
};

export const ORG_ROLE_WEIGHT: Record<OrgRole, number> = {
  OWNER: 100,
  ADMIN: 80,
  MANAGER: 60,
  MEMBER: 40,
  VIEWER: 20
};
export const WORKPLACE_ROLE_WEIGHT: Record<WorkplaceRole, number> = {
  WORKPLACE_MANAGER: 40,
  SUPERVISOR: 30,
  WORKER: 20,
  VISITOR: 10
};
