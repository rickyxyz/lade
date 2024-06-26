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

export interface PaginationData {
  page: number;
  maxPages: number;
  count: number;
  initialized: boolean;
}

export interface PaginationCalculatedData {
  page: number;
  maxPages: number;
  count: number;
  visiblePages: number;
  half: number;
  style: "first" | "last" | "middle";
  contentFrom: number;
  contentTo: number;
}

export type ButtonVariantType = "solid" | "outline" | "outline-2" | "ghost";

export type ButtonOrderType = "first" | "middle" | "last";

export type ButtonDirectionType = "row" | "column";

export type ButtonSizeType = "m" | "s" | "xs";
