import clsx from "clsx";
import { ToastInternalType } from "@/contexts";
import { StateType } from "@/types";
import { Toast } from "./Toast";

interface ToastListProps {
  stateToasts: StateType<ToastInternalType[]>;
  width: number;
}

export function ToastList({ stateToasts, width }: ToastListProps) {
  const [toasts, setToasts] = stateToasts;

  return (
    <div
      className={clsx(
        "fixed w-0 left-1/2 bottom-8 gap-2 overflow-visible",
        "flex flex-col-reverse justify-center items-center"
      )}
    >
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          toast={toast}
          maxWidth={width}
          onClose={() => {
            setToasts((prev) => prev.filter(({ id }) => id !== toast.id));
          }}
        />
      ))}
    </div>
  );
}
