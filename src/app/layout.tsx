import { Navbar } from '@/components';
import Link from 'next/link';
import './globals.css';

export const metadata = {
  title: 'Aninagori',
  description: 'Share your favorite Animemory with friends!',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head></head>
      <body>
        <main>
          <Navbar />
          {children}
        </main>
      </body>
    </html>
  )
}
