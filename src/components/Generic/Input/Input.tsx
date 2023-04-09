import { DetailedHTMLProps, InputHTMLAttributes } from "react";
import clsx from "clsx";
import { IconNameType } from "@/types";
import { Icon } from "../Icon";

export type InputVariantType = "basic" | "solid";

export interface InputProps
  extends DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  variant?: InputVariantType;
  iconLeft?: IconNameType;
  iconLeftClassName?: string;
  iconRight?: IconNameType;
  iconRightClassName?: string;
}

export function Input({
  variant = "basic",
  className,
  iconLeft,
  iconLeftClassName,
  iconRight,
  iconRightClassName,
  ...rest
}: InputProps) {
  return (
    <div className="relative w-fit">
      {iconLeft && (
        <Icon
          icon={iconLeft}
          className={clsx("absolute top-2 left-2", iconLeftClassName)}
        />
      )}
      <input
        {...rest}
        className={clsx(
          INPUT_BASE_STYLE,
          variant === "basic" && INPUT_BASIC_STYLE,
          variant === "solid" && INPUT_SOLID_STYLE,
          className
        )}
      />
      {iconRight && (
        <Icon
          icon={iconRight}
          className={clsx("absolute top-2 right-2", iconRightClassName)}
        />
      )}
    </div>
  );
}

const INPUT_BASE_STYLE = "h-10 px-4 rounded-md";

const INPUT_BASIC_STYLE = [
  "border border-gray-300",
  "focus:outline focus:border-teal-400 focus:outline-4 outline-teal-200",
];

const INPUT_SOLID_STYLE = ["bg-gray-100 focus:bg-gray-200"];
