import NextAuth, { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { FirestoreAdapter } from "@next-auth/firebase-adapter"
import { signInWithCustomToken, signInWithEmailAndPassword } from "firebase/auth"
import { auth, db } from "@/firebase/firebase-app"
import { getAuth } from "firebase-admin/auth"
import { doc, serverTimestamp, setDoc } from "firebase/firestore"

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
}

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            type: 'credentials',
            credentials: {
                email: { label: "Email", type: "email", placeholder: "admin@aninagori.com" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                try {
                    const data = await signInWithEmailAndPassword(auth, credentials?.email || '', credentials?.password || '')

                    return ({
                        ...data.user,
                        name: auth.currentUser?.displayName,
                        id: data.user.uid
                    })
                } catch (error) {
                    return null
                }
            }
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_ID!,
            clientSecret: process.env.GOOGLE_SECRET!,
        }),
        // ...add more providers here
    ],
    pages: {
        signIn: '/'
    },
    adapter: FirestoreAdapter(firebaseConfig),
    session: {
        strategy: "jwt"
    },
    callbacks: {
        async jwt({ token, user, account, profile, isNewUser }) {
            const adminAuth = getAuth()
            if (isNewUser || user) {
                const customToken = await adminAuth.createCustomToken(token.sub!)
                token.customToken = customToken
            }
            if (isNewUser == true) {
                try {
                    const userRef = doc(db, 'users', token.sub!);
                    setDoc(userRef, { joined_date: serverTimestamp(), username: "guess" }, { merge: true });
                } catch (error) {
                    console.log(error)
                }
            }
            return token
        },
        async session({ session, token, user }) {
            if (session?.user) {
                (session.user as any).id = token.sub as any
                (session as any).customToken = token.customToken
                // await signInWithCustomToken(auth, token.customToken as string)
            }
            return session
        },
    },
}
export default NextAuth(authOptions)