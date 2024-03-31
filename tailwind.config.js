/** @type {import('tailwindcss').Config} */
import { blue, gray, red, green, yellow } from "tailwindcss/colors";

export const content = ["./src/**/*.{js,ts,jsx,tsx}"];
export const theme = {
  fontSize: {
    sm: ["12px", "14px"],
    base: ["14px", "24px"],
    md: ["16px", "24px"],
    lg: ["20px", "28px"],
    xl: ["24px", "28px"],
  },
  extend: {
    colors: {
      primary: blue,
      secondary: gray,
      danger: red,
      success: green,
      warning: yellow,
    },
  },
};
export const plugins = [];
