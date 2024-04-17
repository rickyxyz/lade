import { createContext } from "react";
import { LAYOUT_DEFAULT } from "@/consts";
import { LayoutContextType } from "@/types";

export const LayoutContext = createContext<LayoutContextType>(LAYOUT_DEFAULT);
