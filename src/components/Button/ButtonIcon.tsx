import { Button, ButtonProps, ButtonSizeType } from "./Button";
import { Icon, IconSizeType } from "../Icon";
import clsx from "clsx";
import { SvgIconComponent } from "@mui/icons-material";

interface ButtonIcon extends ButtonProps {
  icon: SvgIconComponent;
  iconSize?: IconSizeType;
}

export function ButtonIcon({
  icon,
  size,
  iconSize = "m",
  ...rest
}: ButtonIcon) {
  return (
    <Button className={clsx("!px-0", BUTTON_SIZE_STYLE[size ?? "m"])} {...rest}>
      <Icon size={iconSize} className="m-auto" IconComponent={icon} />
    </Button>
  );
}

const BUTTON_SIZE_STYLE: Record<ButtonSizeType, string> = {
  m: "!w-10 !h-10",
  s: "!w-8 !h-8",
};
