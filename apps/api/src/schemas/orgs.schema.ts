import * as z from "zod";
import { Industry, OrgStatus, OrgType } from "../lib/generated/prisma/enums.js";

export const orgSchema = z.object({
  id: z.ulid(),
  name: z.string(),
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
