import clsx from "clsx";
import pushid from "pushid";
import { createContext, startTransition, useContext, useEffect } from "react";
import { BsFillExclamationTriangleFill, BsFillCheckCircleFill } from "react-icons/bs";

export const ToastContext = createContext({
	toasts: null,
	setToasts: [],
	addToast: null,
});

const toastIconClass = "w-8 h-8";

export function genericToast(id) {
	switch(id) {
		case "form-improper":
			return {
				title: "Oops!",
				desc: "There are errors in the form.",
				variant: "danger",
			};
		case "generic-fail":
			return {
				title: "Oops!",
				desc: "Something went wrong.",
				variant: "danger",
			};
		case "get-fail":
			return {
				title: "Oops!",
				desc: "Data could not be fetched.",
				variant: "danger",
			};
		case "post-fail":
			return {
				title: "Too bad...",
				desc: "Data could not be updated.",
				variant: "danger",
			};
	}
}

const ToastIcon = ({ variant }) => {
	return (
		<div className="flex justify-center items-center mr-4">
			{ variant === "danger" && <BsFillExclamationTriangleFill className={clsx(toastIconClass, "text-red-600")} /> }
			{ variant === "success" && <BsFillCheckCircleFill className={clsx(toastIconClass, "text-green-600")} /> }
		</div>
	);
}

export const ToastWrapper = () => {
	const { toasts, setToasts } = useContext(ToastContext);

	// Animate new toasts upon arrival.
	useEffect(() => {
		const toastElements = document.querySelectorAll(".toast-hidden");
		setTimeout(() => {
			if(!toastElements)
				return;
			if(toastElements.length === 0)
				return;
			console.log(toastElements);
			toastElements.forEach((toast) => {
				toast.classList.toggle("toast-hidden");
				toast.classList.toggle("toast");
			});
		}, 10);
	}, [ toasts ]);

	// Each 100 miliseconds, check if toasts are about to expire and animate their departure.
	useEffect(() => {
		const interval = setInterval(() => {
			setToasts(t => t.filter((toast) => {
				const now = new Date();
				const preExpire = new Date(toast.createdAt.getTime()  + 1000 * (toast.time));
				const expire = new Date(toast.createdAt.getTime()  + 1000 * (toast.time + 1));
				if(now >= preExpire && now < expire) {
					const te = document.getElementById(toast.id);
					if(!te.className.includes("toast-die")) {
						te.classList.toggle("toast");
						te.classList.toggle("toast-die");
					}
				}
				return !(now >= expire);
			}));
			return true;
		}, 100);

		// Clean up to prevent memory leak.
		return () => {
			clearInterval(interval);
		};
	}, [])

	return (
		<section
			className={clsx(
				"fixed right-16 bottom-16 w-96",
				"flex flex-col-reverse gap-8 justify-center z-50",
			)}
		>
			{toasts.map(({ id, title, desc, createdAt, time, variant }) => (
				<article
					key={id}
					id={id}
					className={clsx(
						"flex flex-row",
						"toast-hidden relative w-full py-4 px-8",
						"shadow-lg rounded-md transition-all duration-600",
						variant === "danger" && "bg-red-100",
						variant === "success" && "bg-green-100"
					)}
				>
					<ToastIcon variant={variant} />
					<div>
						<h3
							className={clsx(
								variant === "danger" && "text-red-600",
								variant === "success" && "text-green-600",
								"leading-6"
							)}
						>
							{title}
						</h3>
						<p>{desc}</p>
					</div>
				</article>
			))}
		</section>
	);
};
