import z from "zod";
import { WorkplaceStatus, WorkplaceType } from "../lib/generated/prisma/enums.js";

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
