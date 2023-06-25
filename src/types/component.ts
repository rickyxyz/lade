import { ReactNode } from "react";

export type SelectOptionType<K = string> = {
  id: K;
  text: string;
  disabled?: boolean;
};

export type DropdownOptionType = {
  id: string;
  className?: string;
  element: ReactNode;
  onClick: () => void;
};
