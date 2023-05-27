import { SelectOptionType } from "@/types";
import clsx from "clsx";
import { HTMLProps } from "react";
import { BsCheck } from "react-icons/bs";

interface SelectOptionProps extends HTMLProps<HTMLDivElement> {
  option: SelectOptionType<string>;
  selected?: boolean;
  onSelect: () => void;
}

export function SelectOption({
  onSelect,
  className,
  option,
  selected,
}: SelectOptionProps) {
  return (
    <div
      className={clsx(OPTION_BASE_STYLE, className)}
      onClick={onSelect}
      key={option.id}
    >
      <span className={clsx("w-8", !selected && "invisible")}>
        <BsCheck size={24} />
      </span>
      <span>{option.text}</span>
    </div>
  );
}

const OPTION_BASE_STYLE = ["px-4 py-2 hover:bg-gray-100", "flex"];
