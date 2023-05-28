import { createRef, useMemo, useState } from "react";
import clsx from "clsx";
import { SelectOptionType } from "@/types";
import { Icon } from "../Icon";
import { SelectOption } from "./SelectOption";

type SelectVariant = "basic" | "solid";

export type SelectProps<X extends string, Y extends SelectOptionType<X>[]> = {
  selectedOption?: X;
  onSelectOption: (option?: SelectOptionType<X>) => void;
  variant?: SelectVariant;
  className?: string;
  inputClassName?: string;
  options: Y;
  optional?: boolean;
  allowClearSelection?: boolean;
  unselectedText?: string;
  disabled?: boolean;
  optionWidth?: number;
  direction?: "left" | "right";
};

export function Select<X extends string, Y extends SelectOptionType<X>[]>({
  selectedOption,
  variant = "basic",
  className,
  inputClassName,
  options,
  optional,
  allowClearSelection = true,
  unselectedText = "None",
  disabled,
  optionWidth = 300,
  direction = "right",
  onSelectOption,
}: SelectProps<X, Y>) {
  const [visible, setVisible] = useState(false);
  const [touched, setTouched] = useState(false);
  const selectRef = createRef<HTMLDivElement>();

  const renderRemoveOption = useMemo(() => {
    return (
      optional &&
      allowClearSelection && (
        <SelectOption
          option={{
            id: "",
            text: unselectedText,
          }}
          onSelect={() => {
            onSelectOption(undefined);
            setVisible(false);
            selectRef.current?.blur();
          }}
          selected={selectedOption === undefined}
        />
      )
    );
  }, [
    allowClearSelection,
    onSelectOption,
    optional,
    selectRef,
    selectedOption,
    unselectedText,
  ]);

  const renderOptions = useMemo(
    () => (
      <div
        className={clsx(
          "absolute h-fit top-12 flex flex-col",
          "border border-gray-100 bg-white shadow-md z-10",
          className
        )}
        style={{
          minWidth: optionWidth,
          left: direction === "left" ? undefined : 0,
          right: direction === "right" ? 0 : undefined,
        }}
      >
        {renderRemoveOption}
        {options.map((option) => (
          <SelectOption
            key={option.id}
            option={option}
            onSelect={() => {
              onSelectOption(option);
              setVisible(false);
              selectRef.current?.blur();
            }}
            selected={selectedOption === option.id}
          />
        ))}
      </div>
    ),
    [
      className,
      optionWidth,
      direction,
      renderRemoveOption,
      options,
      selectedOption,
      onSelectOption,
      selectRef,
    ]
  );

  return (
    <div
      className={clsx(
        "flex flex-row-reverse relative overflow-visible",
        !disabled && "cursor-pointer",
        className
      )}
      onFocus={() => {
        !disabled && setVisible(true);
      }}
      onBlur={() => setVisible(false)}
      ref={selectRef}
      tabIndex={0}
    >
      {visible && renderOptions}
      <div
        className={clsx(
          INPUT_BASE_STYLE,
          visible && INPUT_FOCUS_STYLE,
          variant === "basic" && INPUT_BASIC_STYLE,
          variant === "solid" && INPUT_SOLID_STYLE,
          disabled && "bg-gray-200",
          "text-ellipsis whitespace-nowrap overflow-hidden",
          inputClassName
        )}
      >
        <span
          className="truncate"
          style={{
            width: "calc(100% - 2rem)!important",
          }}
        >
          {selectedOption && options.length > 0
            ? options.filter((option) => option.id === selectedOption)[0].text
            : unselectedText}
        </span>
        <Icon icon="chevronDown" className="absolute right-2" size="sm" />
      </div>
    </div>
  );
}

const INPUT_BASE_STYLE =
  "w-full flex justify-between items-center h-10 pl-4 rounded-md";

const INPUT_BASIC_STYLE = [
  "border border-gray-300",
  "focus:outline focus:border-teal-400 focus:outline-4 outline-teal-200",
];

const INPUT_FOCUS_STYLE = [
  "outline border-teal-400 outline-4 outline-teal-200",
];

const INPUT_SOLID_STYLE = ["bg-gray-100 focus:bg-gray-200"];

const OPTION_BASE_STYLE = ["px-4 py-2 hover:bg-gray-100", "flex"];
