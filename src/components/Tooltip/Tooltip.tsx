import {
  HTMLAttributes,
  ReactNode,
  RefObject,
  forwardRef,
  useMemo,
  useState,
} from "react";
import clsx from "clsx";
import { StateType } from "@/types";

export interface TooltipBaseProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  classNameInner?: string;
  optionWidth?: number;
  direction?: "left" | "right";
  disabled?: boolean;
  ref?: RefObject<HTMLDivElement>;
  stateVisible?: StateType<boolean>;
  showOnHover?: boolean;
  type?: "tooltip" | "menu";
  topOffset?: number;
  onBlur?: () => void;
}

export type TooltipProps = {
  triggerElement?: ReactNode;
  hiddenElement: ReactNode;
} & TooltipBaseProps;

export const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(
  function Component(
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
      ...rest
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
            "border border-secondary-100 bg-white shadow-md z-10 rounded-md",
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
        // onBlur={() => {
        //   onBlur && onBlur();
        //   setVisible(false);
        // }}
        onMouseLeave={() => {
          if (showOnHover) {
            onBlur && onBlur();
            setVisible(false);
          }
        }}
        ref={ref}
        tabIndex={disabled ? undefined : 0}
        {...rest}
      >
        {visible && renderHiddenElement}
        {triggerElement}
      </div>
    );
  }
);
