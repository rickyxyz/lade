import clsx from "clsx";

const FrameHead = ({ height = "small", children }) => {
	return (
		<div className={clsx(`fixed top-16 w-full z-20 bg-white`, [
			height === "small" && "h-54",
			height === "tall" && "h-60" ,
		])}>
			{ children }
		</div>
	);
};

export default FrameHead;
