'use client'
import { useSession } from "next-auth/react"
import { signInWithCustomToken } from "firebase/auth";
import { useEffect } from "react";
import { auth } from "@/firebase/firebase-app";

export default function Home() {
  const { data: session, status } = useSession();

  useEffect(()  => {
    if (status === "authenticated") {
      signInWithCustomToken(auth, (session as any).customToken)
    }
  }, [status])

  return (
    <div className='flex justify-center'>
      <div>Home</div>
    </div>
  )
}
