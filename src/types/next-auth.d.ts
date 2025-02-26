import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      userId: number;  // Add userId to the session object
    } & DefaultSession["user"];
  }

  interface JWT {
    userId: number; // Add userId to the JWT token
  }
}
