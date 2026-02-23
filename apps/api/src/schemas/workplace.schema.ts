import z from "zod";
import {
  JobCategory,
  SkillLevel,
  WorkplaceRole,
  WorkplaceStatus,
  WorkplaceType
} from "../lib/generated/prisma/enums.js";

export const workplaceSchema = z.object({
  id: z.ulid(),
  name: z.string().min(1, "Workplace name is required"),
  type: z.enum(WorkplaceType).default(WorkplaceType.PROJECT),
  location: z.string().nullish(),
  description: z.string().nullish(),
  address: z.string().nullish(),
  coordinates: z.string().nullish(),
  status: z.enum(WorkplaceStatus).default(WorkplaceStatus.NOT_STARTED),
  image: z.array(z.string()).optional(),
  startDate: z.iso.datetime().nullish(),
  endDate: z.iso.datetime().nullish(),
  budgedId: z.string().nullish(),
  totalSpent: z.number().default(0),
  laborCost: z.number().default(0),
  lastCalculated: z.iso.datetime().nullish(),
  orgId: z.ulid(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime()
});
export const createWorkplaceSchema = workplaceSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  totalSpent: true,
  laborCost: true,
  lastCalculated: true,
  image: true,
  budgedId: true,
  orgId: true
});
export const updateWorkPlaceSchema = createWorkplaceSchema.partial();
export const workplaceQuerySchema = z.object({
  orgId: z.ulid("Invalid organization ID").min(1, "Organization ID is required")
});
export const addWorkersToWorkplaceSchema = z
  .array(
    z.object({
      userId: z.string().min(1, "User ID is required"),
      workplaceRole: z.enum(WorkplaceRole).default(WorkplaceRole.WORKER)
    })
  )
  .min(1, "At least one worker must be added");

export const workplaceParamsSchema = z.object({
  workplaceId: z.ulid("Workplace ID is invalid").min(1, "Workplace ID is required")
});

export const workplaceWithWorkersSchema = z.object({
  WorkplaceRole: z.enum(WorkplaceRole).default(WorkplaceRole.WORKER),
  isActive: z.boolean().default(true),
  assignedBy: z.string(),
  email: z.email().nullable(),
  id: z.string(),
  createdAt: z.iso.datetime(),
  name: z.string(),
  occupation: z.string().nullable(),
  occupationCategory: z.enum(JobCategory).nullable(),
  skillLevel: z.enum(SkillLevel).nullable(),
  phoneNumber: z.string().nullable(),
  profileImage: z.string().nullable()
});
