import { DetailedHTMLProps, InputHTMLAttributes } from "react";
import clsx from "clsx";

export type InputVariantType = "basic" | "solid";

export interface InputProps
  extends DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  variant?: InputVariantType;
}

export function Input({ variant = "basic", className, ...rest }: InputProps) {
  return (
    <input
      {...rest}
      className={clsx(
        INPUT_BASE_STYLE,
        variant === "basic" && INPUT_BASIC_STYLE,
        variant === "solid" && INPUT_SOLID_STYLE,
        className
      )}
    />
  );
}

const INPUT_BASE_STYLE = "h-10 px-4 rounded-md";

const INPUT_BASIC_STYLE = [
  "border border-gray-300",
  "focus:outline focus:border-teal-400 focus:outline-4 outline-teal-200",
];

const INPUT_SOLID_STYLE = ["bg-gray-100 focus:bg-gray-200"];
