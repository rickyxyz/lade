import { ButtonVariantType, GenericColorType } from "@/types";
import Style from "./button.json";

export const BUTTON_VARIOUS_STYLE: Record<
  ButtonVariantType,
  Record<GenericColorType, string[]>
> = Style;
