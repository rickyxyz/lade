import { MdOutlineHome, MdOutlineStyle, MdOutlineGroup } from "react-icons/md";
import { BsHouseDoor, BsQuestionOctagon, BsClipboardPlus, BsClipboardData } from "react-icons/bs";
import Link from "next/link";
import clsx from "clsx";

const Side = () => {
	const links = [
		{ name: "Home", href: "/problems", icon: <BsHouseDoor /> },
		// { name: "Contests", href: "/contests", icon: <BsClipboardData /> },
		{ name: "New Problem", href: "/problems/new", icon: <BsQuestionOctagon /> },
		// { name: "New Contest", href: "/contests/new", icon: <BsClipboardPlus /> },
	];
	
	return (
		<aside className="w-64 border-r-2 h-screen fixed left-0 top-16">
			<ul>
				{links.map((link) => {
					return (
						<Link key={link.href} href={link.href}>
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
