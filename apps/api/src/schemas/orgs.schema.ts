import * as z from "zod";
import { Industry, OrgRole, OrgStatus, OrgType } from "../lib/generated/prisma/enums.js";

export const orgSchema = z.object({
  id: z.ulid(),
  name: z.string().min(1, "Organization name is required"),
  type: z.enum(OrgType),
  industry: z.enum(Industry),
  status: z.enum(OrgStatus),
  description: z.string().nullish(),
  website: z.string().nullish(),
  addressLine: z.string().nullish(),
  city: z.string().nullish(),
  country: z.string().nullish(),
  images: z.array(z.string()).optional(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime()
});

export const createOrgSchema = orgSchema.omit({ id: true, createdAt: true, updatedAt: true }).extend({
  industry: z.enum(Industry).default(Industry.OTHER),
  type: z.enum(OrgType).default(OrgType.COMPANY),
  status: z.enum(OrgStatus).default(OrgStatus.ACTIVE)
});
export const updateOrgSchema = createOrgSchema.partial();
export const organizationParamsSchema = z.object({
  orgId: z.ulid("Invalid organization ID")
});
export const orgMembershipSchema = z.object({
  orgId: z.ulid(),
  userId: z.string(),
  role: z.enum(OrgRole),
  isActive: z.boolean().default(true),
  invitedBy: z.string().nullable(),
  invitedAt: z.iso.datetime().nullable(),
  joinedAt: z.iso.datetime(),
  lastSeenAt: z.iso.datetime().nullable(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime()
});
