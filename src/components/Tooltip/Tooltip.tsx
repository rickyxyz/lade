import { ReactNode, RefObject, forwardRef, useMemo, useState } from "react";
import clsx from "clsx";
import { StateType } from "@/types";

export type TooltipBaseProps = {
  className?: string;
  classNameInner?: string;
  optionWidth?: number;
  direction?: "left" | "right";
  disabled?: boolean;
  ref?: RefObject<HTMLDivElement>;
  stateVisible?: StateType<boolean>;
  showOnHover?: boolean;
  topOffset?: number;
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
    classNameInner,
    optionWidth = 300,
    direction = "right",
    disabled,
    triggerElement,
    hiddenElement,
    stateVisible,
    showOnHover,
    topOffset = 48,
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
          "absolute h-fit flex flex-col",
          "border border-gray-100 bg-white shadow-md z-10",
          classNameInner
        )}
        style={{
          minWidth: optionWidth,
          left: direction === "left" ? undefined : 0,
          right: direction === "right" ? 0 : undefined,
          top: topOffset,
        }}
      >
        {hiddenElement}
      </div>
    ),
    [classNameInner, direction, hiddenElement, optionWidth, topOffset]
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
      onMouseEnter={() => {
        if (showOnHover) {
          !disabled && setVisible(true);
        }
      }}
      onClick={() => {
        if (!visible && !disabled) setVisible(true);
      }}
      onBlur={() => {
        onBlur && onBlur();
        setVisible(false);
      }}
      onMouseLeave={() => {
        if (showOnHover) {
          onBlur && onBlur();
          setVisible(false);
        }
      }}
      ref={ref}
      tabIndex={0}
    >
      {visible && renderHiddenElement}
      {triggerElement}
    </div>
  );
});
