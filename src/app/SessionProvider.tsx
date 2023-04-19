'use client';

import { auth } from '@/firebase/firebase-app';
import { signInWithCustomToken } from 'firebase/auth';
import { Session } from 'next-auth';
import { SessionProvider as Provider, useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';

type Props = {
  children: React.ReactNode;
  session: Session | null;
};

export function SessionProvider({ children, session }: Props) {
  return (
    <Provider session={session}>
      {children}
    </Provider>
  )
}

export const useFirebaseSession = () => {
  const session = useSession();
  const [status, setStatus] = useState(session.status);

  const signIn = async () => {
    try {
      await signInWithCustomToken(auth, (session as any)?.data?.customToken);
      setStatus('authenticated');
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    // Test
    console.log("session", session)

    if (session && session.status === 'authenticated') {
      signIn();
    }

    // Test
    auth.onAuthStateChanged((user) => {
      console.log("onAuthStateChanged", user)
    });
  }, [session]);

  useEffect(() => {
    if (session.status !== 'authenticated') {
      setStatus(session.status)
    }
  }, [session.status]);

  return { data: session.data, status };
}
