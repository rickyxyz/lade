import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";

export type HTMLProps<T> = DetailedHTMLProps<ButtonHTMLAttributes<T>, T>;

export * from "./icon";
export * from "./problem";
