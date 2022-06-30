import Head from "next/head";
import { useContext } from "react";
import { useRouter } from "next/router";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { FirebaseContext, getData, getErrorMessage, postData } from "../components/firebase";
import FormTemplate from "../components/FormTemplate";
import * as Yup from "yup";
import { genericToast, ToastContext } from "../components/Generic/Toast";
import { connect } from "react-redux";
import { mapDispatchToProps, mapStateToProps } from "../components/Redux/setter";
import Meta from "../components/Generic/Meta";

const RegisterSchema = Yup.object().shape({
	email: Yup.string()
		.email("Email is in the wrong format!")
		.required("Email is required!"),
	username: Yup.string()
		.min(4, "Username is too short!")
		.max(20, "Username is too long!")
		.required("Username is required!"),
	password: Yup.string()
		.min(6, "Password is too short!")
		.max(30, "Password is too long!")
		.required("Password is required!"),
});

const Register = ({ loginUser }) => {
	const auth = getAuth();
	const router = useRouter();
	const { db } = useContext(FirebaseContext);

	// Contexts to invoke toasts.
	const { addToast } = useContext(ToastContext);

	async function register(values) {
		return await new Promise((res, rej) => {
			createUserWithEmailAndPassword(
				auth,
				values["email"],
				values["password"]
			)
				.then(async (cred) => {
					const userData = {
						email: values["email"],
						username: values["username"],
                        level: 1,
                        experience: 0
					};
					
					await postData(db, `user/${cred.user.uid}`, userData);
					loginUser(userData);
				})
				.then(() => {
					router.push("/problems");
					addToast({
						title: "Login Success!",
						desc: "Welcome to the site!",
						variant: "success",
					});
					res(null);
				})
				.catch((error) => {
					const detail = getErrorMessage(error.code);
					const toastType = detail.type === "generic" ? "generic-fail" : "form-improper";
					
					addToast(genericToast(toastType));
					rej(getErrorMessage(error.code));
				});
		});
	}

	/*	Firebase's default auth system only knows the email and password of user, so
		naturally its validation system doesn't support checking existing username.
		So I made one myself -jose- */
	async function usernameIsUnique(value) {
		return await getData(db, "/user")
			.then((result) => {
				if(!result)
					return true;
				
				let unique = true;
				for (const [id, user] of Object.entries(result)) {
					console.log([id, user]);
					if (user.username === value) {
						unique = false;
						addToast(genericToast("form-improper"));
						break;
					}
				}
				return unique;
			})
			.catch((e) => {
				console.log(e);
				return false;
			});
	}

	return (
		<>
			<Meta page="Register" />
			<FormTemplate
				title="Register"
				formik={{
					initialValues: {
						email: "",
						username: "",
						password: "",
					},
					validationSchema: RegisterSchema,
					onSubmitValidation: usernameIsUnique,
					onSubmitValidationError: {
						type: "username",
						message: "Username is already taken!",
					},
					onSubmit: register,
				}}
				fields={[
					{
						title: "Email",
						id: "email",
						type: "email",
					},
					{
						title: "Username",
						id: "username",
						type: "username",
					},
					{
						title: "Password",
						id: "password",
						type: "password",
					},
				]}
				callback={{ success: () => console.log("Success") }}
			/>
		</>
	);
};

export default connect(mapStateToProps, mapDispatchToProps)(Register);
