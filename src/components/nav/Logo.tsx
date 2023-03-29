'use client'

import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Logo = () => {
  const router = useRouter()

  const handleOnClick = () => {
    // router.refresh()
    // console.log(window.location.href)
    // if (window.location.href == process.env.NEXT_PUBLIC_BASE_URL) window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }

  return (
    <a href="/" onClick={handleOnClick} className="text-lg font-semibold">
      <img src="logo.png" alt="logo" className='h-10' />
    </a>
  );
};

export default Logo;
