import { IconType } from "react-icons";
import { Button, ButtonProps } from "./Button";
import { Icon } from "../Icon";

interface ButtonIcon extends ButtonProps {
  icon: IconType;
}

export function ButtonIcon({ icon, ...rest }: ButtonIcon) {
  return (
    <Button className="w-10 !p-0" {...rest}>
      <Icon className="m-auto" IconComponent={icon} />
    </Button>
  );
}
