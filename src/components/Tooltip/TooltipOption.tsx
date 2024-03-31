import clsx from "clsx";
import { HTMLProps } from "react";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface TooltipOptionProps extends HTMLProps<HTMLDivElement> {}

export function TooltipOption({
  children,
  className,
  ...rest
}: TooltipOptionProps) {
  return (
    <div className={clsx(OPTION_BASE_STYLE, className)} {...rest}>
      {children}
    </div>
  );
}

const OPTION_BASE_STYLE = ["px-4 py-2 hover:bg-secondary-100", "flex"];
