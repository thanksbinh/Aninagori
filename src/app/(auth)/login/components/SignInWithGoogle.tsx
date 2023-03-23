'use client'

import { signIn } from 'next-auth/react';
import { loginFields } from "../constants/formFields";

const fields = loginFields;
let fieldsState = {} as any;
fields.forEach(field => fieldsState[field.id] = '');

export default function SignInWithGoogle() {
  const handleSignInWithGoogle = async () => {
    signIn("google", {
      callbackUrl: "/"
    });
  }

  return (
    <button onClick={handleSignInWithGoogle} type="button" className="text-white bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-[#4285F4]/50 text-center items-center dark:focus:ring-[#4285F4]/55 mr-2 mb-2 group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 mt-5">
      <svg className="w-4 h-4 mr-2 -ml-1" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path></svg>
      Continue with Google
    </button>
  )
}