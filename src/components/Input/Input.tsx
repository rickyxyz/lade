import { DetailedHTMLProps, InputHTMLAttributes } from "react";
import clsx from "clsx";
import { Icon } from "../Icon";
import { IconType } from "react-icons";
import { Paragraph } from "../Paragraph";

export type InputVariantType = "basic" | "solid";

export interface InputProps
  extends DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  variant?: InputVariantType;
  label?: string;
  labelClassName?: string;
  iconLeft?: IconType;
  iconLeftClassName?: string;
  iconRight?: IconType;
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
        className={clsx("relative w-full", label && "mt-2", wrapperClassName)}
      >
        {iconLeft && (
          <Icon
            IconComponent={iconLeft}
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
            IconComponent={iconRight}
            className={clsx("absolute top-2 right-2", iconRightClassName)}
          />
        )}
      </div>
      {errorText && (
        <Paragraph color="danger-6" className="mt-2">
          {errorText}
        </Paragraph>
      )}
    </div>
  );
}

const INPUT_BASE_STYLE = "w-full h-10 px-4 rounded-md";

const INPUT_BASIC_STYLE = [
  "border border-gray-300",
  "focus:outline focus:border-teal-400 focus:outline-4 outline-teal-200",
];

const INPUT_SOLID_STYLE = ["bg-gray-100 focus:bg-gray-200"];
