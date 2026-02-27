import * as z from "zod";
import { Industry, JobCategory, OrgRole, OrgStatus, OrgType, SkillLevel } from "../lib/generated/prisma/enums.js";

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
// Member management
export const orgMemberUserParamsSchema = z.object({
  userId: z.ulid("Invalid user ID")
});
export const addMemberSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  role: z.enum(OrgRole).default(OrgRole.MEMBER)
});
export const updateMemberRoleSchema = z.object({
  role: z.enum(OrgRole)
});

// Invite
export const inviteMemberSchema = z
  .object({
    email: z.email().optional(),
    phone: z.string().optional(),
    role: z.enum(OrgRole).default(OrgRole.MEMBER)
  })
  .refine((d) => d.email || d.phone, { message: "Either email or phone is required" });

export const acceptDeclineInviteSchema = z.object({
  token: z.string().min(1, "Token is required")
});

export const orgInviteSchema = z.object({
  id: z.ulid(),
  orgId: z.ulid(),
  invitedBy: z.string(),
  email: z.email().nullish(),
  phone: z.string().nullish(),
  role: z.enum(OrgRole),
  status: z.string(),
  expiresAt: z.iso.datetime(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime()
});

// Settings (subset of Org fields)
export const orgSettingsSchema = z.object({
  timezone: z.string().optional(),
  logoUrl: z.url().optional(),
  website: z.url().optional(),
  addressLine: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional()
});

// Provisional user provisioning
export const provisionOrgWorkerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phoneNumber: z.string().optional(),
  email: z.email().optional(),
  occupation: z.string().optional(),
  occupationCategory: z.enum(JobCategory).optional(),
  skillLevel: z.enum(SkillLevel).optional(),
  role: z.enum(OrgRole).default(OrgRole.MEMBER)
});
