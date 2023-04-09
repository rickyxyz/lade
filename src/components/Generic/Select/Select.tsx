import { createRef, useCallback, useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import { SelectOptionType, StateType } from "@/types";
import { Icon } from "../Icon";

type SelectVariant = "basic" | "solid";

export interface SelectProps<
  X extends string,
  Y extends SelectOptionType<X>[]
> {
  stateObject: [SelectOptionType<X>, (newValue: SelectOptionType<X>) => void];
  variant?: SelectVariant;
  className?: string;
  options: Y;
}

export function Select<X extends string, Y extends SelectOptionType<X>[]>({
  stateObject,
  variant = "basic",
  className,
  options,
}: SelectProps<X, Y>) {
  const [state, setState] = stateObject;
  const [visible, setVisible] = useState(false);
  const [touched, setTouched] = useState(false);
  const selectRef = createRef<HTMLDivElement>();

  const renderOptions = useMemo(
    () => (
      <div
        className={clsx(
          "absolute top-12 h-fit flex flex-col",
          "border border-gray-100 bg-white shadow-md z-10",
          className
        )}
      >
        {options.map((option) => (
          <div
            className="px-4 py-2 hover:bg-gray-50"
            onClick={(e) => {
              setState(option);
              setVisible(false);
              selectRef.current?.blur();
            }}
            key={option.key}
          >
            {option.text}
          </div>
        ))}
      </div>
    ),
    [className, options, selectRef, setState]
  );

  return (
    <div
      className={clsx(
        "flex flex-row-reverse relative overflow-visible cursor-pointer",
        className
      )}
      onFocus={() => setVisible(true)}
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
          variant === "solid" && INPUT_SOLID_STYLE
        )}
      >
        <span>{state.text}</span>
        <Icon icon="chevronDown" size="sm" className="mr-2" />
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
