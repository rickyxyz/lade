import clsx from "clsx";
import { ReactNode } from "react";

export type TagColorType = "red" | "blue" | "green" | "yellow";

export interface TagProps {
  children: ReactNode;
  color?: TagColorType;
}

export function Tag({ children, color }: TagProps) {
  return <span className={clsx(TAG_BASE_STYLE)}>{children}</span>;
}

const TAG_BASE_STYLE = ["px-2 py-1 bg-teal-100 text-teal-600 text-xs"];

// const TAG_BASE_STYLE = ["text-teal-500 font-bold uppercase"];
