import { Button, Input } from "@/components";
import clsx from "clsx";
import Image from "next/image";
export interface NavbarProps {}

const NAVBAR_SEARCH_STYLE = clsx(
  "flex justify-between items-center h-16",
  "bg-gray-50",
  "border-t-4 border-t-teal-500 border-b border-gray-200"
);

export function NavbarSearch() {
  return <Input />;
}
