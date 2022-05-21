import { MdSearch } from "react-icons/md";
import Image from "next/image";
import clsx from "clsx";
import Button from "./Button";

const Navbar = () => {
	return (
		<nav
			className={clsx(
				"flex flex-row items-center justify-between fixed top-0",
				"w-full h-16 px-8",
				"border-b-2 bg-white z-30"
			)}
		>
			<div id="navbar-left" className="flex items-center mr-8">
				<Image src="/assets/lade.webp" width="96" height="32"  />
			</div>
			<div
				id="navbar-mid"
				className="flex-grow flex align-center justify-center relative"
			>
				<input placeholder="Search" className=" w-full h-10 pl-16 pr-8 border-2 rounded-lg" />
				<MdSearch className="absolute left-6 top-2 w-6 h-6 text-gray-500" />
			</div>
			<div id="navbar-right" className="flex flex-row items-center ml-4">
				<Button variant="ghost">
					Log In
				</Button>
				<span className="border-l-2 mx-2"></span>
				<Button>Sign Up</Button>
			</div>
		</nav>
	);
};

export default Navbar;
