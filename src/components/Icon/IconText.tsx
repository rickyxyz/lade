import { Paragraph } from "../Paragraph";
import { Icon, IconProps } from "./Icon";
import clsx from "clsx";

export interface IconTextProps extends IconProps {
  classNameDiv?: string;
  text: string;
  onClick?: () => void;
}

export function IconText({
  IconComponent,
  text,
  className,
  onClick,
  ...rest
}: IconTextProps) {
  return (
    <div
      className={clsx("flex items-center text-base", className)}
      onClick={onClick}
    >
      <Icon IconComponent={IconComponent} className="mr-2" {...rest} />
      <Paragraph color="inherit">{text}</Paragraph>
    </div>
  );
}
