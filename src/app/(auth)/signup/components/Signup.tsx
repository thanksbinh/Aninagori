'use client'

import { auth, db } from '@/firebase/firebase-app';
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from 'firebase/auth';
import { setDoc, doc, serverTimestamp, collection, getDocs, query, where } from 'firebase/firestore';
import { FormikValues, FormikErrors, useFormik, FormikConfig } from 'formik';
import { signupFields } from '../constants/formFields';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Input from '../../login/components/Input';
import FormAction from '../../login/components/FormAction';
import SignInWithGoogle from '../../login/components/SignInWithGoogle';

const fields = signupFields;
let fieldsState = {} as any;

fields.forEach(field => fieldsState[field.id] = '');

export default function Signup() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const validate = async (values: FormikValues) => {
    const errors: FormikErrors<FormikValues> = {};

    const usersRef = collection(db, "users")

    const emailQuery = query(usersRef, where("email", "==", values.email));
    const querySnapshot1 = await getDocs(emailQuery);
    if (querySnapshot1.docs.length) {
      errors.email = 'Account exists, try different email!';
    }

    const usernameQuery = query(usersRef, where("username", "==", values.username));
    const querySnapshot2 = await getDocs(usernameQuery);
    if (querySnapshot2.docs.length) {
      errors.username = 'Username exists, try different name!';
    }

    return errors;
  };

  const handleSubmit = async (values: FormikValues) => {
    await createAccount(values)
    router.push("/login")
  }

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
      confirm_password: ""
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .matches(/^[a-zA-Z0-9_]*$/, 'Username must not contain special characters')
        .min(4, "Mininum 4 characters")
        .max(15, "Maximum 15 characters")
        .required("Required!"),
      email: Yup.string()
        .email("Invalid email format")
        .required("Required!"),
      password: Yup.string()
        .min(8, "Minimum 8 characters")
        .required("Required!"),
      confirm_password: Yup.string()
        .oneOf([Yup.ref("password")], "Password's not match")
        .required("Required!")
    }),
    onSubmit: handleSubmit, validate
  } as FormikConfig<{
    username: string;
    email: string;
    password: string;
    confirm_password: string;
  }>
  );

  const createAccount = async (values: FormikValues) => {
    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password)
      const updateProfilePromise = updateProfile(userCredential.user, { displayName: values.username })
      const setDocPromise = setDoc(doc(db, "users", userCredential.user.uid), {
        email: values.email,
        emailVerified: null,
        image: null,
        joined_date: serverTimestamp(),
        name: "",
        username: values.username
      });
      const emailVerificationPromise = sendEmailVerification(userCredential.user!, {
        url: 'https://aninagori.vercel.app/?email=' + userCredential.user.email,
      })
      await Promise.all([updateProfilePromise, setDocPromise, emailVerificationPromise])
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="mt-8 space-y-6" onSubmit={formik.handleSubmit}>
      <div className="">
        <div className='my-5'>
          <Input
            key={fields[0].id}
            handleChange={formik.handleChange}
            value={formik.values.username}
            labelText={fields[0].labelText}
            labelFor={fields[0].labelFor}
            id={fields[0].id}
            name={fields[0].name}
            type={fields[0].type}
            isRequired={fields[0].isRequired}
            placeholder={fields[0].placeholder}
            onBlur={formik.handleBlur}
          />

          {formik.errors.username && formik.touched.username && (
            <p className="text-red-500 text-sm">{formik.errors.username}</p>
          )}
        </div>

        <div className='my-5'>
          <Input
            key={fields[1].id}
            handleChange={formik.handleChange}
            value={formik.values.email}
            labelText={fields[1].labelText}
            labelFor={fields[1].labelFor}
            id={fields[1].id}
            name={fields[1].name}
            type={fields[1].type}
            isRequired={fields[1].isRequired}
            placeholder={fields[1].placeholder}
            onBlur={formik.handleBlur}
          />

          {formik.errors.email && formik.touched.email && (
            <p className="text-red-500 text-sm">{formik.errors.email}</p>
          )}
        </div>

        <div className='my-5'>
          <Input
            key={fields[2].id}
            handleChange={formik.handleChange}
            value={formik.values.password}
            labelText={fields[2].labelText}
            labelFor={fields[2].labelFor}
            id={fields[2].id}
            name={fields[2].name}
            type={fields[2].type}
            isRequired={fields[2].isRequired}
            placeholder={fields[2].placeholder}
            onBlur={formik.handleBlur}
          />

          {formik.errors.password && formik.touched.password && (
            <p className="text-red-500 text-sm">{formik.errors.password}</p>
          )}
        </div>

        <div className='my-5'>
          <Input
            key={fields[3].id}
            handleChange={formik.handleChange}
            value={formik.values.confirm_password}
            labelText={fields[3].labelText}
            labelFor={fields[3].labelFor}
            id={fields[3].id}
            name={fields[3].name}
            type={fields[3].type}
            isRequired={fields[3].isRequired}
            placeholder={fields[3].placeholder}
            onBlur={formik.handleBlur}
          />

          {formik.errors.confirm_password && formik.touched.confirm_password && (
            <p className="text-red-500 text-sm">{formik.errors.confirm_password}</p>
          )}
        </div>

        {loading ? (
          <button disabled type="button" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 mt-10">
            <svg aria-hidden="true" role="status" className="inline w-4 h-4 mr-3 text-gray-400 animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
            </svg>
            Signing up...
          </button>
        ) : (
          <FormAction handleSubmit={formik.handleSubmit} text="Signup" />
        )}



        <p className='text-gray-900 text-center mt-5'>or</p>

        <SignInWithGoogle />

      </div>
    </form>
  )
}