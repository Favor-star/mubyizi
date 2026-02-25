import z from "zod";
import { JobCategory, SkillLevel, SystemRole } from "../lib/generated/prisma/enums.js";
import { paginationQuerySchema } from "./pagination.schema.js";

export const userSchema = z.object({
  id: z.string(),
  name: z.string("Name must be a string").min(1, "Name is required"),
  occupation: z.string().nullish(),
  occupationCategory: z.enum(JobCategory).default(JobCategory.OTHER),
  skillLevel: z.enum(SkillLevel).default(SkillLevel.INTERMEDIATE),
  systemRole: z.enum(SystemRole).default(SystemRole.USER),
  phoneNumber: z.string().nullish(),
  email: z.email(),
  profileImage: z.string().nullish(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
  lastLoginAt: z.iso.datetime().nullish()
});
export const createUserSchema = userSchema.omit({ id: true, createdAt: true, updatedAt: true, lastLoginAt: true });
export const updateUserSchema = createUserSchema.partial();
export const userParamsSchema = z.object({
  id: z.string().min(1, "User ID is required")
});
export const listUsersQuerySchema = paginationQuerySchema.extend({
  orgId: z.string().optional(),
  workplaceId: z.string().optional(),
  systemRole: z.enum(SystemRole).optional(),
  occupationCategory: z.enum(JobCategory).optional(),
  skillLevel: z.enum(SkillLevel).optional()
});
export const bulkImportUsersSchema = z.object({
  rows: createUserSchema.array().min(1).max(500)
});
