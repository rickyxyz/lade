import { useDevice } from "@/hooks";
import { StateType } from "@/types";
import clsx from "clsx";
import { ReactNode } from "react";

export interface ModalProps {
  children: ReactNode;
  stateVisible: StateType<boolean>;
  className?: string;
}

export function Modal({ children, className, stateVisible }: ModalProps) {
  const [visible, setVisible] = stateVisible;

  const { device } = useDevice();

  return visible ? (
    <div
      className={clsx(
        "fixed left-0 top-0 z-30",
        "flex items-center justify-center"
      )}
      style={{
        background: "rgba(0,0,0,0.5)",
        width: "100dvw",
        height: "100dvh",
      }}
      onClick={() => {
        setVisible(false);
      }}
    >
      <div
        className={clsx(
          className,
          "bg-white border border-secondary-200",
          device === "mobile" ? "self-end rounded-t-lg" : "rounded-lg"
        )}
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
