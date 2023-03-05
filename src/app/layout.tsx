import Link from 'next/link';
import './globals.css';
import { Navbar } from '@/components';

export const metadata = {
  title: 'Aninagori',
  description: 'Share your favorite Animemory with friends!',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head></head>
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
