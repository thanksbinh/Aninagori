import { auth, db } from "@/firebase/firebase-app"
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import Modal from "@/components/auth/Modal";
import { updateProfile } from "firebase/auth";
import * as Yup from 'yup';
import { useFormik, FormikConfig, FormikErrors, FormikValues } from "formik";
import { collection, doc, getDocs, query, serverTimestamp, setDoc, where } from "firebase/firestore";

const SignupPopup = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
	const validate = async (values: FormikValues) => {
		const errors: FormikErrors<FormikValues> = {};

		const q = query(collection(db, "users"), where("email", "==", values.email));
		const querySnapshot = await getDocs(q);
		if (querySnapshot.docs.length) {
			errors.email = 'Account exists, try different email!';
		}
		return errors;
	};

	const handleSubmit = async (values: FormikValues) => {
		try {
			const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password)
			// Add user info to firebase
			await updateProfile(userCredential.user, { displayName: values.username })
			await setDoc(doc(db, "users", userCredential.user.uid), {
				email: values.email,
				emailVerified: null,
				image: null,
				joined_date: serverTimestamp(),
				name: values.username
			});
			await sendEmailVerification(userCredential.user!, {
				url: 'http://localhost:3000/?email=' + userCredential.user.email,
			})

			onClose();
		} catch (error) {
			console.log(error)
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
				.min(2, "Mininum 2 characters")
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
		</Modal>
	);
};

export default SignupPopup;
