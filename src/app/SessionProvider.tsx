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

  useEffect(() => {
    console.log(session)
    if (session && session.status === 'authenticated') {
      signInWithCustomToken(auth, (session as any)?.data?.customToken).then(() => {
        setStatus('authenticated');
      });
    }
  }, [session]);

  useEffect(() => {
    if (session.status !== 'authenticated') {
      setStatus(session.status)
    }
  }, [session.status]);

  return { data: session.data, status };
}
