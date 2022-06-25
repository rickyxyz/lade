import clsx from "clsx";

const Bar = ({ color = "green", className, percentage = 0 }) => {
	return (
		<div
			className={clsx(
				"relative h-4",
				"rounded-sm bar",
				className
			)}
		>
			{/* Progress bar background */}
			<div
				className={clsx(
					"absolute top-0 left-0 h-4 w-full",
					"bg-gray-200 border-b-2 border-gray-300"
				)}
			></div>

			{/* Progress bar main element */}
			<div
				className={clsx(
					"absolute top-0 left-0 h-4 w-0 transition-all",
					[
						color === "green" &&
							"bg-green-600 border-b-2 border-green-700",
					],
					[
						color === "yellow" &&
							"bg-yellow-600 border-b-2 border-yellow-700",
					],
					[
						color === "red" &&
							"bg-red-600 border-b-2 border-red-700",
					],
					"bar-stripes"
				)}
				style={{
					width: `${percentage}%`,
				}}
			></div>
		</div>
	);
};

export default Bar;
