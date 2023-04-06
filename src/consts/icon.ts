import { IconNameType } from "@/types";
import {
  BsCheck,
  BsEye,
  BsFillClipboardCheckFill,
  BsFillEyeFill,
  BsX,
} from "react-icons/bs";
import { IconType } from "react-icons/lib";

export const ICONS: Record<IconNameType, IconType> = {
  check: BsCheck,
  X: BsX,
  eye: BsEye,
  eyeFill: BsFillEyeFill,
  clipboardCheckFill: BsFillClipboardCheckFill,
};
