import z from "zod";
import { JobCategory, SkillLevel, SystemRole } from "../lib/generated/prisma/enums.js";

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
