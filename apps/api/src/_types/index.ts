import type { PrismaClient } from "../lib/generated/prisma/client.js";

export type HonoInstanceContext = {
  Variables: {
    prisma: PrismaClient;
  };
};
export type ValidationErrorProps = {
  path: string[];
  message: string;
};
