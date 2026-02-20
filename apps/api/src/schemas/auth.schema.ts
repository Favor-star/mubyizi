import z from "zod";
import { userSchema } from "./user.schema.js";

export const signUpSchema = userSchema.omit({ id: true, createdAt: true, updatedAt: true, lastLoginAt: true }).extend({
  email: z.email("Invalid email address").min(1, "Email is required"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long.")
    .max(100, "Password must be at most 100 characters long.")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/, {
      error:
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character."
    }),
  rememberMe: z.boolean().default(false)
});
export const loginSchema = z.object({
  email: z.email("Invalid email address").min(1, "Email is required"),
  password: z.string().min(1, "Password is required")
});
export const loginResponseSchema = z.object({
  redirect: z.boolean().default(false),
  token: z.string(),
  user: z.object({
    name: z.string(),
    email: z.string(),
    emailVerified: z.boolean(),
    image: z.string().nullish(),
    createdAt: z.iso.datetime(),
    updatedAt: z.iso.datetime(),
    id: z.string()
  })
});
