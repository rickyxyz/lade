import { createContext } from "react";
import { StateType } from "@/types";

export interface ToastType {
  text: string;
  duration?: number;
}

export interface ToastInternalType extends ToastType {
  id: string;
}

export interface ToastContextType {
  stateToasts: StateType<ToastInternalType[]>;
}

export const ToastContext = createContext<StateType<ToastInternalType[]>>([
  [],
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  () => {},
]);
