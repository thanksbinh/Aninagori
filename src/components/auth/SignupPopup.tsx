import { auth, db } from "@/firebase/firebase-app"
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import Modal from "@/components/auth/Modal";
import { updateProfile } from "firebase/auth";
import * as Yup from 'yup';
import { useFormik, FormikConfig, FormikErrors, FormikValues } from "formik";
import { collection, doc, getDocs, query, serverTimestamp, setDoc, where } from "firebase/firestore";
import { useState } from "react";

const SignupPopup = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
	const [loading, setLoading] = useState(false);

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
		try {
			setLoading(true);
			const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password)
			// Add user info to firebase
			await updateProfile(userCredential.user, { displayName: values.username })
			await setDoc(doc(db, "users", userCredential.user.uid), {
				email: values.email,
				emailVerified: null,
				image: null,
				joined_date: serverTimestamp(),
				name: "",
				username: values.username
			});
			sendEmailVerification(userCredential.user!, {
				url: 'http://localhost:3000/?email=' + userCredential.user.email,
			})

			onClose();
		} catch (error) {
			console.log(error)
		} finally {
			setLoading(false);
		}
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

	return (
		<Modal isOpen={isOpen} onClose={onClose} title={""}>
			<div className="flex flex-col p-6 w-[500px]">
				<h2 className="text-2xl font-bold mb-4">Sign up</h2>
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

					<div className="mb-4">
						<label className="block text-gray-700 font-bold mb-2">
							Email
						</label>
						<input
							type="email"
							id="email"
							name="email"
							className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
							placeholder="guess@aninagori.com"
							value={formik.values.email}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							required
						/>

						{formik.errors.email && formik.touched.email && (
							<p className="text-red-500 text-sm">{formik.errors.email}</p>
						)}

					</div>

					<div className="mb-4">
						<label className="block text-gray-700 font-bold mb-2">
							Password
						</label>
						<input
							type="password"
							id="password"
							name="password"
							className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
							value={formik.values.password}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							required
						/>

						{formik.errors.password && formik.touched.password && (
							<p className="text-red-500 text-sm">{formik.errors.password}</p>
						)}

					</div>

					<div className="mb-4">
						<label className="block text-gray-700 font-bold mb-2">
							Confirm password
						</label>
						<input
							type="password"
							id="confirm_password"
							name="confirm_password"
							className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
							value={formik.values.confirm_password}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							required
						/>

						{formik.errors.confirm_password && formik.touched.confirm_password && (
							<p className="text-red-500 text-sm">{formik.errors.confirm_password}</p>
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
									Signing up...
								</button>
							) : (
								<button
									type="submit"
									disabled={formik.isSubmitting}
									className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
								>
									Sign up
								</button>
							)
						}

					</div>
				</form>
			</div>
		</Modal>
	);
};

export default SignupPopup;
