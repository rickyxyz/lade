import { Dispatch, SetStateAction } from "react";

export type StateType<K> = [K, Dispatch<SetStateAction<K>>];

export * from "./icon";
export * from "./problem";
export * from "./select";
