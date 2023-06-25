import { IconNameType } from "@/types";
import {
  BsCaretDownFill,
  BsCheck,
  BsChevronDown,
  BsEye,
  BsFillClipboardCheckFill,
  BsFillEyeFill,
  BsInfoCircleFill,
  BsThreeDotsVertical,
  BsX,
} from "react-icons/bs";
import { BiLoaderAlt } from "react-icons/bi";
import { IconType } from "react-icons/lib";
import { MdLogout } from "react-icons/md";

export const ICONS: Record<IconNameType, IconType> = {
  check: BsCheck,
  X: BsX,
  eye: BsEye,
  eyeFill: BsFillEyeFill,
  clipboardCheckFill: BsFillClipboardCheckFill,
  chevronDown: BsChevronDown,
  loaderAlt: BiLoaderAlt,
  infoCircleFill: BsInfoCircleFill,
  caretDownFill: BsCaretDownFill,
  logout: MdLogout,
  threeDots: BsThreeDotsVertical,
};
