import clsx from "clsx";
import Link from "next/link";
import { ReactNode } from "react";
import {
  BsHouseDoor,
  BsQuestionOctagon,
  BsClipboardPlus,
  BsClipboardData,
  BsFillPersonFill,
  BsTrophyFill,
} from "react-icons/bs";

interface SideLinkType {
  name: string;
  icon: ReactNode;
  href: string;
}

const LINKS: SideLinkType[] = [
  { name: "Problems", href: "/problems", icon: <BsHouseDoor /> },
  { name: "Contests", href: "/contests", icon: <BsClipboardData /> },
  {
    name: "New Problem",
    href: "/problems/new",
    icon: <BsQuestionOctagon />,
  },
  {
    name: "New Contest",
    href: "/contests/new",
    icon: <BsClipboardPlus />,
  },
  {
    name: "Leaderboard",
    href: `/leaderboard`,
    icon: <BsTrophyFill />,
  },
];

export function Sidebar() {
  return (
    <aside className="w-fit h-fit mt-16 bg-gray-50 shadow-md">
      <ul>
        {LINKS.map((link) => {
          return (
            <Link key={link.href} href={link.href}>
              <li
                className={clsx(
                  "flex flex-row items-center",
                  "h-12 py-2 px-8",
                  "hover:bg-blue-100 border-r-4 border-transparent hover:border-blue-400"
                )}
              >
                {link.icon}
                <span className="w-max ml-4">{link.name}</span>
              </li>
            </Link>
          );
        })}
      </ul>
    </aside>
  );
}
