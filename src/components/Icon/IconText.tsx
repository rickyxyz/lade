import { Icon, IconProps } from "./Icon";
import clsx from "clsx";

export interface IconTextProps extends IconProps {
  classNameDiv?: string;
  text: string;
}

export function IconText({
  IconComponent,
  text,
  className,
  ...rest
}: IconTextProps) {
  return (
    <div className={clsx("flex items-center text-base", className)}>
      <Icon IconComponent={IconComponent} className="mr-2" {...rest} />
      {text}
    </div>
  );
}
