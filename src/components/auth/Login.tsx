'use client'
import { db } from "@/firebase/firebase-app";
import { collection, getDocs, query, where } from "firebase/firestore";
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation";
import { useState } from 'react'
import SignupPopup from "./SignupPopup";

const Login = () => {
  const [userInfo, setUserInfo] = useState({ userId: '', password: '' })
  const [openSignupPopup, setOpenSignupPopup] = useState(false)
  const [loginFail, setLoginFail] = useState(false)
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleSignInWithGoogle = async () => {
    signIn("google");
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    let res = await signIn('credentials', {
      email: userInfo.userId,
      password: userInfo.password,
      redirect: false
    });

    if (!res?.ok) {
      const usersRef = collection(db, "users")
      const usernameQuery = query(usersRef, where("username", "==", userInfo.userId))
      const querySnapshot = await getDocs(usernameQuery)
      
      if (querySnapshot.docs.length) {
        res = await signIn('credentials', {
          email: querySnapshot.docs[0].data().email,
          password: userInfo.password,
          redirect: false
        });
      }
    }

    setLoading(false)
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
          <label htmlFor="userId" className="block text-gray-700 font-bold mb-2">
            Email/ Username
          </label>
          <input
            type="text"
            id="userId"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="guess@aninagori.com"
            value={userInfo.userId}
            onChange={(e) => setUserInfo({ ...userInfo, userId: e.target.value })}
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

        {loginFail ? <div className="text-red-500"><p>Account not exits or wrong password</p><br /></div> : null}

        <div className="flex">
          {
            loading ? (
              <button disabled type="button" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                <svg aria-hidden="true" role="status" className="inline w-4 h-4 mr-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                  <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
                </svg>
                Logging in...
              </button>
            ) : (
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Login
              </button>
            )
          }
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