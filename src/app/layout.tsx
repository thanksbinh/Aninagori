import { Navbar } from '@/components';
import './globals.css';
import type { Metadata } from 'next'
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { doc, getDoc } from 'firebase/firestore';

import { SessionProvider } from '@/components/auth/SessionProvider';
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import Login from '@/components/auth/Login';
import ProfilePicture from '@/components/nav/ProfilePicture';
import { db } from '@/firebase/firebase-app';
import UsernamePopup from '@/components/auth/SetUsername';

export const metadata: Metadata = {
  title: 'Aninagori',
  description: 'Share your favourite Animemory with friends',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)

  let userimage = ''
  let username = ''

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

  const docRef = doc(db, "users", (session.user as any).id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    userimage = docSnap.data().image
    username = docSnap.data().username
  } else {
    console.log("No such document!");
  }

  if (username === "guess") {
    return (
      <html lang='en'>
        <head />
        <body>
          <SessionProvider session={session}>
            <UsernamePopup />
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
          <nav className="py-2 border-b-2 px-4 flex justify-between items-center">
            <div className="flex items-center">
              <Link href="/" className="text-lg font-semibold">
                Aninagori
              </Link>
            </div>
            <div className="flex items-center">
              <ProfilePicture userimage={userimage} username={username} />
            </div>
          </nav>

          {children}
        </SessionProvider>
      </body>
    </html>
  )
}
