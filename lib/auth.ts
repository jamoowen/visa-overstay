import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import {UsersDAO} from "../dao/UsersDAO";

export const {handlers, signIn, signOut, auth} = NextAuth({
  adapter: "node",
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
      const upsertResult = await UsersDAO.upsertUser({
        name: profile.name || '',
        email: profile.email,
        profilePicture: profile.picture
      })
      if (upsertResult.isErr()) {
        console.error(`Unable to upsert user: ${JSON.stringify(upsertResult)}`)
        return false
      }
      return true
    }
  },
});
