import clsx from "clsx";
import { ReactNode } from "react";
import { Icon } from "../Icon";
import { SvgIconComponent } from "@mui/icons-material";

export type QuoteVariantType =
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "danger";

interface QuoteProps {
  children: ReactNode;
  className?: string;
  variant?: QuoteVariantType;
  icon?: SvgIconComponent;
}

export function Quote({
  children,
  className,
  variant = "primary",
  icon,
}: QuoteProps) {
  return (
    <div
      className={clsx(
        QUOTE_BASE_STYLE,
        [
          variant === "primary" && QUOTE_PRIMARY_STYLE,
          variant === "secondary" && QUOTE_SECONDARY_STYLE,
          variant === "success" && QUOTE_SUCCESS_STYLE,
          variant === "warning" && QUOTE_WARNING_STYLE,
          variant === "danger" && QUOTE_DANGER_STYLE,
        ],
        className
      )}
    >
      {icon && (
        <Icon
          className={clsx([
            variant === "primary" && "text-teal-700",
            variant === "secondary" && "text-gray-700",
            variant === "success" && "text-green-700",
            variant === "warning" && "text-yellow-700",
            variant === "danger" && "text-red-700",
          ])}
          IconComponent={icon}
        />
      )}
      {children}
    </div>
  );
}

const QUOTE_BASE_STYLE = [
  "flex flex-row items-center w-fit px-4 py-2 h-fit gap-4",
  "transition-colors duration-100 text-gray-800",
  "disabled:cursor-not-allowed disabled:bg-opacity-50",
  "rounded",
];

const QUOTE_PRIMARY_STYLE = [`bg-teal-100`];

const QUOTE_SECONDARY_STYLE = [`bg-gray-100`];

const QUOTE_SUCCESS_STYLE = [`bg-green-100`];

const QUOTE_WARNING_STYLE = [`bg-yellow-100`];

const QUOTE_DANGER_STYLE = [`bg-red-100`];
