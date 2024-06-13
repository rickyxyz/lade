import {
  ToastContext,
  ToastInternalType,
  ToastType,
} from "@/contexts/ToastContext";
import { useCallback, useContext, useMemo } from "react";

export function useToast() {
  const [toasts, setToasts] = useContext(ToastContext);

  const handleAddToast = useCallback(
    (toast: ToastType) => {
      const currentTime = new Date().getTime().toString();
      const currentId = `${currentTime}${Math.random()}`;
      const newToast: ToastInternalType = {
        ...toast,
        id: currentId,
      };

      setToasts((prev) => [...prev, newToast]);
      // setTimeout(() => {
      //   setToasts((prev) => prev.filter(({ id }) => id != newToast.id));
      // }, 5 * 1000);
    },
    [setToasts]
  );

  return useMemo(
    () => ({
      toasts,
      addToast: handleAddToast,
    }),
    [handleAddToast, toasts]
  );
}
