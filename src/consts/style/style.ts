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
  "danger-8": "text-danger-800",
  "danger-7": "text-danger-700",
  "danger-6": "text-danger-600",
  "danger-5": "text-danger-500",
  "danger-4": "text-danger-400",
  "danger-3": "text-danger-300",
  "danger-2": "text-danger-200",
  "danger-1": "text-danger-100",
  "success-8": "text-success-800",
  "success-7": "text-success-700",
  "success-6": "text-success-600",
  "success-5": "text-success-500",
  "success-4": "text-success-400",
  "success-3": "text-success-300",
  "success-2": "text-success-200",
  "success-1": "text-success-100",
  "secondary-8": "text-secondary-800",
  "secondary-7": "text-secondary-700",
  "secondary-6": "text-secondary-600",
  "secondary-5": "text-secondary-500",
  "secondary-4": "text-secondary-400",
  "secondary-3": "text-secondary-300",
  "secondary-2": "text-secondary-200",
  "secondary-1": "text-secondary-100",
  "primary-8": "text-primary-800",
  "primary-7": "text-primary-700",
  "primary-6": "text-primary-600",
  "primary-5": "text-primary-500",
  "primary-4": "text-primary-400",
  "primary-3": "text-primary-300",
  "primary-2": "text-primary-200",
  "primary-1": "text-primary-100",
};

export type FontColor = keyof typeof FONT_COLOR;
