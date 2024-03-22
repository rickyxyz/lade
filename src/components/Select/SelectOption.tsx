import { SelectOptionType } from "@/types";
import { Check } from "@mui/icons-material";
import clsx from "clsx";
import { HTMLProps } from "react";

interface SelectOptionProps extends HTMLProps<HTMLDivElement> {
  option: SelectOptionType<string>;
  selected?: boolean;
}

export function SelectOption({
  onClick,
  className,
  option,
  selected,
}: SelectOptionProps) {
  return (
    <div
      className={clsx(OPTION_BASE_STYLE, className)}
      onClick={onClick}
      key={option.id}
    >
      <span className={clsx("w-8", !selected && "invisible")}>
        <Check />
      </span>
      <span>{option.text}</span>
    </div>
  );
}

const OPTION_BASE_STYLE = ["px-4 py-2 hover:bg-gray-100", "flex"];
