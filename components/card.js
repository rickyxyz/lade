import clsx from "clsx";

const Card = ({ children, className, ...rest }) => {
	return (
		<div
			{ ...rest }
			className={clsx(
				"flex flex-col w-full",
				"bg-white rounded-md border-1 border-gray-200",
				className,
			)}
		>
			{children}
		</div>
	);
}

export default Card;