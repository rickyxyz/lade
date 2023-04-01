import { ReactNode } from "react";

export interface CardProps {
  children: ReactNode;
  as?: "header" | "footer";
}

export function Card(props: CardProps) {
  const { as } = props;

  const commonProps = {
    ...props,
    className: CARD_BASE_STYLE,
  };

  if (as === "footer") return <footer {...commonProps} />;

  if (as === "header") return <header {...commonProps} />;

  return <div {...commonProps} />;
}

const CARD_BASE_STYLE = "p-8 bg-gray-100 shadow-md";
