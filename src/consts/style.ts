export const FONT_SIZE = {
  xl: "!text-xl",
  l: "!text-lg !leading-8",
  "l-alt": "!text-lg-alt",
  m: "!text-md",
  base: "",
  "m-alt": "!text-md-alt",
  s: "!text-sm",
} as const;

export type FontSize = keyof typeof FONT_SIZE;

export const FONT_WEIGHT = {
  black: "font-black",
  extrabold: "font-extrabold",
  bold: "font-bold",
  semibold: "font-semibold",
  medium: "font-medium",
  normal: "font-normal",
  light: "font-light",
  extralight: "font-extralight",
  thin: "font-thin",
};

export type FontWeight = keyof typeof FONT_WEIGHT;

export const FONT_COLOR = {
  inherit: "text-inherit",
  "danger-8": "text-red-800",
  "danger-7": "text-red-700",
  "danger-6": "text-red-600",
  "danger-5": "text-red-500",
  "danger-4": "text-red-400",
  "danger-3": "text-red-300",
  "danger-2": "text-red-200",
  "danger-1": "text-red-100",
  "success-8": "text-green-800",
  "success-7": "text-green-700",
  "success-6": "text-green-600",
  "success-5": "text-green-500",
  "success-4": "text-green-400",
  "success-3": "text-green-300",
  "success-2": "text-green-200",
  "success-1": "text-green-100",
  "secondary-8": "text-zinc-800",
  "secondary-7": "text-zinc-700",
  "secondary-6": "text-zinc-600",
  "secondary-5": "text-zinc-500",
  "secondary-4": "text-zinc-400",
  "secondary-3": "text-zinc-300",
  "secondary-2": "text-zinc-200",
  "secondary-1": "text-zinc-100",
  "primary-8": "text-blue-800",
  "primary-7": "text-blue-700",
  "primary-6": "text-blue-600",
  "primary-5": "text-blue-500",
  "primary-4": "text-blue-400",
  "primary-3": "text-blue-300",
  "primary-2": "text-blue-200",
  "primary-1": "text-blue-100",
};

export type FontColor = keyof typeof FONT_COLOR;
