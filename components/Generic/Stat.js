import clsx from "clsx";

const Stat = ({ className, title, icon, value }) => {
	return (
		<div className={clsx("flex flex-row items-center mr-4", className)} title={title}>
			{icon}
			<span className="ml-2 text-sm">{value}</span>
		</div>
	);
};

export default Stat;