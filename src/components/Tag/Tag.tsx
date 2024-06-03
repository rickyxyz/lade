import { ReactNode } from "react";
import clsx from "clsx";
import { Paragraph } from "../Paragraph";
import { FontColor, TAG_COLOR_STYLE } from "@/consts/style";
import { GenericColorType } from "@/types";

export type TagSizeType = "m" | "s";

export interface TagProps {
  children: ReactNode;
  color?: GenericColorType;
}

export function Tag({ children, color = "primary" }: TagProps) {
  return (
    <Paragraph
      tag="span"
      className={clsx(TAG_BASE_STYLE, TAG_COLOR_STYLE[color])}
      color={`${color}-6` as FontColor}
      size="s"
    >
      {children}
    </Paragraph>
  );
}

const TAG_BASE_STYLE = ["px-2 py-0.5 h-fit rounded-md transition-colors"];
