import NextAuth, { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { FirestoreAdapter } from "@next-auth/firebase-adapter"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "@/firebase/firebase-app"

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    appId: process.env.FIREBASE_APP_ID,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.FIREBASE_DATABASE_URL,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
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
    }
}
export default NextAuth(authOptions)