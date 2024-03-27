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
import {
  ButtonDirectionType,
  ButtonOrderType,
  ButtonSizeType,
  ButtonVariantType,
  GenericColorType,
} from "@/types";

export interface ButtonProps
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  label?: string;
  children?: ReactNode;
  variant?: ButtonVariantType;
  color?: GenericColorType;
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
  variant = "solid",
  color = "primary",
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
        BUTTON_VARIOUS_STYLE[variant][color],
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
              weight="medium"
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

const BUTTON_VARIOUS_STYLE: Record<
  ButtonVariantType,
  Record<GenericColorType, string[]>
> = {
  solid: {
    primary: [
      "bg-primary-5 text-white",
      "hover:bg-primary-6",
      "active:bg-primary-7",
    ],
    secondary: [
      "bg-secondary-5 text-white",
      "hover:bg-secondary-6",
      "active:bg-secondary-7",
    ],
    warning: [
      "bg-warning-5 text-white",
      "hover:bg-warning-6",
      "active:bg-warning-7",
    ],
    success: [
      "bg-success-5 text-white",
      "hover:bg-success-6",
      "active:bg-success-7",
    ],
    danger: [
      "bg-danger-5 text-white",
      "hover:bg-danger-6",
      "active:bg-danger-7",
    ],
  },
  outline: {
    primary: [
      "text-primary-6",
      "hover:bg-primary-1",
      "active:bg-primary-2",
      "border border-gray-300",
    ],
    secondary: [
      "text-secondary-6",
      "hover:bg-secondary-1",
      "active:bg-secondary-2",
      "border border-gray-300",
    ],
    warning: [
      "text-warning-6",
      "hover:bg-warning-1",
      "active:bg-warning-2",
      "border border-gray-300",
    ],
    success: [
      "text-success-6",
      "hover:bg-success-1",
      "active:bg-success-2",
      "border border-gray-300",
    ],
    danger: [
      "text-danger-6",
      "hover:bg-danger-1",
      "active:bg-danger-2",
      "border border-gray-300",
    ],
  },
  "outline-2": {
    primary: [
      "text-primary-6",
      "hover:bg-primary-1",
      "active:bg-primary-2",
      "border border-primary-6",
    ],
    secondary: [
      "text-secondary-6",
      "hover:bg-secondary-1",
      "active:bg-secondary-2",
      "border border-secondary-6",
    ],
    warning: [
      "text-warning-6",
      "hover:bg-warning-1",
      "active:bg-warning-2",
      "border border-warning-6",
    ],
    success: [
      "text-success-6",
      "hover:bg-success-1",
      "active:bg-success-2",
      "border border-success-6",
    ],
    danger: [
      "text-danger-6",
      "hover:bg-danger-1",
      "active:bg-danger-2",
      "border border-danger-6",
    ],
  },
  ghost: {
    primary: ["text-primary-6", "hover:bg-primary-1", "active:bg-primary-2"],
    secondary: [
      "text-secondary-6",
      "hover:bg-secondary-1",
      "active:bg-secondary-2",
    ],
    warning: ["text-warning-6", "hover:bg-warning-1", "active:bg-warning-2"],
    success: ["text-success-6", "hover:bg-success-1", "active:bg-success-2"],
    danger: ["text-danger-6", "hover:bg-danger-1", "active:bg-danger-2"],
  },
};
