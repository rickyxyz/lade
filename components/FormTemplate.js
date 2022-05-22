import { useState } from "react";
import { Formik, Field, Form } from "formik";
import clsx from "clsx";
import Button from "../components/Generic/Button";
import ShapeDivider from "./Generic/ShapeDivider";

const FormTemplate = ({ title, formik, fields, callback }) => {
	const [loading, setLoading] = useState(false);
	const [firebaseErrors, setFirebaseErrors] = useState({});
	const cb = { ...callback, fail: (message) => console.log(message) };

	async function onSubmit(values, actions) {
		function success() {
			setLoading(false);
			cb.success();
		}

		function fail(e) {
			setFirebaseErrors({
				[e.type]: e.message,
			});
			setLoading(false);
			cb.fail(e);
		}

		async function submitAction() {
			await formik
				.onSubmit(values)
				.then((result) => {
					success();
				})
				.catch((e) => {
					fail(e);
				});
		}

		setLoading(true);

		// Final Validation
		let canContinue = true,
			error;
		if (formik.onSubmitValidation) {
			canContinue = await formik
				.onSubmitValidation(values["username"])
				.then((result) => {
					if (!result) error = formik.onSubmitValidationError;
					return result;
				})
				.catch((e) => {
					error = e;
					return false;
				});
		}

		if (canContinue) {
			submitAction();
		} else {
			fail(error);
		}
	}

	return (
		<main
			className={clsx(
				"relative flex flex-row justify-center items-center",
				"w-full h-exclude-navbar overflow-hidden"
			)}
		>
			<div className="absolute top-1/2 left-0 w-full z-0">
				<ShapeDivider />
				<div className="bg-gray-200 w-full h-screen"></div>
			</div>
			<div className="w-96 p-8 border-2 border-gray-400 bg-white rounded-md z-40">
				<h2 className="h3 mb-8">{title}</h2>
				<Formik
					initialValues={formik.initialValues}
					validationSchema={formik.validationSchema}
					onSubmit={async (values, actions) =>
						onSubmit(values, actions)
					}
				>
					{({ errors, touched }) => (
						<Form className="flex flex-col">
							{fields.map((field) => (
								<div
									key={field.id}
									className="flex flex-col mb-4"
								>
									<label
										className="text-gray-600"
										htmlFor={field.id}
									>
										{field.title}
									</label>
									<Field
										id={field.id}
										className="px-4 py-2 border-2"
										name={field.id}
										type={field.type}
										onBlur={() =>
											setFirebaseErrors({
												...firebaseErrors,
												[field.id]: null,
											})
										}
										validate={field.validate}
									/>

									{(errors[field.id] ||
										firebaseErrors[field.id]) &&
										touched[field.id] && (
											<div className="mt-1 text-right text-red-500">
												{errors[field.id] ||
													firebaseErrors[field.id]}
											</div>
										)}
								</div>
							))}
							<Button
								className="mt-2"
								type="submit"
								loading={loading}
							>
								Submit
							</Button>
						</Form>
					)}
				</Formik>
			</div>
		</main>
	);
};

export default FormTemplate;
