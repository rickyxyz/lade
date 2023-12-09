import { useEffect, useMemo, useRef, useState } from "react";
import clsx from "clsx";
import { DropdownOptionType } from "@/types";
import { DropdownOption } from "./DropdownOption";
import { Tooltip, TooltipProps } from "../Tooltip";

export interface DropdownProps
  extends Omit<TooltipProps, "hiddenElement" | "ref"> {
  classNameOption?: string;
  options: DropdownOptionType[];
}

export function Dropdown({
  className,
  classNameOption,
  options,
  disabled,
  triggerElement,
  onBlur,
  ...rest
}: DropdownProps) {
  const ref = useRef<HTMLDivElement>();

  const stateVisible = useState(false);
  const [visible, setVisible] = stateVisible;

  const renderOptions = useMemo(
    () =>
      options.map(({ id, element, className: cls, onClick }) => (
        <DropdownOption
          className={clsx(classNameOption, cls)}
          key={`Dropdown_${id}`}
          onClick={(e) => {
            e.stopPropagation();
            onClick();
            onBlur && onBlur();
            setVisible(false);
            if (ref.current) ref.current.blur();
          }}
        >
          {element}
        </DropdownOption>
      )),
    [classNameOption, onBlur, options, setVisible]
  );

  useEffect(() => {
    if (visible && ref.current) ref.current.focus();
  }, [visible]);

  return options.length > 0 ? (
    <Tooltip
      {...rest}
      triggerElement={triggerElement}
      hiddenElement={renderOptions}
      className={className}
      stateVisible={stateVisible}
      disabled={disabled}
      ref={ref}
    />
  ) : (
    <></>
  );
}
