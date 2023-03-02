'use client'
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation";
import { useState } from 'react'
import SignupPopup from "./SignupPopup";

const Login = () => {
  const [userInfo, setUserInfo] = useState({ email: '', password: '' })
  const [openSignupPopup, setOpenSignupPopup] = useState(false)
  const [loginFail, setLoginFail] = useState(false)
  const router = useRouter()

  const handleSignInWithGoogle = async () => {
    signIn("google");
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await signIn('credentials', {
      email: userInfo.email,
      password: userInfo.password,
      redirect: false
    });

    if (res?.ok) {
      setLoginFail(false)
      router.refresh()
    } else {
      setLoginFail(true)
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 font-bold mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Email"
            value={userInfo.email}
            onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
          />
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="block text-gray-700 font-bold mb-2">
            Password
          </label>
          <input
            type="password"
            id="password"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Password"
            value={userInfo.password}
            onChange={(e) => setUserInfo({ ...userInfo, password: e.target.value })}
          />
        </div>

        {loginFail ? <div className="text-red-500"><p>Email not exits or wrong password</p><br /></div> : null}

        <div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Login
          </button>
        </div>
      </form>
      <div>
        <button
          onClick={() => setOpenSignupPopup(!openSignupPopup)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Sign Up
        </button>
      </div>
      <button
        onClick={() => handleSignInWithGoogle()}
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4"
      >
        Login with Google
      </button>

      <SignupPopup isOpen={openSignupPopup} onClose={() => setOpenSignupPopup(false)} />
    </div>
  );
};

export default Login;