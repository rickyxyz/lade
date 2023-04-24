import { DetailedHTMLProps, ButtonHTMLAttributes, ReactNode } from "react";
import clsx from "clsx";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export type ButtonVariantType =
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "danger"
  | "ghost"
  | "ghost-danger"
  | "link";

export interface ButtonProps
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  children: ReactNode;
  variant?: ButtonVariantType;
  className?: string;
  loading?: boolean;
}

export function Button({
  children,
  variant = "primary",
  className,
  loading = false,
  disabled = false,
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
          variant === "ghost" && BUTTON_GHOST_STYLE,
          variant === "ghost-danger" && BUTTON_GHOST_DANGER_STYLE,
          variant === "link" && BUTTON_LINK_STYLE,
        ],
        className
      )}
      type={type}
      onClick={!loading && !disabled ? onClick : () => {}}
      disabled={disabled || loading}
    >
      {!loading ? (
        children
      ) : (
        <AiOutlineLoading3Quarters className="my-1 justify-self-center animate-spin" />
      )}
    </button>
  );
}

const BUTTON_BASE_STYLE = [
  "flex flex-row items-center justify-center px-4 py-2 h-fit",
  "transition-colors duration-100",
  "disabled:cursor-not-allowed disabled:bg-opacity-50",
  "rounded",
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

const BUTTON_GHOST_STYLE = [
  "text-teal-700",
  `hover:bg-teal-50`,
  `active:bg-teal-100`,
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
