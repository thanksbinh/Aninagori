import './globals.css';
import type { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import React from 'react';

import { SessionProvider } from '@/app/SessionProvider';
import { doc, updateDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import NavBar from '@/components/nav/NavBar';
import { db } from '@/firebase/firebase-app';
import qs from 'qs';
import { refreshUserToken } from '@/components/utils/refreshToken';

export const metadata: Metadata = {
  title: 'Aninagori',
  description: 'Share your favourite Animemory with friends',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  refreshUserToken(session);
  return (
    <html lang="en">
      <head />
      <body>
        <main className="bg-ani-gray">
          <SessionProvider session={session}>
            {/* @ts-expect-error Server Component */}
            <NavBar />
            {children}
          </SessionProvider>
        </main>
      </body>
    </html>
  );
}
