import { ReactNode, RefObject, forwardRef, useMemo, useState } from "react";
import clsx from "clsx";
import { StateType } from "@/types";

export type TooltipBaseProps = {
  className?: string;
  optionWidth?: number;
  direction?: "left" | "right";
  disabled?: boolean;
  ref?: RefObject<HTMLDivElement>;
  stateVisible?: StateType<boolean>;
  onBlur?: () => void;
};

export type TooltipProps = {
  triggerElement: ReactNode;
  hiddenElement: ReactNode;
} & TooltipBaseProps;

// eslint-disable-next-line react/display-name, @typescript-eslint/no-explicit-any
export const Tooltip = forwardRef<any, any>(function (
  {
    className,
    optionWidth = 300,
    direction = "right",
    disabled,
    triggerElement,
    hiddenElement,
    stateVisible,
    onBlur,
  }: TooltipProps,
  ref
) {
  const selfVisible = useState(false);
  const [visible, setVisible] = stateVisible ?? selfVisible;

  const renderHiddenElement = useMemo(
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
        {hiddenElement}
      </div>
    ),
    [className, direction, hiddenElement, optionWidth]
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
      onClick={() => {
        if (!visible && !disabled) setVisible(true);
      }}
      onBlur={() => {
        onBlur && onBlur();
        setVisible(false);
      }}
      ref={ref}
      tabIndex={0}
    >
      {visible && renderHiddenElement}
      {triggerElement}
    </div>
  );
});
