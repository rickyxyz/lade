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
import { BUTTON_VARIOUS_STYLE } from "@/consts/style";
import { Spinner } from "../Spinner";

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
        variant === "outline" && "bg-white",
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
              tag="p"
              color="inherit"
              weight="semibold"
            >
              {label}
            </Paragraph>
          )}
          {children}
        </>
      ) : (
        <Spinner size="sm" frontColor="secondary-1" backColor="secondary-4" />
      )}
    </button>
  );
}

const BUTTON_BASE_STYLE = [
  "flex flex-row justify-center items-center",
  "duration-100 text-base font-semibold",
  "disabled:cursor-not-allowed disabled:opacity-30 disabled:pointer-events-none",
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
  xs: "h-6",
};
