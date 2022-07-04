import clsx from "clsx";

const Stat = ({ className, title, icon, value }) => {
	return (
		<div className={clsx("w-48 flex flex-col", "p-4 border-2 border-gray-200 rounded-md", className)}>
			<span>{title}</span>
			<span className="self-end text-2xl">{value}</span>
		</div>
	);
};

export default Stat;