import clsx from "clsx";

export const ProblemCardSK = ({ className }) => (
	<div className={className}>
		<div className={"skeleton w-2/6 h-4"}>
		</div>
		<div className="skeleton w-full h-4 mt-2">
		</div>
		<div className="skeleton w-full h-4 mt-2">
		</div>
		<div className="skeleton w-full h-4 mt-2">
		</div>
	</div>
);

export const CircleLoad = () => (
	<div className="lds-dual-ring"></div>
);