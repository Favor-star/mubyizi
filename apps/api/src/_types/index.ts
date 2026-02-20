import type { auth } from "../lib/auth.js";
import type { PrismaClient } from "../lib/generated/prisma/client.js";

export type HonoInstanceContext = {
  Variables: {
    prisma: PrismaClient;
    user: typeof auth.$Infer.Session.user | null;
    session: typeof auth.$Infer.Session.session | null;
  };
};
export type ValidationErrorProps = {
  path: string[];
  message: string;
};
