import z from "zod";
import {
  JobCategory,
  SkillLevel,
  WorkplaceRole,
  WorkplaceStatus,
  WorkplaceType
} from "../lib/generated/prisma/enums.js";
import { createUserSchema } from "./user.schema.js";

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
  budgetId: z.string().nullish(),
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
  budgetId: true,
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
export const addNewWorkersToWorkplaceSchema = z
  .array(
    createUserSchema.extend(
      z.object({
        workplaceRole: z.enum(WorkplaceRole).default(WorkplaceRole.WORKER)
      }).shape
    )
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

// Image schemas
export const workplaceImageSchema = z.object({
  id: z.ulid(),
  image: z.string().url(),
  publicId: z.string().nullish(),
  description: z.string().nullish(),
  workplaceId: z.ulid(),
  uploadedBy: z.string().nullish(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime()
});

export const uploadImageSchema = z.object({
  image: z.file(),
  description: z.string().max(500).optional()
});

export const imageParamsSchema = z.object({
  imageId: z.ulid("Invalid image ID")
});

// Worker management schemas
export const updateWorkerRoleSchema = z.object({
  workplaceRole: z.enum(WorkplaceRole)
});

export const workerUserParamsSchema = z.object({
  userId: z.ulid("Invalid user ID")
});

// Geofence schemas
export const geofenceSchema = z.object({
  id: z.ulid(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  radius: z.number().positive(),
  isActive: z.boolean(),
  workplaceId: z.ulid(),
  setBy: z.string().nullish(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime()
});

export const setGeofenceSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  radius: z.number().positive("Radius must be a positive number (meters)")
});
