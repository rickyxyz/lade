import clsx from "clsx";
import { HTMLProps } from "react";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface DropdownOptionProps extends HTMLProps<HTMLDivElement> {}

export function DropdownOption({
  children,
  className,
  ...rest
}: DropdownOptionProps) {
  return (
    <div className={clsx(OPTION_BASE_STYLE, className)} {...rest}>
      {children}
    </div>
  );
}

const OPTION_BASE_STYLE = [
  "px-4 py-2 hover:bg-secondary-100 text-base",
  "flex",
];
