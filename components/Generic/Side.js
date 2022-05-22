import { MdOutlineHome, MdOutlineStyle, MdOutlineGroup } from "react-icons/md";
import Link from "next/link";
import clsx from "clsx";

const Side = () => {
	const links = [
		{ name: "Home", icon: <MdOutlineHome /> },
		{ name: "Tags", icon: <MdOutlineStyle /> },
		{ name: "Groups", icon: <MdOutlineGroup /> },
	];
	
	return (
		<aside className="w-64 border-r-2 h-screen fixed left-0 top-16">
			<ul>
				{links.map((link) => {
					return (
						<Link key={link.name} href="/">
							<a>
								<li
									className={clsx(
										"flex flex-row items-center",
										"h-12 py-2 pl-8",
										"hover:bg-blue-100 hover:border-r-4 hover:border-blue-400"
									)}
								>
									{link.icon}
									<span className="ml-4">
										{link.name}
									</span>
								</li>
							</a>
						</Link>
					);
				})}
			</ul>
		</aside>
	);
};

export default Side;
