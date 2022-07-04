import clsx from "clsx";

const Bar = ({
	color = "green",
	variant = "thick",
	className,
	widthClass,
	percentage = 0,
}) => {
	return (
		<div
			className={clsx(
				"relative bar",
				variant === "thick" && "h-4 rounded-sm",
				variant === "thin" && "h-2.5 rounded-full",
				className,
				widthClass,
			)}
		>
			{/* Progress bar background */}
			<div
				className={clsx(
					"absolute top-0 left-0 w-full",
					variant === "thick" &&
						"h-4 bg-gray-600 border-b-2 border-gray-700",
					variant === "thin" && "h-2.5 bg-gray-600 border-0 rounded-full",
					widthClass
				)}
			></div>

			{/* Progress bar main element */}
			<div
				className={clsx(
					"absolute top-0 left-0 w-0 transition-all",
					variant === "thick" && "h-4",
					variant === "thin" && "h-2.5 rounded-full",
					[
						color === "green" && [
							"bg-green-600",
							variant === "thick" &&
								"border-b-2 border-green-700",
						],
					],
					[
						color === "yellow" && [
							"bg-yellow-600",
							variant === "thick" &&
								"border-b-2 border-yellow-700",
						],
					],
					[
						color === "red" && [
							"bg-red-600",
							variant === "thick" && "border-b-2 border-red-700",
						],
					],
					[
						color === "blue" && [
							"bg-blue-600",
							variant === "thick" && "border-b-2 border-blue-700",
						],
					],
					"bar-stripes",
					widthClass
				)}
				style={{
					width: `${percentage}%`,
				}}
			></div>
		</div>
	);
};

export default Bar;
