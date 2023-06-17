import { ReactNode, createRef, useMemo, useState } from "react";
import clsx from "clsx";
import { SelectOptionType } from "@/types";
import { Icon } from "../Icon";
import { SelectOption } from "./SelectOption";
import { Tooltip, TooltipProps } from "../Tooltip";

type SelectVariant = "basic" | "solid";

export interface SelectProps<X extends string, Y extends SelectOptionType<X>[]>
  extends TooltipProps {
  selectedOption?: X;
  variant?: SelectVariant;
  inputClassName?: string;
  options: Y;
  optional?: boolean;
  allowClearSelection?: boolean;
  unselectedText?: string;
  onSelectOption: (option?: SelectOptionType<X>) => void;
}

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
  onBlur,
}: SelectProps<X, Y>) {
  const stateVisible = useState(false);
  const [visible, setVisible] = stateVisible;
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
          onClick={(e) => {
            e.stopPropagation();
            onSelectOption(undefined);
            onBlur && onBlur();
            setVisible(false);
            selectRef.current?.blur();
          }}
          selected={selectedOption === undefined}
        />
      )
    );
  }, [
    allowClearSelection,
    onBlur,
    onSelectOption,
    optional,
    selectRef,
    selectedOption,
    setVisible,
    unselectedText,
  ]);

  const renderOptions = useMemo(
    () => (
      <>
        {renderRemoveOption}
        {options.map((option) => (
          <SelectOption
            key={option.id}
            option={option}
            onClick={(e) => {
              e.stopPropagation();
              onSelectOption(option);
              onBlur && onBlur();
              setVisible(false);
              selectRef.current?.blur();
            }}
            selected={selectedOption === option.id}
          />
        ))}
      </>
    ),
    [
      renderRemoveOption,
      options,
      selectedOption,
      onSelectOption,
      onBlur,
      setVisible,
      selectRef,
    ]
  );

  const renderTrigger = useMemo(
    () => (
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
    ),
    [
      disabled,
      inputClassName,
      options,
      selectedOption,
      unselectedText,
      variant,
      visible,
    ]
  );

  return (
    <Tooltip
      triggerElement={renderTrigger}
      hiddenElement={renderOptions}
      ref={selectRef}
      className={className}
      stateVisible={stateVisible}
    />
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
