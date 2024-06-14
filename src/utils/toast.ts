import { ToastType } from "@/contexts";

// eslint-disable-next-line @typescript-eslint/no-empty-function
let handleAddToast: (toast: ToastType) => void = () => {};

export function setAddToast(func: (toast: ToastType) => void) {
  handleAddToast = func;
}

export function addToast(toast: ToastType) {
  handleAddToast(toast);
}
