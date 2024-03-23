import { HTMLProps } from "react";
import clsx from "clsx";

export interface CardProps extends Omit<HTMLProps<HTMLDivElement>, "as"> {
  as?: "header" | "footer" | "aside";
}

export function Card(props: CardProps) {
  const { as, className = "" } = props;

  const commonProps = {
    ...props,
    className: clsx(className, CARD_BASE_STYLE),
  };

  if (as === "footer") return <footer {...commonProps} />;

  if (as === "header") return <header {...commonProps} />;

  if (as === "aside") return <aside {...commonProps} />;

  return <div {...commonProps} />;
}

const CARD_BASE_STYLE = "bg-white p-8 border border-gray-200 max-w-full";
