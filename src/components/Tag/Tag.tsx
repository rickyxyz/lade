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
  "px-3 py-0.5 bg-blue-100 text-blue-600 border border-blue-600 rounded-md text-sm",
];
