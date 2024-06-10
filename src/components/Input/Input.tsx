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

type InputSizeType = "m" | "s";

type InputWidthType = "full" | number;

export interface InputProps
  extends Omit<
    DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
    "size" | "width"
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
  size?: InputSizeType;
  width?: InputWidthType;
  errorText?: string;
  isRequired?: boolean;
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
      size = "m",
      width = "full",
      isRequired,
      ...rest
    },
    ref
  ) {
    const { id } = rest;

    return (
      <div className={externalWrapperClassName}>
        {label && (
          <Paragraph className={labelClassName} color="secondary-5">
            <Paragraph
              className="block"
              tag="label"
              htmlFor={id}
              color="inherit"
            >
              {label}
              {isRequired && <Paragraph color="danger-6">*</Paragraph>}
            </Paragraph>
          </Paragraph>
        )}
        <div className={clsx("relative w-full", wrapperClassName)}>
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
              INPUT_SIZE_STYLE[size],
              variant === "basic" && INPUT_BASIC_STYLE,
              variant === "solid" && INPUT_SOLID_STYLE,
              className
            )}
            style={{
              ...inputWidthStyle(width),
            }}
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

const INPUT_BASE_STYLE = "rounded-md";

const INPUT_BASIC_STYLE = [
  "border border-secondary-300",
  "focus:outline focus:border-primary-400 focus:outline-4 outline-primary-200",
];

const INPUT_SOLID_STYLE = ["bg-secondary-100 focus:bg-secondary-200"];

const INPUT_SIZE_STYLE: Record<InputSizeType, string> = {
  m: "h-10 px-4",
  s: "h-6 px-2",
};

function inputWidthStyle(size: InputWidthType) {
  if (size === "full") {
    return {
      width: "100%",
    };
  } else {
    return {
      width: `${size}px`,
    };
  }
}
