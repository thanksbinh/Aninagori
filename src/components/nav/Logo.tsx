'use client'

import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Logo = () => {
  const router = useRouter()

  const handleOnClick = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    router.refresh()
  }

  return (
    <Link href="/" onClick={handleOnClick} className="text-lg font-semibold">
      Aninagori
    </Link>
  );
};

export default Logo;
