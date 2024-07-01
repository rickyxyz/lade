import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import clsx from "clsx";
import { SelectOptionType } from "@/types";
import { Icon } from "../Icon";
import { SelectOption } from "./SelectOption";
import { Tooltip, TooltipBaseProps } from "../Tooltip";
import { ExpandMore, HourglassEmpty } from "@mui/icons-material";
import { useDevice } from "@/hooks";
import { Loader } from "../Loader";
import { Paragraph } from "../Paragraph";
import { Dropdown } from "../Dropdown";

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
  label?: string;
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
  label,
  onSelectOption,
  onBlur,
}: SelectProps<X, Y>) {
  const stateVisible = useState(false);
  const [visible, setVisible] = stateVisible;
  const [focus, setFocus] = useState(false);
  const [currentOption, currentIndex] = useMemo(() => {
    let optionIndex: number | undefined;
    let optionText = unselectedText;

    (options ?? []).forEach((option, i) => {
      if (option.id === selectedOption) {
        optionText = option.text;
        optionIndex = i;
      }
    });

    return [optionText, optionIndex];
  }, [options, selectedOption, unselectedText]);
  const [index, setIndex] = useState<number | undefined>(currentIndex);
  const { device } = useDevice();
  const selectRef = useRef<HTMLSelectElement>(null);

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
              isHighlighted={
                index === i || (i == 0 && index === undefined && !optional)
              }
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
      optional,
      onSelectOption,
      onBlur,
      setVisible,
    ]
  );

  const renderMobileTrigger = useMemo(
    () => (
      <select
        className={clsx(
          "opacity-0 absolute left-0 top-0 w-full h-full",
          device === "desktop" && "hidden"
        )}
        ref={selectRef}
        onBlur={() => {
          setFocus(false);
        }}
        onChange={(e) => {
          const chosen = e.target.value;
          if (chosen === "reset") {
            onSelectOption(undefined);
          } else {
            const id = chosen.replace("choice_", "");
            const selected = options.findIndex((option) => option.id === id);
            if (selected != -1) {
              onSelectOption(options[selected]);
              setIndex(selected);
            }
          }
          setFocus(false);
        }}
      >
        {allowClearSelection && <option value="reset">Any</option>}
        {options ? (
          options.map((option) => (
            <option key={option.id} value={`choice_${option.id}`}>
              {option.text}
            </option>
          ))
        ) : (
          <></>
        )}
      </select>
    ),
    [allowClearSelection, device, onSelectOption, options]
  );

  const renderTrigger = useMemo(
    () => (
      <div
        className={clsx(
          INPUT_BASE_STYLE,
          (visible || focus) && INPUT_FOCUS_STYLE,
          variant === "basic" && INPUT_BASIC_STYLE,
          variant === "solid" && INPUT_SOLID_STYLE,
          disabled ? "bg-secondary-200" : "bg-white",
          "relative text-ellipsis whitespace-nowrap overflow-hidden",
          inputClassName
        )}
        onClick={() => {
          if (device !== "desktop") {
            selectRef.current?.focus();
            setFocus(true);
          }
        }}
      >
        {renderMobileTrigger}
        <span className="truncate w-[calc(100%-2rem)]">{currentOption}</span>
        <Icon
          IconComponent={ExpandMore}
          className="absolute right-2"
          size="s"
        />
      </div>
    ),
    [
      currentOption,
      device,
      disabled,
      focus,
      inputClassName,
      renderMobileTrigger,
      variant,
      visible,
    ]
  );

  return (
    <div className="w-full h-min">
      <Paragraph
        size="s"
        color="secondary-5"
        onClick={() => {
          if (!disabled && device === "desktop") setVisible((prev) => !prev);
        }}
      >
        {label}
      </Paragraph>
      <Dropdown
        triggerElement={renderTrigger}
        hiddenElement={loading ? <Loader /> : renderOptions}
        className={className}
        stateVisible={stateVisible}
        disabled={disabled || device !== "desktop"}
        onKeyDown={(e) => {
          if (e.key === "Tab") return;

          e.preventDefault();

          setIndex((prev) => {
            if (e.key === "ArrowUp") {
              if (prev === 0 && !optional) return 0;

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
      {/* //<Tooltip />
      {visible && (
        <div
          className="fixed w-screen h-screen top-0 left-0"
          onClick={() => {
            onBlur && onBlur();
            setVisible(false);
          }}
        ></div>
      )} */}
    </div>
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
