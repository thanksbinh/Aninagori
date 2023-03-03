'use client'
import { db } from "@/firebase/firebase-app"
import * as Yup from 'yup';
import { useFormik, FormikConfig, FormikErrors, FormikValues } from "formik";
import { collection, doc, getDocs, query, setDoc, where } from "firebase/firestore";
import { useSession } from "next-auth/react";

const UsernamePopup = () => {
	const session = useSession();

	// Todo: Move this to server side
	const handleSubmit = async (values: FormikValues) => {
		try {
			const userRef = doc(db, 'users', (session as any).data.user?.id);
			setDoc(userRef, { username: values.username }, { merge: true });

		} catch (error) {
			console.log(error)
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
					<label className="block text-gray-700 font-bold mb-2">
						Username
					</label>
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
					<button
						type="submit"
						disabled={formik.isSubmitting}
						className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
					>
						Sign up
					</button>
				</div>
			</form>
		</div>
	);
};

export default UsernamePopup;
