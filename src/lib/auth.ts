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
      console.log(`account: ${account} for profile: ${JSON.stringify(profile)} is signing in `)
      if (!profile || !profile.email) {
        return false
      }
      return true
    },
    async jwt({token, account, profile}) {
      // Persist the OAuth access_token and or the user id to the token right after signin
      if (account && profile && profile.email && profile.name) {
        //get the userid
        const response = await fetch('/api/sign-in', {
          method: 'POST',
          body: JSON.stringify({name: profile.name, email: profile.email, picture: profile.picture})
        })
        if (!response.ok) {
          return
        }
        const userId = (await response.json()).userId
        token.picture = userId
      }
      return token
    },
    async session({session, token}) {
      if (session) {
        token.userId = 'seshhhhhh'
      }
      return session
    }

  },
});
