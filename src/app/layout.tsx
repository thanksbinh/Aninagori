import './globals.css';
import type { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import React from 'react'

import { SessionProvider } from '@/app/SessionProvider';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import NavBar from '@/components/nav/NavBar';

export const metadata: Metadata = {
  title: 'Aninagori',
  description: 'Share your favourite Animemory with friends',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <head />
      <body>
        <SessionProvider session={session}>
          {/* @ts-expect-error Server Component */}
          <NavBar />

          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
