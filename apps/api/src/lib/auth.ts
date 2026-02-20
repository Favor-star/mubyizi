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
      const userData = await prisma.users.findFirst({
        where: { id: user.id },
        select: {
          systemRole: true
        }
      });

      return {
        user: {
          ...user,
          systemRole: userData?.systemRole ?? SystemRole.USER
        },
        session
      };
    })
  ]
});
