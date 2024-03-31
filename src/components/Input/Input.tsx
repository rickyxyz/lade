import {
  DetailedHTMLProps,
  InputHTMLAttributes,
  ReactNode,
  forwardRef,
} from "react";
import clsx from "clsx";
import { Icon } from "../Icon";
import { Paragraph } from "../Paragraph";
import { SvgIconComponent } from "@mui/icons-material";

export type InputVariantType = "basic" | "solid";

export interface InputProps
  extends DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  variant?: InputVariantType;
  label?: string;
  labelClassName?: string;
  iconLeft?: SvgIconComponent;
  iconLeftClassName?: string;
  iconRight?: SvgIconComponent;
  iconRightClassName?: string;
  rightElement?: ReactNode;
  externalWrapperClassName?: string;
  wrapperClassName?: string;
  errorText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  function Component(
    {
      variant = "basic",
      className,
      label,
      labelClassName,
      iconLeft,
      iconLeftClassName,
      iconRight,
      iconRightClassName,
      rightElement,
      externalWrapperClassName,
      wrapperClassName,
      errorText,
      ...rest
    },
    ref
  ) {
    const { id } = rest;

    return (
      <div className={externalWrapperClassName}>
        {label && (
          <label htmlFor={id} className={clsx("font-semibold", labelClassName)}>
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
            ref={ref}
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
          {rightElement}
        </div>
        {errorText && (
          <Paragraph color="danger-6" className="mt-2">
            {errorText}
          </Paragraph>
        )}
      </div>
    );
  }
);

const INPUT_BASE_STYLE = "w-full h-10 px-4 rounded-md";

const INPUT_BASIC_STYLE = [
  "border border-secondary-300",
  "focus:outline focus:border-primary-400 focus:outline-4 outline-primary-200",
];

const INPUT_SOLID_STYLE = ["bg-secondary-100 focus:bg-secondary-200"];
