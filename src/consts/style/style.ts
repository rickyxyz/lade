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
  "danger-8": "text-danger-8",
  "danger-7": "text-danger-7",
  "danger-6": "text-danger-6",
  "danger-5": "text-danger-5",
  "danger-4": "text-danger-4",
  "danger-3": "text-danger-3",
  "danger-2": "text-danger-2",
  "danger-1": "text-danger-1",
  "success-8": "text-success-8",
  "success-7": "text-success-7",
  "success-6": "text-success-6",
  "success-5": "text-success-5",
  "success-4": "text-success-4",
  "success-3": "text-success-3",
  "success-2": "text-success-2",
  "success-1": "text-success-1",
  "secondary-8": "text-secondary-8",
  "secondary-7": "text-secondary-7",
  "secondary-6": "text-secondary-6",
  "secondary-5": "text-secondary-5",
  "secondary-4": "text-secondary-4",
  "secondary-3": "text-secondary-3",
  "secondary-2": "text-secondary-2",
  "secondary-1": "text-secondary-1",
  "primary-8": "text-primary-8",
  "primary-7": "text-primary-7",
  "primary-6": "text-primary-6",
  "primary-5": "text-primary-5",
  "primary-4": "text-primary-4",
  "primary-3": "text-primary-3",
  "primary-2": "text-primary-2",
  "primary-1": "text-primary-1",
};

export type FontColor = keyof typeof FONT_COLOR;
