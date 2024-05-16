import { CSSProperties, ReactNode, useMemo } from "react";
import clsx from "clsx";
import {
  FONT_COLOR,
  FONT_SIZE,
  FONT_WEIGHT,
  FontColor,
  FontSize,
  FontWeight,
} from "@/consts";

export interface ParagraphProps {
  as?: "p" | "span" | "h1" | "h2" | "h3" | "label";
  weight?: FontWeight;
  id?: string;
  size?: FontSize;
  color?: FontColor;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  htmlFor?: string;
  onClick?: () => void;
}

export function Paragraph({
  as = "span",
  weight = "medium",
  size = "base",
  color = "secondary-8",
  className: propsClass,
  children,
  htmlFor,
  ...rest
}: ParagraphProps) {
  const className = useMemo(
    () =>
      clsx(
        FONT_COLOR[color],
        FONT_SIZE[size],
        weight && FONT_WEIGHT[weight],
        propsClass
      ),
    [color, size, weight, propsClass]
  );

  const props = useMemo(
    () => ({
      ...rest,
      children,
      className,
    }),
    [rest, children, className]
  );

  const render = useMemo(() => {
    switch (as) {
      case "label":
        return <label htmlFor={htmlFor} {...props} />;
      case "span":
        return <span {...props} />;
      case "h1":
        return <h1 {...props} />;
      case "h2":
        return <h2 {...props} />;
      case "h3":
        return <h3 {...props} />;
      default:
        return <p {...props} />;
    }
  }, [as, htmlFor, props]);

  return render;
}
