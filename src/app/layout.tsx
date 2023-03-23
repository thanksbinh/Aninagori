import { refreshUserToken } from "@/components/utils/refreshToken";
import type { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import React from 'react';
import './globals.css';

import { SessionProvider } from '@/app/SessionProvider';
import NavBar from '@/components/nav/NavBar';
import { authOptions } from '@/pages/api/auth/[...nextauth]';

export const metadata: Metadata = {
  title: 'Aninagori',
  description: 'Share your favorite Animemory with friends',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  refreshUserToken(session)
  const myUserId = (session as any)?.user?.id

  return (
    <html lang="en">
      <head />
      <body className='bg-ani-gray'>
        <main className='bg-ani-gray'>
          <SessionProvider session={session}>
            {/* @ts-expect-error Server Component */}
            <NavBar myUserId={myUserId} />
            {children}
          </SessionProvider>
        </main>
      </body>
    </html>
  )
}
