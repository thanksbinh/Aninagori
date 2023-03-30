import { refreshUserToken } from "@/components/utils/refreshToken";
import type { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import React from 'react';
import './globals.css';

import { SessionProvider } from '@/app/(auth)/SessionProvider';
import NavBar from '@/components/nav/NavBar';
import { authOptions } from '@/pages/api/auth/[...nextauth]';

export const metadata: Metadata = {
  title: 'Aninagori',
  description: 'Share your favorite Animemory with friends',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  refreshUserToken(session)

  return (
    <html lang="en">
      <head />
      <body className='bg-ani-black'>
        <main className='bg-ani-black'>
          <SessionProvider session={session}>
            {/* @ts-expect-error Server Component */}
            <NavBar myUserId={(session as any)?.user?.id} />
            {children}
          </SessionProvider>
        </main>
      </body>
    </html>
  )
}
