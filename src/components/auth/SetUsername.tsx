'use client'
import { db } from "@/firebase/firebase-app"
import * as Yup from 'yup';
import { useFormik, FormikConfig, FormikValues } from "formik";
import { collection, doc, getDocs, query, setDoc, where } from "firebase/firestore";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const UsernamePopup = () => {
	const session = useSession();
	const router = useRouter();
	const [loading, setLoading] = useState(false)

	// Todo: Move this to server side
	const handleSubmit = async (values: FormikValues) => {
		try {
			setLoading(true);
			const userRef = doc(db, 'users', (session as any).data.user?.id);
			await setDoc(userRef, { username: values.username }, { merge: true });
			router.refresh();

		} catch (error) {
			console.log(error)
		} finally {
			setLoading(false);
		}
	}

	const formik = useFormik({
		initialValues: {
			username: "",
		},
		validationSchema: Yup.object({
			username: Yup.string()
				.matches(/^[a-zA-Z0-9_]*$/, 'Username must not contain special characters')
				.min(2, "Mininum 2 characters")
				.max(15, "Maximum 15 characters")
				.required("Required!")
				.test("username-exists", "Username exists, try different name!", async (value) => {
					const usersRef = collection(db, "users")
					const usernameQuery = query(usersRef, where("username", "==", value))
					const querySnapshot = await getDocs(usernameQuery)
					return querySnapshot.docs.length == 0
				})
		}),
		onSubmit: handleSubmit
	} as FormikConfig<{
		username: string;
	}>
	);

	return (
		<div className="flex flex-col p-6 w-[500px]">
			<h2 className="text-2xl font-bold mb-4">Set username</h2>
			<form className="flex flex-col" onSubmit={formik.handleSubmit}>
				<div className="mb-4">
					<input
						type="text"
						id="username"
						name="username"
						className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
						value={formik.values.username}
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
						required
					/>

					{formik.errors.username && formik.touched.username && (
						<p className="text-red-500 text-sm">{formik.errors.username}</p>
					)}

				</div>

				<div>
					{
						loading ? (
							<button disabled type="button" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
								<svg aria-hidden="true" role="status" className="inline w-4 h-4 mr-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
									<path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
								</svg>
								Saving...
							</button>
						) : (
							<button
								type="submit"
								disabled={formik.isSubmitting}
								className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
							>
								Save
							</button>
						)
					}

				</div>
			</form>
		</div>
	);
};

export default UsernamePopup;
