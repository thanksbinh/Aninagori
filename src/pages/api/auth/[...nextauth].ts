import NextAuth, { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { FirestoreAdapter } from "@next-auth/firebase-adapter"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "@/firebase/firebase-app"
import { cert } from "firebase-admin/app"
import { getAuth } from "firebase-admin/auth"
import { db } from "@/firebase/firebase-admin-app"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      type: "credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "admin@aninagori.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const data = await signInWithEmailAndPassword(auth, credentials?.email || "", credentials?.password || "")

          return {
            ...data.user,
            name: auth.currentUser?.displayName,
            id: data.user.uid,
          }
        } catch (error) {
          return null
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
    // ...add more providers here
  ],
  pages: {
    signIn: "/login",
  },
  adapter: FirestoreAdapter({
    credential: cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  }),
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, account, profile, isNewUser }) {
      const adminAuth = getAuth()
      if (isNewUser || user) {
        // add custom token to session
        const additionalClaims = {
          username: (user as any)?.username || "guess",
          id_admin: !!(user as any)?.id_admin,
          is_banned: !!(user as any)?.is_banned,
        }
        const customToken = await adminAuth.createCustomToken(token.sub!, additionalClaims)
        token.customToken = customToken
      }
      if (isNewUser) {
        try {
          db.doc(`users/${token.sub}`).update({
            joined_date: new Date(),
            username: "guess",
          })
        } catch (error) {
          console.log(error)
        }
      }
      return token
    },
    async session({ session, token, user }) {
      if (session?.user) {
        (session as any).user.id = token.sub;
        (session as any).customToken = token.customToken;
      }
      return session
    },
  },
}

export default NextAuth(authOptions)
