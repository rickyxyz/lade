import { useMemo, useState } from "react";
import clsx from "clsx";
import { SelectOptionType } from "@/types";
import { Icon } from "../Icon";
import { SelectOption } from "./SelectOption";
import { Tooltip, TooltipBaseProps } from "../Tooltip";
import { ExpandMore, HourglassEmpty } from "@mui/icons-material";

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
  const currentOption = useMemo(() => {
    const available = options
      ? options.filter((option) => option.id === selectedOption)[0]
      : undefined;

    return selectedOption && available ? available.text : unselectedText;
  }, [options, selectedOption, unselectedText]);

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
          selected={selectedOption === undefined}
        />
      )
    );
  }, [
    allowClearSelection,
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
          options.map((option) => (
            <SelectOption
              key={option.id}
              option={option}
              onClick={(e) => {
                e.stopPropagation();
                onSelectOption(option);
                onBlur && onBlur();
                setVisible(false);
              }}
              selected={selectedOption === option.id}
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
          disabled ? "bg-gray-200" : "bg-white",
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
    />
  );
}

const INPUT_BASE_STYLE =
  "w-full flex justify-between items-center h-10 pl-4 rounded-md";

const INPUT_BASIC_STYLE = [
  "border border-gray-300",
  "focus:outline focus:border-blue-400 focus:outline-4 outline-blue-200",
];

const INPUT_FOCUS_STYLE = [
  "outline border-blue-400 outline-4 outline-blue-200",
];

const INPUT_SOLID_STYLE = ["bg-gray-100 focus:bg-gray-200"];
