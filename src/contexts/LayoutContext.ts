import { createContext } from "react";
import { LayoutContextType } from "@/types";
import { LAYOUT_DEFAULT } from "@/consts/layout";

export const LayoutContext = createContext<LayoutContextType>(LAYOUT_DEFAULT);
