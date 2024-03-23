import {
  DetailedHTMLProps,
  ButtonHTMLAttributes,
  ReactNode,
  CSSProperties,
} from "react";
import clsx from "clsx";
import { Paragraph } from "../Paragraph";
import { Icon } from "../Icon";
import { HourglassEmpty } from "@mui/icons-material";

export type ButtonVariantType =
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "outline"
  | "danger"
  | "ghost"
  | "ghost-danger"
  | "link";

export type ButtonOrderType = "first" | "middle" | "last";

export type ButtonDirectionType = "row" | "column";

export type ButtonSizeType = "m" | "s";

export interface ButtonProps
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  label?: string;
  children?: ReactNode;
  variant?: ButtonVariantType;
  order?: ButtonOrderType;
  orderDirection?: ButtonDirectionType;
  alignText?: "left" | "center" | "right";
  size?: ButtonSizeType | null;
  className?: string;
  textClassName?: string;
  loading?: boolean;
  style?: CSSProperties;
}

export function Button({
  label,
  children,
  variant = "primary",
  className,
  textClassName,
  loading = false,
  disabled = false,
  alignText = "center",
  size = "m",
  order,
  orderDirection,
  type,
  style,
  onClick,
}: ButtonProps) {
  return (
    <button
      className={clsx(
        BUTTON_BASE_STYLE,
        [
          variant === "primary" && BUTTON_PRIMARY_STYLE,
          variant === "secondary" && BUTTON_SECONDARY_STYLE,
          variant === "success" && BUTTON_SUCCESS_STYLE,
          variant === "warning" && BUTTON_WARNING_STYLE,
          variant === "danger" && BUTTON_DANGER_STYLE,
          variant === "outline" && BUTTON_OUTLINE_STYLE,
          variant === "ghost" && BUTTON_GHOST_STYLE,
          variant === "ghost-danger" && BUTTON_GHOST_DANGER_STYLE,
          variant === "link" && BUTTON_LINK_STYLE,
        ],
        size && BUTTON_SIZE_STYLE[size],
        order && orderDirection && BUTTON_ORDER_STYLE[orderDirection][order],
        !order && "rounded",
        className
      )}
      type={type}
      onClick={!loading && !disabled ? onClick : undefined}
      disabled={disabled || loading}
      style={style}
    >
      {!loading ? (
        <>
          {label && (
            <Paragraph
              className={clsx(
                alignText && BUTTON_TEXT_ALIGN_STYLE[alignText],
                textClassName,
                "w-full"
              )}
              as="p"
              color="inherit"
            >
              {label}
            </Paragraph>
          )}
          {children}
        </>
      ) : (
        <Icon
          IconComponent={HourglassEmpty}
          className="my-1 justify-self-center animate-spin"
        />
      )}
    </button>
  );
}

const BUTTON_BASE_STYLE = [
  "flex flex-row items-center",
  "transition-colors duration-100 text-base font-semibold",
  "disabled:cursor-not-allowed disabled:bg-opacity-50",
];

const BUTTON_PRIMARY_STYLE = [
  `bg-blue-600 text-white`,
  `hover:bg-blue-700`,
  `active:bg-blue-800`,
];

const BUTTON_SECONDARY_STYLE = [
  `bg-gray-500 text-white`,
  `hover:bg-gray-600`,
  `active:bg-gray-700`,
];

const BUTTON_SUCCESS_STYLE = [
  `bg-green-500 text-white`,
  `hover:bg-green-600`,
  `active:bg-green-700`,
];

const BUTTON_WARNING_STYLE = [
  `bg-yellow-500 text-white`,
  `hover:bg-yellow-600`,
  `active:bg-yellow-700`,
];

const BUTTON_DANGER_STYLE = [
  `bg-red-500 text-white`,
  `hover:bg-red-600`,
  `active:bg-red-700`,
];

const BUTTON_OUTLINE_STYLE = [
  "text-blue-700 bg-white disabled:text-gray-400",
  `hover:bg-blue-50 disabled:bg-transparent`,
  `active:bg-blue-100 disabled:bg-transparent`,
  `border border-gray-300`,
];

const BUTTON_GHOST_STYLE = [
  "text-blue-700 disabled:text-gray-400",
  `hover:bg-blue-50 disabled:bg-transparent`,
  `active:bg-blue-100 disabled:bg-transparent`,
];

const BUTTON_GHOST_DANGER_STYLE = [
  "text-red-700",
  `hover:bg-red-50`,
  `active:bg-red-100`,
];

const BUTTON_LINK_STYLE = [
  "text-blue-700",
  "hover:underline hover:text-blue-500",
  "active:underline active:text-blue-500",
];

const BUTTON_ORDER_STYLE: Record<
  ButtonDirectionType,
  Record<ButtonOrderType, string[]>
> = {
  column: {
    first: ["!rounded-t"],
    middle: ["!border-t-0"],
    last: ["!border-t-0 !rounded-b"],
  },
  row: {
    first: ["!rounded-l"],
    middle: ["!border-l-0"],
    last: ["!border-l-0 !rounded-r"],
  },
};

const BUTTON_TEXT_ALIGN_STYLE = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

const BUTTON_SIZE_STYLE: Record<ButtonSizeType, string> = {
  m: "h-10 px-4 py-2",
  s: "h-8",
};
