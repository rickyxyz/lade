import { MdOutlineHome } from "react-icons/md";
import { MdOutlineStyle } from "react-icons/md";
import { MdOutlineGroup } from "react-icons/md";

export default function Sidebar() {
    const links = [
        { name: "Home", icon: <MdOutlineHome/> },
        { name: "Tags", icon: <MdOutlineStyle/> },
        { name: "Groups", icon: <MdOutlineGroup/> },
    ];

    return (
        <aside className="w-40 border-r-2 h-screen fixed left-0 top-12">
            <ul className="pl-4">
                {links.map((link) => {
                    return <li className="h-10 py-2 flex flex-row items-center">{link.icon}{link.name}</li>;
                })}
            </ul>
        </aside>
    );
}
