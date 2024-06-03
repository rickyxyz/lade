import { SelectOptionType } from "@/types";
import { Check } from "@mui/icons-material";
import clsx from "clsx";
import { HTMLProps } from "react";
import { Icon } from "../Icon";

interface SelectOptionProps extends HTMLProps<HTMLDivElement> {
  option: SelectOptionType<string>;
  isSelected?: boolean;
  isHighlighted?: boolean;
}

export function SelectOption({
  onClick,
  className,
  option,
  isSelected,
  isHighlighted,
}: SelectOptionProps) {
  return (
    <div
      className={clsx(
        OPTION_BASE_STYLE,
        isHighlighted && "bg-blue-50",
        className
      )}
      onClick={onClick}
      key={option.id}
      role="option"
      aria-selected={isSelected}
    >
      <span className={clsx("w-8", !isSelected && "invisible")}>
        <Icon IconComponent={Check} size="l" />
      </span>
      <span>{option.text}</span>
    </div>
  );
}

const OPTION_BASE_STYLE = ["px-4 py-2 hover:bg-secondary-100", "flex"];
