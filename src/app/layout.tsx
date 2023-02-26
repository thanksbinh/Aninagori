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
          <nav>
            <Link href="/">
              Aninagori
            </Link>
          </nav>
          {children}
        </main>
      </body>
    </html>
  )
}
