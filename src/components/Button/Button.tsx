import { DetailedHTMLProps, ButtonHTMLAttributes, ReactNode } from "react";
import clsx from "clsx";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { Paragraph } from "../Paragraph";

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

export interface ButtonProps
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  children: ReactNode;
  variant?: ButtonVariantType;
  order?: ButtonOrderType;
  alignText?: "left" | "center" | "right";
  className?: string;
  loading?: boolean;
}

export function Button({
  children,
  variant = "primary",
  className,
  loading = false,
  disabled = false,
  alignText = "center",
  order,
  type,
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
        [
          order === "first" && BUTTON_FIRST_STYLE,
          order === "middle" && BUTTON_MIDDLE_STYLE,
          order === "last" && BUTTON_LAST_STYLE,
        ],
        !order && "rounded",
        className
      )}
      type={type}
      onClick={!loading && !disabled ? onClick : undefined}
      disabled={disabled || loading}
    >
      {!loading ? (
        <Paragraph
          className={clsx(
            alignText && BUTTON_TEXT_ALIGN_STYLE[alignText],
            "w-full"
          )}
          as="p"
          color="inherit"
        >
          {children}
        </Paragraph>
      ) : (
        <AiOutlineLoading3Quarters className="my-1 justify-self-center animate-spin" />
      )}
    </button>
  );
}

const BUTTON_BASE_STYLE = [
  "flex flex-row px-4 py-2 h-fit",
  "transition-colors duration-100 text-base",
  "disabled:cursor-not-allowed disabled:bg-opacity-50",
];

const BUTTON_PRIMARY_STYLE = [
  `bg-teal-600 text-white`,
  `hover:bg-teal-700`,
  `active:bg-teal-800`,
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
  "text-teal-700 disabled:text-gray-400",
  `hover:bg-teal-50 disabled:bg-transparent`,
  `active:bg-teal-100 disabled:bg-transparent`,
  `border border-secondary-2`,
];

const BUTTON_GHOST_STYLE = [
  "text-teal-700 disabled:text-gray-400",
  `hover:bg-teal-50 disabled:bg-transparent`,
  `active:bg-teal-100 disabled:bg-transparent`,
];

const BUTTON_GHOST_DANGER_STYLE = [
  "text-red-700",
  `hover:bg-red-50`,
  `active:bg-red-100`,
];

const BUTTON_LINK_STYLE = [
  "text-teal-700",
  "hover:underline hover:text-teal-500",
  "active:underline active:text-teal-500",
];

const BUTTON_FIRST_STYLE = ["!rounded-t"];
const BUTTON_MIDDLE_STYLE = ["!border-t-0 !border-b-0"];
const BUTTON_LAST_STYLE = ["!rounded-b"];

const BUTTON_TEXT_ALIGN_STYLE = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};
