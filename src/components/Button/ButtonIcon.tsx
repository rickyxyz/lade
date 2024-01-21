import { IconType } from "react-icons";
import { Button, ButtonProps } from "./Button";
import { Icon } from "../Icon";
import clsx from "clsx";

interface ButtonIcon extends ButtonProps {
  icon: IconType;
  size?: "m" | "s";
}

export function ButtonIcon({ icon, size = "m", ...rest }: ButtonIcon) {
  return (
    <Button
      className={clsx("!p-0", size === "m" ? "w-10" : "!w-8 !h-8")}
      {...rest}
    >
      <Icon className="m-auto" IconComponent={icon} />
    </Button>
  );
}
