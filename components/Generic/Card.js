import clsx from "clsx";

const Card = ({ children, footer, className, ...rest }) => {
	return (
		<div
			{...rest}
			className={clsx(
				"flex flex-col w-full !px-8 !py-4",
				"bg-white rounded-md border-1 border-gray-200 overflow-hidden",
				className
			)}
		>
			{children}
			{footer && (
				<div
					className={clsx(
						"card-footer flex flex-col -mx-8 -mb-4 mt-4 px-8 py-4 ",
						"bg-gray-50 md:flex-row gap-4 md:gap-0 md:items-center md:justify-between"
					)}
				>
					{footer}
				</div>
			)}
		</div>
	);
};

export default Card;
