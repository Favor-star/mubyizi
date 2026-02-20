import * as z from "zod";
import { Industry, OrgStatus, OrgType } from "../lib/generated/prisma/enums.js";

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
