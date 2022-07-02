import { CgPlayListRemove } from "react-icons/cg";
import { HiLockClosed } from "react-icons/hi";
import { GoGlobe } from "react-icons/go";
import clsx from "clsx";

const Visibility = ({ visibility, important }) => {

	const style = clsx((important) ? "w-8 h-8" : "");

	return (
		<div className="mr-2 text-gray-600">
			{ visibility === 0 && (
				<GoGlobe className={style} />
			) }
			{ visibility === 1 && (
				<CgPlayListRemove className={style} />
			) }
			{ visibility === 2 && (
				<HiLockClosed className={style} />
			) }
		</div>
	);
};

export default Visibility;