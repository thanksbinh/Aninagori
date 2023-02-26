import { SessionProvider } from '@/components/SessionProvider';
import Link from 'next/link';
import './globals.css';
import { getServerSession } from 'next-auth';
import { authOptions } from "../pages/api/auth/[...nextauth]";
import Login from '@/components/Login';

export const metadata = {
  title: 'Aninagori',
  description: 'Share your favorite Animemory with friends!',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)

  return (
    <html>
      <head />
      <body>
        <SessionProvider session={session}>
          {!session ? (
            <Login />
          ) : (
            <div>
              <nav className='flex justify-between'>
                <Link href="/">Aninagori</Link>
                <img
                  src={session.user?.image!}
                  alt="profile picture"
                  className='h-12 w-12 rounded-full cursor-pointer'
                />
              </nav>

              {children}
            </div>
          )}
        </SessionProvider>
      </body>
    </html>
  )
}
