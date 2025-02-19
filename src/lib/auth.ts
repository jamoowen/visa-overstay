import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import {UsersDAO} from "@/dao/UsersDAO";

export const {handlers, signIn, signOut, auth} = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async signIn({account, profile}) {
      if (!profile || !profile.email) {
        return false
      }
      return true
    },
    async jwt({token, account, profile}) {
      if (account && profile && profile.email && profile.name) {
        //get the userid
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/sign-in`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: profile.name, email: profile.email })
        });
        if (!response.ok) {
          return token
        }
        const userId = (await response.json()).userId
        token.userId= userId;
      }
      return token
    },
    async session({ session, token }) {
      if (token.userId) {
        session.user.userId = token.userId as number; // Persist user ID in session
      }
      return session;
    },
  },
});
