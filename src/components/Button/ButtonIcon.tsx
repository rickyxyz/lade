import { Button, ButtonProps } from "./Button";
import { Icon, IconSizeType } from "../Icon";
import clsx from "clsx";
import { SvgIconComponent } from "@mui/icons-material";
import { ButtonSizeType } from "@/types";

interface ButtonIcon extends ButtonProps {
  icon: SvgIconComponent;
  iconSize?: IconSizeType;
  iconClassName?: string;
}

export function ButtonIcon({
  icon,
  size,
  iconSize = "m",
  iconClassName,
  className,
  ...rest
}: ButtonIcon) {
  return (
    <Button
      className={clsx("!px-0", BUTTON_SIZE_STYLE[size ?? "m"], className)}
      {...rest}
    >
      <Icon
        size={iconSize}
        className={clsx("m-auto", iconClassName)}
        IconComponent={icon}
      />
    </Button>
  );
}

const BUTTON_SIZE_STYLE: Record<ButtonSizeType, string> = {
  m: "!w-10 !h-10",
  s: "!w-8 !h-8",
  xs: "!w-6 !h-6 !py-0",
};
