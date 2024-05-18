import { useMemo, useState } from "react";
import clsx from "clsx";
import { SelectOptionType } from "@/types";
import { Icon } from "../Icon";
import { SelectOption } from "./SelectOption";
import { Tooltip, TooltipBaseProps } from "../Tooltip";
import { ExpandMore, HourglassEmpty } from "@mui/icons-material";
import { useDevice } from "@/hooks";

type SelectVariant = "basic" | "solid";

export interface SelectProps<X extends string, Y extends SelectOptionType<X>[]>
  extends TooltipBaseProps {
  selectedOption?: X;
  variant?: SelectVariant;
  inputClassName?: string;
  options: Y;
  optional?: boolean;
  allowClearSelection?: boolean;
  unselectedText?: string;
  loading?: boolean;
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
  loading,
  onSelectOption,
  onBlur,
}: SelectProps<X, Y>) {
  const stateVisible = useState(false);
  const [visible, setVisible] = stateVisible;
  const [currentOption, currentIndex] = useMemo(() => {
    let optionIndex: number | undefined;
    let optionText = unselectedText;

    options.forEach((option, i) => {
      if (option.id === selectedOption) {
        optionText = option.text;
        optionIndex = i;
      }
    });

    return [optionText, optionIndex];
  }, [options, selectedOption, unselectedText]);
  const [index, setIndex] = useState<number | undefined>(currentIndex);

  const desktop = useDevice();

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
          }}
          isSelected={selectedOption === undefined}
          isHighlighted={index === undefined}
        />
      )
    );
  }, [
    allowClearSelection,
    index,
    onBlur,
    onSelectOption,
    optional,
    selectedOption,
    setVisible,
    unselectedText,
  ]);

  const renderOptions = useMemo(
    () => (
      <>
        {renderRemoveOption}
        {options ? (
          options.map((option, i) => (
            <SelectOption
              key={option.id}
              option={option}
              onClick={(e) => {
                e.stopPropagation();
                onSelectOption(option);
                onBlur && onBlur();
                setVisible(false);
                setIndex(i);
              }}
              isSelected={selectedOption === option.id}
              isHighlighted={index === i}
            />
          ))
        ) : (
          <></>
        )}
      </>
    ),
    [
      renderRemoveOption,
      options,
      selectedOption,
      index,
      onSelectOption,
      onBlur,
      setVisible,
    ]
  );

  const renderLoading = useMemo(
    () => (
      <div className="p-4 flex items-center justify-center">
        <HourglassEmpty className="animate-spin" />
      </div>
    ),
    []
  );

  const renderTrigger = useMemo(
    () => (
      <div
        className={clsx(
          INPUT_BASE_STYLE,
          visible && INPUT_FOCUS_STYLE,
          variant === "basic" && INPUT_BASIC_STYLE,
          variant === "solid" && INPUT_SOLID_STYLE,
          disabled ? "bg-secondary-200" : "bg-white",
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
          {currentOption}
        </span>
        <Icon
          IconComponent={ExpandMore}
          className="absolute right-2"
          size="s"
        />
      </div>
    ),
    [currentOption, disabled, inputClassName, variant, visible]
  );

  return (
    <Tooltip
      triggerElement={renderTrigger}
      hiddenElement={loading ? renderLoading : renderOptions}
      className={className}
      stateVisible={stateVisible}
      disabled={disabled}
      onKeyDown={(e) => {
        if (e.key === "Tab") return;

        e.preventDefault();

        setIndex((prev) => {
          if (e.key === "ArrowUp") {
            if (!prev || (optional && prev === 0)) return undefined;

            return Math.max(0, prev - 1);
          } else if (e.key === "ArrowDown") {
            return prev !== undefined
              ? Math.min(options.length - 1, prev + 1)
              : 0;
          }
        });

        if (e.key === "Enter") {
          index !== undefined && onSelectOption(options[index]);
          setIndex(index);
          onBlur && onBlur();
          setVisible(false);
        }
      }}
    />
  );
}

const INPUT_BASE_STYLE =
  "w-full flex justify-between items-center h-10 pl-4 rounded-md";

const INPUT_BASIC_STYLE = [
  "border border-secondary-300",
  "focus:outline focus:border-primary-400 focus:outline-4 outline-primary-200",
];

const INPUT_FOCUS_STYLE = [
  "outline border-primary-400 outline-4 outline-primary-200",
];

const INPUT_SOLID_STYLE = ["bg-secondary-100 focus:bg-secondary-200"];
