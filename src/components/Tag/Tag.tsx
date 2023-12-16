import { ReactNode } from "react";
import clsx from "clsx";

export type TagColorType = "red" | "blue" | "green" | "yellow";

export interface TagProps {
  children: ReactNode;
  color?: TagColorType;
}

export function Tag({ children }: TagProps) {
  return <span className={clsx(TAG_BASE_STYLE)}>{children}</span>;
}

const TAG_BASE_STYLE = [
  "px-3 py-1 bg-teal-100 text-teal-600 border border-teal-600 rounded-sm text-xs",
];
