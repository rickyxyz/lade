import { useCallback } from "react";
import { StateType } from "@/types";
import { Tooltip, TooltipProps } from "../Tooltip";

export interface DropdownProps extends Omit<TooltipProps, "ref"> {
  classNameOption?: string;
  stateVisible: StateType<boolean>;
}

export function Dropdown({ stateVisible, onBlur, ...rest }: DropdownProps) {
  const [visible, setVisible] = stateVisible;

  const handleBlur = useCallback(() => {
    setVisible(false);
    onBlur && onBlur();
  }, [onBlur, setVisible]);

  return (
    <>
      <Tooltip stateVisible={stateVisible} {...rest} />
      {visible && (
        <div
          className="fixed top-0 left-0 w-screen h-screen"
          onClick={handleBlur}
          style={{
            zIndex: 9,
          }}
        />
      )}
    </>
  );
}
