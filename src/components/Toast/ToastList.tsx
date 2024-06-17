import clsx from "clsx";
import { ToastInternalType } from "@/contexts";
import { StateType } from "@/types";
import { Toast } from "./Toast";
import { useToast } from "@/hooks/useToast";

interface ToastListProps {
  width: number;
}

export function ToastList({ width }: ToastListProps) {
  const { toasts, deleteToast } = useToast();

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
            deleteToast(toast.id);
          }}
        />
      ))}
    </div>
  );
}
