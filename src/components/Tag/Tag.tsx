import { ReactNode } from "react";
import clsx from "clsx";
import { Paragraph } from "../Paragraph";

export type TagColorType = "red" | "blue" | "green" | "yellow";

export interface TagProps {
  children: ReactNode;
  color?: TagColorType;
}

export function Tag({ children }: TagProps) {
  return (
    <Paragraph
      as="span"
      className={clsx(TAG_BASE_STYLE)}
      color="primary-6"
      size="s"
    >
      {children}
    </Paragraph>
  );
}

const TAG_BASE_STYLE = ["px-2 py-0.5 bg-primary-100 rounded-md"];
