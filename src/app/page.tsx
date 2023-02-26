'use client'
import { signOut } from 'next-auth/react';

export default function Home() {
  return (
    <div className='flex justify-between'>
      <div>Home</div>
      <button onClick={() => signOut()}> Sign out </button>
    </div>
  )
}
