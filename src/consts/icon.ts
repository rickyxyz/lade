import { IconNameType } from "@/types";
import {
  BsCheck,
  BsChevronDown,
  BsEye,
  BsFillClipboardCheckFill,
  BsFillEyeFill,
  BsX,
} from "react-icons/bs";
import { BiLoaderAlt } from "react-icons/bi";
import { IconType } from "react-icons/lib";

export const ICONS: Record<IconNameType, IconType> = {
  check: BsCheck,
  X: BsX,
  eye: BsEye,
  eyeFill: BsFillEyeFill,
  clipboardCheckFill: BsFillClipboardCheckFill,
  chevronDown: BsChevronDown,
  loaderAlt: BiLoaderAlt,
};
