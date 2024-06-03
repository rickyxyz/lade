import { HTMLProps } from "react";
import clsx from "clsx";

export interface CardProps extends HTMLProps<HTMLDivElement> {
  tag?: "header" | "footer" | "aside" | "div";
}

export function Card(props: CardProps) {
  const { className = "", tag: Tag = "div" } = props;

  const commonProps = {
    ...props,
    className: clsx(className, CARD_BASE_STYLE),
  };

  return <Tag {...commonProps} />;
}

const CARD_BASE_STYLE =
  "Card bg-white p-8 border border-secondary-200 max-w-full transition-none";
