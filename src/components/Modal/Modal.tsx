import { StateType } from "@/types";
import clsx from "clsx";
import { ReactNode } from "react";

export interface ModalProps {
  children: ReactNode;
  stateVisible: StateType<boolean>;
}

export function Modal({ children, stateVisible }: ModalProps) {
  const [visible, setVisible] = stateVisible;

  return visible ? (
    <div
      className={clsx(
        "fixed left-0 top-0 w-screen h-screen z-30",
        "flex items-center justify-center"
      )}
      style={{
        background: "rgba(0,0,0,0.5)",
      }}
      onClick={() => {
        setVisible(false);
      }}
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {children}
      </div>
    </div>
  ) : (
    <></>
  );
}
