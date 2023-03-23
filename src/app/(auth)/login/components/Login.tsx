'use client'

import { db } from '@/firebase/firebase-app';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { loginFields } from "../constants/formFields";
import FormAction from "./FormAction";
import FormExtra from "./FormExtra";
import Input from "./Input";
import SignInWithGoogle from './SignInWithGoogle';

const fields = loginFields;
let fieldsState = {} as any;
fields.forEach(field => fieldsState[field.id] = '');

export default function Login() {
  const [loginState, setLoginState] = useState(fieldsState);

  const [loginFail, setLoginFail] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleChange = (e: any) => {
    setLoginState({ ...loginState, [e.target.id]: e.target.value })
  }

  const handleSubmit = (e: any) => {
    e.preventDefault();
    authenticateUser();
  }

  //Handle Login API Integration here
  const authenticateUser = async () => {
    setLoading(true);
    let res = await signIn('credentials', {
      email: loginState.email_username,
      password: loginState.password,
      redirect: false
    });

    if (!res?.ok) {
      const usersRef = collection(db, "users")
      const usernameQuery = query(usersRef, where("username", "==", loginState.email_username))
      const querySnapshot = await getDocs(usernameQuery)

      if (querySnapshot.docs.length) {
        res = await signIn('credentials', {
          email: querySnapshot.docs[0].data().email,
          password: loginState.password,
          redirect: false
        });
      }
    }

    setLoading(false)
    if (res?.ok) {
      setLoginFail(false)
      router.push("/")
      router.refresh()
    } else {
      setLoginFail(true)
    }
  }

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      <div className="-space-y-px">
        {
          fields.map((field, id) =>
            <div className='my-5' key={id}>
              <Input
                key={field.id}
                handleChange={handleChange}
                value={loginState[field.id]}
                labelText={field.labelText}
                labelFor={field.labelFor}
                id={field.id}
                name={field.name}
                type={field.type}
                isRequired={field.isRequired}
                placeholder={field.placeholder}
              />
            </div>
          )
        }
      </div>

      <FormExtra />

      {loading ? (
        <button disabled type="button" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 mt-10">
          <svg aria-hidden="true" role="status" className="inline w-4 h-4 mr-3 text-gray-400 animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
          </svg>
          Logging in...
        </button>
      ) : (
        <FormAction handleSubmit={handleSubmit} text="Login" />
      )}

      <p className='text-gray-900 text-center mt-5'>or</p>

      <SignInWithGoogle />

    </form>
  )
}