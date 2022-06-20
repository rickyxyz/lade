import clsx from "clsx";

const Property = ({ name, children, classWrapper, classInput }) => {
	return (
		<article
			className={clsx(
				"flex flex-row",
				"mt-4 first:mt-0",
			)}
		>
			<label className="small-head w-40 py-2" htmlFor={`input-${name}`}>{name}</label>
			<div className={clsx("w-4/6 flex flex-row items-center")}>{children}</div>
		</article>
	);
};

export default Property;
