import clsx from "clsx";

const FrameHead = ({ height = "small", children }) => {
	return (
		<div className={clsx(`fixed top-16 w-full z-50 bg-white`, [
			height === "small" && "h-44",
			height === "tall" && "h-64" ,
		])}>
			{ children }
		</div>
	);
};

export default FrameHead;
