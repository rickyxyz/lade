import { HTMLProps } from "@/types";
import clsx from "clsx";

export type InputVariantType = "basic" | "solid";

export interface InputProps extends HTMLProps<HTMLInputElement> {
  variant?: InputVariantType;
}

export function Input({ variant = "basic", ...rest }: InputProps) {
  return (
    <input
      className={clsx(
        INPUT_BASE_STYLE,
        variant === "basic" && INPUT_BASIC_STYLE,
        variant === "solid" && INPUT_SOLID_STYLE
      )}
      {...rest}
    />
  );
}

const INPUT_BASE_STYLE = "h-10 px-8 rounded-md";

const INPUT_BASIC_STYLE = [
  "border",
  "focus:outline focus:border-blue-400 focus:outline-4 outline-blue-200",
];

const INPUT_SOLID_STYLE = ["bg-gray-100 focus:bg-gray-200"];
