import { Icon, IconProps } from "./Icon";
import clsx from "clsx";

export interface IconTextProps extends IconProps {
  text: string;
}

export function IconText({ icon, size, text, className }: IconTextProps) {
  return (
    <div className={clsx("flex items-center text-sm", className)}>
      <Icon icon={icon} size={size} className={clsx("mr-2", className)} />
      {text}
    </div>
  );
}
