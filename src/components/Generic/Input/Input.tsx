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
  label?: string;
  labelClassName?: string;
  iconLeft?: IconNameType;
  iconLeftClassName?: string;
  iconRight?: IconNameType;
  iconRightClassName?: string;
  externalWrapperClassName?: string;
  wrapperClassName?: string;
  errorText?: string;
}

export function Input({
  variant = "basic",
  className,
  label,
  labelClassName,
  iconLeft,
  iconLeftClassName,
  iconRight,
  iconRightClassName,
  externalWrapperClassName,
  wrapperClassName,
  errorText,
  ...rest
}: InputProps) {
  const { id } = rest;

  return (
    <div className={externalWrapperClassName}>
      {label && (
        <label htmlFor={id} className={clsx("font-bold", labelClassName)}>
          {label}
        </label>
      )}
      <div
        className={clsx("relative w-fit", label && "mt-2", wrapperClassName)}
      >
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
      {errorText && <div className="text-red-600 mt-2">{errorText}</div>}
    </div>
  );
}

const INPUT_BASE_STYLE = "w-full h-10 px-4 rounded-md";

const INPUT_BASIC_STYLE = [
  "border border-gray-300",
  "focus:outline focus:border-teal-400 focus:outline-4 outline-teal-200",
];

const INPUT_SOLID_STYLE = ["bg-gray-100 focus:bg-gray-200"];
