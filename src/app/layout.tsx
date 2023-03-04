import './globals.css';
import type { Metadata } from 'next'
import { getServerSession } from 'next-auth';

import { SessionProvider } from '@/components/auth/SessionProvider';
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import Login from '@/components/auth/Login';
import NavBar from '@/components/nav/NavBar';

export const metadata: Metadata = {
  title: 'Aninagori',
  description: 'Share your favourite Animemory with friends',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return (
      <html lang='en'>
        <head />
        <body>
          <SessionProvider session={session}>
            <Login />
            {/* Todo: use favicon without children */}
            <div className='hidden'>{children}</div>
          </SessionProvider>
        </body>
      </html>
    )
  }

  return (
    <html lang='en'>
      <head />
      <body>
        <SessionProvider session={session}>
          {/* @ts-expect-error Server Component */}
          <NavBar session={session} />

          <div>
            {children}
          </div>
        </SessionProvider>
      </body>
    </html>
  )
}
