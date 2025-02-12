import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

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
      console.log(`account: ${account} for profile: ${JSON.stringify(profile)} is signing in `)
      if (!profile || !profile.email) {
        return false
      }
      return true
    }
  },
});
