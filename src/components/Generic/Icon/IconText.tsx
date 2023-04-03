import { Icon } from "./Icon";
import { IconNameType } from "@/types";
import clsx from "clsx";

export interface IconTextProps {
  icon: IconNameType;
  text: string;
  className?: string;
}

export function IconText({ icon, text, className }: IconTextProps) {
  return (
    <div className={clsx("flex items-center text-sm", className)}>
      <Icon icon={icon} className={clsx("mr-2", className)} />
      {text}
    </div>
  );
}
