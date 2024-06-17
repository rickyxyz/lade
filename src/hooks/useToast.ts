import { useCallback, useContext, useEffect, useMemo } from "react";
import { ToastContext, ToastInternalType, ToastType } from "@/contexts";
import { setAddToast } from "@/utils";

export function useToast() {
  const [toasts, setToasts] = useContext(ToastContext);

  const handleAddToast = useCallback(
    (toast: ToastType) => {
      const currentTime = new Date().getTime().toString();
      const currentId = `${currentTime}${Math.random()}`;
      const internalToast: ToastInternalType = {
        ...toast,
        id: currentId,
      };

      setToasts((prev) => [...prev, internalToast]);
      setTimeout(() => {
        setToasts((prev) => prev.filter(({ id }) => id != internalToast.id));
      }, 7 * 1000);
    },
    [setToasts]
  );

  const handleDeleteToast = useCallback(
    (targetId: string) => {
      setToasts((prev) => prev.filter(({ id }) => id !== targetId));
    },
    [setToasts]
  );

  useEffect(() => {
    setAddToast(handleAddToast);
  }, [handleAddToast, setToasts]);

  return useMemo(
    () => ({
      toasts,
      addToast: handleAddToast,
      deleteToast: handleDeleteToast,
    }),
    [handleAddToast, handleDeleteToast, toasts]
  );
}
