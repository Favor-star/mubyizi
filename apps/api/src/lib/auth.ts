import { betterAuth, type BetterAuthOptions } from "better-auth/minimal";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { customSession } from "better-auth/plugins";

import "dotenv/config";
import { SystemRole } from "./generated/prisma/enums.js";
import { prisma } from "./prisma-client.js";
const options = {
  database: prismaAdapter(prisma, {
    provider: "postgresql"
  }),
  baseURL: process.env.BETTER_AUTH_BASE_URL!,
  trustedOrigins: [process.env.FRONTEND_URL!],
  emailAndPassword: {
    enabled: true,
    autoSignIn: true
  },
  plugins: []
} satisfies BetterAuthOptions;

export const auth = betterAuth({
  ...options,
  plugins: [
    ...(options.plugins ?? []),
    customSession(async ({ user, session }, ctx) => {
      // Look up by direct id OR by authUserId (for claimed provisional accounts).
      // We return userData.id so the session always carries the stable app ULID,
      // not the better-auth generated id — keeping all FK lookups consistent.
      const userData = await prisma.users.findFirst({
        where: {
          OR: [{ id: user.id }, { authUserId: user.id }]
        },
        select: {
          id: true,
          systemRole: true
        }
      });

      return {
        user: {
          ...user,
          id: userData?.id ?? user.id,
          systemRole: userData?.systemRole ?? SystemRole.USER
        },
        session
      };
    })
  ]
});
